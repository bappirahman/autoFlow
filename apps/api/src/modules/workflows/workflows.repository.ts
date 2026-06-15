import { workflow, node, connection, execution } from '@/db/schema';
import type { Node, Connection, Workflow } from '@/db/schema';
import { DRIZZLE_INJECTION_TOKEN } from '@/db';
import { ExecutionStatus } from '@/common/enums/execution-status';
import { NodeType } from '@autoflow/shared';
import { UpdateWorkflowNameDto } from '@/modules/workflows/dto/update-workflow-name.dto';
import { Inject, Injectable } from '@nestjs/common';
import { and, count, desc, eq, ilike, inArray } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type * as schema from '@/db/schema';

type DrizzleDb = NodePgDatabase<typeof schema>;

type WorkflowWithRelations = Workflow & {
  nodes: Node[];
  connections: Connection[];
};

@Injectable()
export class WorkflowsRepository {
  constructor(
    @Inject(DRIZZLE_INJECTION_TOKEN) private readonly db: DrizzleDb,
  ) {}

  async create(userId: string) {
    const wf = await this.db
      .insert(workflow)
      .values({ userId, name: 'New Workflow' })
      .returning()
      .then((res) => res[0]);

    await this.db.insert(node).values({
      workflowId: wf.id,
      name: 'Start',
      type: NodeType.INITIAL,
      position: { x: 0, y: 0 },
      data: {},
    });

    return wf;
  }

  async findById(id: string, userId: string) {
    const wf = (await this.db.query.workflow.findFirst({
      where: and(eq(workflow.id, id), eq(workflow.userId, userId)),
      with: {
        nodes: true,
        connections: true,
      },
    })) as WorkflowWithRelations | undefined;

    if (!wf) {
      throw new Error('Workflow not found');
    }

    return wf;
  }

  async findMany(
    userId: string,
    {
      page,
      pageSize,
      search,
    }: { page: number; pageSize: number; search?: string },
  ) {
    const filters = and(
      eq(workflow.userId, userId),
      ...(search ? [ilike(workflow.name, `%${search}%`)] : []),
    );

    const [items, totalCount] = await Promise.all([
      this.db.query.workflow.findMany({
        where: filters,
        orderBy: [desc(workflow.updatedAt)],
        limit: pageSize,
        offset: (page - 1) * pageSize,
      }),
      this.db
        .select({ count: count() })
        .from(workflow)
        .where(filters)
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

  async update(id: string, userId: string, payload: UpdateWorkflowNameDto) {
    return this.db.transaction(async (tx) => {
      await tx
        .update(workflow)
        .set({
          ...(payload.name !== undefined && { name: payload.name }),
          updatedAt: new Date(),
        })
        .where(and(eq(workflow.id, id), eq(workflow.userId, userId)));

      if (payload.nodes !== undefined) {
        const existingNodes = await tx
          .select({ id: node.id })
          .from(node)
          .where(eq(node.workflowId, id));

        const existingIds = new Set(existingNodes.map((n) => n.id));
        const incomingIds = new Set(payload.nodes.map((n) => n.id));

        const toInsert = payload.nodes.filter((n) => !existingIds.has(n.id));
        const toUpdate = payload.nodes.filter((n) => existingIds.has(n.id));
        const toDelete = existingNodes.filter((n) => !incomingIds.has(n.id));

        if (toDelete.length) {
          await tx.delete(node).where(
            inArray(node.id, toDelete.map((n) => n.id)),
          );
        }

        if (toInsert.length) {
          await tx.insert(node).values(
            toInsert.map((n) => ({
              id: n.id,
              workflowId: id,
              type: n.type,
              name: n.type || 'unknown',
              position: n.position,
              data: n.data ?? {},
            })),
          );
        }

        for (const n of toUpdate) {
          await tx
            .update(node)
            .set({ position: n.position, data: n.data ?? {}, updatedAt: new Date() })
            .where(eq(node.id, n.id));
        }
      }

      if (payload.edges !== undefined) {
        await tx.delete(connection).where(eq(connection.workflowId, id));

        if (payload.edges.length) {
          await tx.insert(connection).values(
            payload.edges.map((e) => ({
              workflowId: id,
              fromNodeId: e.source,
              toNodeId: e.target,
              fromOutput: e.sourceHandle ?? 'main',
              toInput: e.targetHandle ?? 'main',
            })),
          );
        }
      }

      return tx.query.workflow.findFirst({
        where: and(eq(workflow.id, id), eq(workflow.userId, userId)),
        with: { nodes: true, connections: true },
      });
    });
  }

  async createExecution(workflowId: string, inngestEventId: string) {
    return this.db
      .insert(execution)
      .values({ workflowId, status: ExecutionStatus.RUNNING, inngestEventId })
      .returning()
      .then((res) => res[0]);
  }

  async updateExecutionByInngestEventId(
    inngestEventId: string,
    payload: {
      status: (typeof ExecutionStatus)[keyof typeof ExecutionStatus];
      error?: string | null;
      errorStack?: string | null;
      output?: Record<string, unknown> | null;
      completedAt?: Date;
    },
  ) {
    return this.db
      .update(execution)
      .set({
        ...payload,
        updatedAt: new Date(),
      })
      .where(eq(execution.inngestEventId, inngestEventId))
      .returning()
      .then((res) => res[0]);
  }

  async delete(id: string, userId: string) {
    return this.db
      .delete(workflow)
      .where(and(eq(workflow.id, id), eq(workflow.userId, userId)))
      .returning();
  }
}
