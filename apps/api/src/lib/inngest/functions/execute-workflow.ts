import { getApp } from '@/app-ref';
import { getExecutor } from '@/lib/executor-registry';
import { inngest } from '@/lib/inngest/client';
import { InngestEvents } from '@/lib/inngest/events';
import { topologicalSort } from '@/lib/inngest/utils';
import { WorkflowsRepository } from '@/modules/workflows/workflows.repository';
import type { NodeTypeEnum } from '@autoflow/shared';
import { ExecutionStatus } from '@/common/enums/execution-status';
import { NonRetriableError } from 'inngest';

export const executeWorkflow = inngest.createFunction(
  {
    id: 'execute-workflow',
    name: 'Execute Workflow',
    description: 'A function to execute a workflow',
    retries: 0, // TODO: change retry for production
  },
  { event: InngestEvents.EXECUTE_WORKFLOW },
  async ({ event, step, publish }) => {
    const eventId = event.id as string;
    const { workflowId, userId, initialData } = event.data as {
      workflowId?: string;
      userId?: string;
      initialData?: Record<string, unknown>;
    };
    if (!workflowId || !userId) {
      throw new NonRetriableError('workflowId and userId are required');
    }

    const repo = getApp().get(WorkflowsRepository);

    try {
      const sortedNodes = await step.run('prepare-workflow', async () => {
        const wf = await repo.findById(workflowId, userId);
        return topologicalSort(wf.nodes, wf.connections);
      });

      // Initialize the context with any initial data from trigger
      let context: Record<string, unknown> = initialData ?? {};

      // Execute each node in the sorted order
      for (const node of sortedNodes) {
        const executor = getExecutor(node.type as NodeTypeEnum);
        context = await executor({
          data: node.data as Record<string, unknown>,
          nodeId: node.id,
          userId,
          context,
          step,
          publish,
        });
      }

      await repo.updateExecutionByInngestEventId(eventId, {
        status: ExecutionStatus.SUCCESS,
        output: context,
        completedAt: new Date(),
      });

      return {
        workflowId,
        result: context,
      };
    } catch (error) {
      await repo.updateExecutionByInngestEventId(eventId, {
        status: ExecutionStatus.FAILED,
        error:
          error instanceof Error ? error.message : 'Workflow execution failed',
        errorStack: error instanceof Error ? (error.stack ?? null) : null,
        completedAt: new Date(),
      });

      throw error;
    }
  },
);
