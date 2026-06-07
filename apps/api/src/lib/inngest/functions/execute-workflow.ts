import { getExecutor } from '@/lib/executor-registry';
import { inngest } from '@/lib/inngest/client';
import { topologicalSort } from '@/lib/inngest/utils';
import { WorkflowsRepository } from '@/modules/workflows/workflows.repository';
import type { NodeTypeEnum } from '@autoflow/shared';
import { NonRetriableError } from 'inngest';

export const executeWorkflow = inngest.createFunction(
  {
    id: 'execute-workflow',
    name: 'Execute Workflow',
    description: 'A function to execute a workflow',
    retries: 0,
  },
  { event: 'workflows/execute.workflow' },
  async ({ event, step }) => {
    const { workflowId, userId, initialData } = event.data as {
      workflowId?: string;
      userId?: string;
      initialData?: Record<string, unknown>;
    };

    if (!workflowId || !userId) {
      throw new NonRetriableError('workflowId and userId are required');
    }

    const workflowsRepository = new WorkflowsRepository();

    const sortedNodes = await step.run('prepare-workflow', async () => {
      const wf = await workflowsRepository.findById(workflowId, userId);
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
        context,
        step,
      });
    }
    return {
      workflowId,
      result: context,
    };
  },
);
