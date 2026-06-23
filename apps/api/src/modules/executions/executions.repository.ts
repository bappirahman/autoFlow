import { execution, workflow } from '@/db/schema';
import { DRIZZLE_INJECTION_TOKEN } from '@/db';
import { GetAllExecutionsDto } from '@/modules/executions/dto/get-all-executions.dto';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { and, count, desc, eq } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type * as schema from '@/db/schema';

type DrizzleDb = NodePgDatabase<typeof schema>;

const executionWithWorkflow = {
  id: execution.id,
  workflowId: execution.workflowId,
  workflowName: workflow.name,
  status: execution.status,
  output: execution.output,
  error: execution.error,
  errorStack: execution.errorStack,
  inngestEventId: execution.inngestEventId,
  startedAt: execution.startedAt,
  completedAt: execution.completedAt,
  createdAt: execution.createdAt,
  updatedAt: execution.updatedAt,
};

@Injectable()
export class ExecutionsRepository {
  constructor(
    @Inject(DRIZZLE_INJECTION_TOKEN) private readonly db: DrizzleDb,
  ) {}

  async findMany(userId: string, { page, pageSize }: GetAllExecutionsDto) {
    const userFilter = eq(workflow.userId, userId);

    const [items, totalCount] = await Promise.all([
      this.db
        .select(executionWithWorkflow)
        .from(execution)
        .innerJoin(workflow, eq(execution.workflowId, workflow.id))
        .where(userFilter)
        .orderBy(desc(execution.startedAt))
        .limit(pageSize)
        .offset((page - 1) * pageSize),
      this.db
        .select({ count: count() })
        .from(execution)
        .innerJoin(workflow, eq(execution.workflowId, workflow.id))
        .where(userFilter)
        .then((res) => res[0]?.count ?? 0),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      items,
      totalCount,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
      page,
      pageSize,
    };
  }

  async findById(id: string, userId: string) {
    const result = await this.db
      .select(executionWithWorkflow)
      .from(execution)
      .innerJoin(workflow, eq(execution.workflowId, workflow.id))
      .where(and(eq(execution.id, id), eq(workflow.userId, userId)))
      .then((res) => res[0]);

    if (!result) throw new NotFoundException('Execution not found');
    return result;
  }
}
