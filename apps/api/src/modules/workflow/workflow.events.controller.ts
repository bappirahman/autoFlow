import { Controller } from '@nestjs/common';
import { NestInngest } from 'nest-inngest';
import { AppInngest } from '@/lib/inngest/client';
import {
  WORKFLOW_EVENTS,
  WorkflowCreatedPayload,
  WorkflowUpdatedPayload,
  WorkflowDeletedPayload,
} from '@/lib/inngest/events/workflow.events';
import { WorkflowService } from './workflow.service';

@Controller()
export class WorkflowEventsController {
  constructor(private readonly workflowService: WorkflowService) {}

  @AppInngest.Function({
    id: 'workflow-created-handler',
    name: 'Handle Workflow Created',
  })
  @AppInngest.Trigger({ event: WORKFLOW_EVENTS.CREATED.name })
  async handleWorkflowCreated({
    event,
    step,
  }: NestInngest.context<
    typeof AppInngest,
    typeof WORKFLOW_EVENTS.CREATED.name
  >) {
    const data: WorkflowCreatedPayload = WORKFLOW_EVENTS.CREATED.schema.parse(
      (event as { data: unknown }).data,
    );

    await Promise.resolve(
      step.run('process-workflow-creation', () => {
        this.workflowService.handleWorkflowCreated(data.id);
      }),
    );

    return { success: true, workflowId: data.id };
  }

  @AppInngest.Function({
    id: 'workflow-updated-handler',
    name: 'Handle Workflow Updated',
  })
  @AppInngest.Trigger({ event: WORKFLOW_EVENTS.UPDATED.name })
  async handleWorkflowUpdated({
    event,
    step,
  }: NestInngest.context<
    typeof AppInngest,
    typeof WORKFLOW_EVENTS.UPDATED.name
  >) {
    const data: WorkflowUpdatedPayload = WORKFLOW_EVENTS.UPDATED.schema.parse(
      (event as { data: unknown }).data,
    );

    await Promise.resolve(
      step.run('process-workflow-update', () => {
        this.workflowService.handleWorkflowUpdated(data.id);
      }),
    );

    return { success: true, workflowId: data.id };
  }

  @AppInngest.Function({
    id: 'workflow-deleted-handler',
    name: 'Handle Workflow Deleted',
  })
  @AppInngest.Trigger({ event: WORKFLOW_EVENTS.DELETED.name })
  async handleWorkflowDeleted({
    event,
    step,
  }: NestInngest.context<
    typeof AppInngest,
    typeof WORKFLOW_EVENTS.DELETED.name
  >) {
    const data: WorkflowDeletedPayload = WORKFLOW_EVENTS.DELETED.schema.parse(
      (event as { data: unknown }).data,
    );

    await Promise.resolve(
      step.run('process-workflow-deletion', () => {
        this.workflowService.handleWorkflowDeleted(data.id);
      }),
    );

    return { success: true, workflowId: data.id };
  }
}
