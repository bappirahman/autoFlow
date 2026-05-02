import { DRIZZLE_INJECTION_TOKEN } from '@/db';
import * as schema from '@/db/schema';
import { workflow } from '@/db/schema';
import { node, connection } from '@/db/schema';
import { GetAllWorkflowsDto } from '@/modules/workflows/dto/get-all-workflows.dto';
import { NodeType } from '@autoflow/shared';
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
    const wf = await this.db
      .insert(workflow)
      .values({
        userId,
        name: 'New Workflow',
      })
      .returning()
      .then((res) => res[0]);

    // Create default INITIAL node
    await this.db.insert(node).values({
      workflowId: wf.id,
      name: 'Start',
      type: NodeType.INITIAL,
      position: { x: 0, y: 0 },
    });

    return wf;
  }
  async removeWorkflow(id: string, userId: string) {
    return this.db
      .delete(workflow)
      .where(and(eq(workflow.id, id), eq(workflow.userId, userId)))
      .returning();
  }

  async getOneWorkflow(id: string, userId: string) {
    const wf = await this.db
      .select()
      .from(workflow)
      .where(and(eq(workflow.id, id), eq(workflow.userId, userId)))
      .limit(1)
      .then((res) => res[0]);

    if (!wf) {
      throw new Error('Workflow not found');
    }

    const [nodes, connections] = await Promise.all([
      this.db.select().from(node).where(eq(node.workflowId, id)),
      this.db.select().from(connection).where(eq(connection.workflowId, id)),
    ]);

    // Parsing nodes and connections to match the expected format for the frontend react flow
    const parsedNodes = nodes.map((n) => ({
      id: n.id,
      type: n.type,
      position: n.position,
      data: n.data,
    }));

    const edges = connections.map((conn) => ({
      id: conn.id,
      source: conn.fromNodeId,
      target: conn.toNodeId,
      sourceHandle: conn.fromOutput,
      targetHandle: conn.toInput,
    }));
    return {
      ...wf,
      nodes: parsedNodes,
      edges,
    };
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
