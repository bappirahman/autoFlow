import { DRIZZLE_INJECTION_TOKEN } from '@/db';
import * as schema from '@/db/schema';
import { workflow, node, connection, execution } from '@/db/schema';
import type { Node, Connection, Workflow } from '@/db/schema';
import { ExecutionStatus } from '@/common/enums/execution-status';
import { inngest } from '@/lib/inngest/client';
import { GetAllWorkflowsDto } from '@/modules/workflows/dto/get-all-workflows.dto';
import { UpdateWorkflowNameDto } from '@/modules/workflows/dto/update-workflow-name.dto';
import { NodeType } from '@autoflow/shared';
import { Inject, Injectable } from '@nestjs/common';
import { and, count, desc, eq, ilike } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres/driver';

// ─── Relational result shapes ────────────────────────────────────────────────
// Drizzle's `BuildQueryResult` conditional type is too deep for TS to infer
// automatically on complex schemas, so we define the shapes explicitly.

type WorkflowWithRelations = Workflow & {
  nodes: Node[];
  connections: Connection[];
};

@Injectable()
export class WorkflowsService {
  constructor(
    @Inject(DRIZZLE_INJECTION_TOKEN)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async createWorkflow(userId: string) {
    const wf = await this.db
      .insert(workflow)
      .values({ userId, name: 'New Workflow' })
      .returning()
      .then((res) => res[0]);

    // Seed the workflow with a default INITIAL trigger node
    await this.db.insert(node).values({
      workflowId: wf.id,
      name: 'Start',
      type: NodeType.INITIAL,
      position: { x: 0, y: 0 },
      data: {},
    });

    return wf;
  }

  async getOneWorkflow(id: string, userId: string) {
    // Single query — Drizzle joins nodes + connections via the declared relations
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

    // Shape nodes/connections into the React Flow format expected by the frontend
    const parsedNodes = wf.nodes.map((n) => ({
      id: n.id,
      type: n.type,
      position: n.position,
      data: n.data,
    }));

    const edges = wf.connections.map((conn) => ({
      id: conn.id,
      source: conn.fromNodeId,
      target: conn.toNodeId,
      sourceHandle: conn.fromOutput,
      targetHandle: conn.toInput,
    }));

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { nodes: _nodes, connections: _conns, ...wfRest } = wf;
    return { ...wfRest, nodes: parsedNodes, edges };
  }

  async getAllWorkflows(
    userId: string,
    getAllWorkflowsDto: GetAllWorkflowsDto,
  ) {
    const { page, pageSize, search } = getAllWorkflowsDto;

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

  async updateWorkflow(
    id: string,
    payload: UpdateWorkflowNameDto,
    userId: string,
  ) {
    return this.db.transaction(async (tx) => {
      // 1. Update scalar workflow fields
      await tx
        .update(workflow)
        .set({
          ...(payload.name !== undefined && { name: payload.name }),
          updatedAt: new Date(),
        })
        .where(and(eq(workflow.id, id), eq(workflow.userId, userId)));

      // 2. Replace nodes (delete-then-insert keeps it idempotent)
      if (payload.nodes !== undefined) {
        await tx.delete(node).where(eq(node.workflowId, id));

        if (payload.nodes.length) {
          await tx.insert(node).values(
            payload.nodes.map((n) => ({
              id: n.id,
              workflowId: id,
              type: n.type,
              name: n.type || 'unknown',
              position: n.position,
              data: n.data ?? {},
            })),
          );
        }
      }

      // 3. Replace connections
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

      // 4. Re-fetch the updated workflow with its nodes + connections in one query
      const updatedWf = (await tx.query.workflow.findFirst({
        where: and(eq(workflow.id, id), eq(workflow.userId, userId)),
        with: {
          nodes: true,
          connections: true,
        },
      })) as WorkflowWithRelations | undefined;

      return updatedWf;
    });
  }

  async executeWorkflow(workflowId: string, userId: string) {
    const wf = await this.getOneWorkflow(workflowId, userId);

    const { ids } = await inngest.send({
      name: 'workflows/execute.workflow',
      data: {
        workflowId,
        userId,
        nodes: wf.nodes,
        edges: wf.edges,
      },
    });

    const record = await this.db
      .insert(execution)
      .values({
        workflowId,
        status: ExecutionStatus.RUNNING,
        inngestEventId: ids[0],
      })
      .returning()
      .then((res) => res[0]);

    return record;
  }

  async removeWorkflow(id: string, userId: string) {
    return this.db
      .delete(workflow)
      .where(and(eq(workflow.id, id), eq(workflow.userId, userId)))
      .returning();
  }
}
