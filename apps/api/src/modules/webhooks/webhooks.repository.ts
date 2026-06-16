import { DRIZZLE_INJECTION_TOKEN } from '@/db';
import { webhook, node, workflow } from '@/db/schema';
import type { WebhookProviderEnum } from '@/common/enums/webhook-provider';
import { Inject, Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type * as schema from '@/db/schema';
import { randomBytes } from 'node:crypto';

type DrizzleDb = NodePgDatabase<typeof schema>;

@Injectable()
export class WebhooksRepository {
  constructor(
    @Inject(DRIZZLE_INJECTION_TOKEN) private readonly db: DrizzleDb,
  ) {}

  async createOrGet(
    nodeId: string,
    workflowId: string,
    provider: WebhookProviderEnum,
  ) {
    const secret = randomBytes(32).toString('hex');
    const inserted = await this.db
      .insert(webhook)
      .values({ nodeId, workflowId, provider, secret })
      .onConflictDoNothing({ target: webhook.nodeId })
      .returning()
      .then((res) => res[0]);

    if (inserted) return inserted;

    return this.db.query.webhook.findFirst({
      where: eq(webhook.nodeId, nodeId),
    });
  }

  async findBySecret(secret: string) {
    return this.db
      .select({
        id: webhook.id,
        nodeId: webhook.nodeId,
        workflowId: webhook.workflowId,
        provider: webhook.provider,
        secret: webhook.secret,
        createdAt: webhook.createdAt,
        userId: workflow.userId,
      })
      .from(webhook)
      .innerJoin(workflow, eq(webhook.workflowId, workflow.id))
      .where(eq(webhook.secret, secret))
      .limit(1)
      .then((res) => res[0]);
  }

  async findNodeOwner(nodeId: string, userId: string) {
    return this.db
      .select({ nodeId: node.id, workflowId: node.workflowId })
      .from(node)
      .innerJoin(workflow, eq(node.workflowId, workflow.id))
      .where(and(eq(node.id, nodeId), eq(workflow.userId, userId)))
      .limit(1)
      .then((res) => res[0]);
  }

  async deleteByNodeId(nodeId: string) {
    return this.db
      .delete(webhook)
      .where(eq(webhook.nodeId, nodeId))
      .returning();
  }
}
