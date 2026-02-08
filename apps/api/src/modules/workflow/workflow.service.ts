import { DRIZZLE_INJECTION_TOKEN } from '@/db';
import { Inject, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '@/db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class WorkflowService {
  private readonly logger = new Logger(WorkflowService.name);

  constructor(
    @Inject(DRIZZLE_INJECTION_TOKEN)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async getAllWorkflows() {
    return this.db.select().from(schema.workflow);
  }

  async getWorkflowById(id: string) {
    const [workflow] = await this.db
      .select()
      .from(schema.workflow)
      .where(eq(schema.workflow.id, id))
      .limit(1);

    if (!workflow) {
      throw new NotFoundException('Workflow not found');
    }

    return workflow;
  }

  async createWorkflow(data: Pick<schema.NewWorkflow, 'name'>) {
    const values: schema.NewWorkflow = {
      ...data,
    };
    return this.db.insert(schema.workflow).values(values).returning();
  }

  async deleteWorkflow(id: string) {
    return this.db
      .delete(schema.workflow)
      .where(eq(schema.workflow.id, id))
      .returning();
  }

  // Background event handlers
  handleWorkflowCreated(workflowId: string): void {
    this.logger.log(`Processing workflow creation: ${workflowId}`);
    // TODO: Add analytics, notifications, webhooks, etc.
  }

  handleWorkflowUpdated(workflowId: string): void {
    this.logger.log(`Processing workflow update: ${workflowId}`);
    // TODO: Invalidate caches, notify subscribers, etc.
  }

  handleWorkflowDeleted(workflowId: string): void {
    this.logger.log(`Processing workflow deletion: ${workflowId}`);
    // TODO: Cleanup resources, archive data, etc.
  }
}
