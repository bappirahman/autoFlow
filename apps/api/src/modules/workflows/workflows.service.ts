import { DRIZZLE_INJECTION_TOKEN } from '@/db';
import * as schema from '@/db/schema';
import { workflow } from '@/db/schema';
import { Inject, Injectable } from '@nestjs/common';
import { and } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres/driver';
import { eq } from 'drizzle-orm/sql/expressions/conditions';

@Injectable()
export class WorkflowsService {
  constructor(
    @Inject(DRIZZLE_INJECTION_TOKEN)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}
  async createWorkflow(userId: string) {
    return this.db
      .insert(workflow)
      .values({
        userId,
        name: 'Test Workflow',
      })
      .returning();
  }
  async removeWorkflow(id: string, userId: string) {
    return this.db
      .delete(workflow)
      .where(and(eq(workflow.id, id), eq(workflow.userId, userId)))
      .returning();
  }

  async getWorkflow(id: string, userId: string) {
    return this.db
      .select()
      .from(workflow)
      .where(and(eq(workflow.id, id), eq(workflow.userId, userId)));
  }

  async updateWorkflowName(id: string, name: string, userId: string) {
    return this.db
      .update(workflow)
      .set({
        name,
        updatedAt: new Date(),
      })
      .where(and(eq(workflow.id, id), eq(workflow.userId, userId)))
      .returning();
  }

  async getAllWorkflows(userId: string) {
    return this.db.select().from(workflow).where(eq(workflow.userId, userId));
  }
}
