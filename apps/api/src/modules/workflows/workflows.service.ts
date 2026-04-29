import { DRIZZLE_INJECTION_TOKEN } from '@/db';
import * as schema from '@/db/schema';
import { workflow } from '@/db/schema';
import { GetAllWorkflowsDto } from '@/modules/workflows/dto/get-all-workflow.dto';
import { Inject, Injectable } from '@nestjs/common';
import { desc, ilike } from 'drizzle-orm';
import { and, count } from 'drizzle-orm';
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
        name: 'New Workflow',
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

  async updateWorkflow(
    id: string,
    data: {
      name?: string;
    },
    userId: string,
  ) {
    return this.db
      .update(workflow)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(and(eq(workflow.id, id), eq(workflow.userId, userId)))
      .returning();
  }

  async getAllWorkflows(
    userId: string,
    getAllWorkflowsDto: GetAllWorkflowsDto,
  ) {
    const { page, pageSize, search } = getAllWorkflowsDto;
    const filters = [
      eq(workflow.userId, userId),
      ...(search ? [ilike(workflow.name, `%${search}%`)] : []),
    ];
    const [items, totalCount] = await Promise.all([
      this.db
        .select()
        .from(workflow)
        .where(and(...filters))
        .orderBy(desc(workflow.updatedAt))
        .offset((page - 1) * pageSize)
        .limit(pageSize),
      this.db
        .select({ count: count() })
        .from(workflow)
        .where(and(...filters))
        .then((res) => res[0]?.count ?? 0),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      items,
      totalCount,
      totalPages,
      hasNextPage,
      hasPreviousPage,
      page,
      pageSize,
    };
  }
}
