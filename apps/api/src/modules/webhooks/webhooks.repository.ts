import { DRIZZLE_INJECTION_TOKEN } from '@/db';
import { webhook, workflow } from '@/db/schema';
import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type * as schema from '@/db/schema';
import { randomBytes } from 'node:crypto';

type DrizzleDb = NodePgDatabase<typeof schema>;

@Injectable()
export class WebhooksRepository {
  constructor(
    @Inject(DRIZZLE_INJECTION_TOKEN) private readonly db: DrizzleDb,
  ) {}

  async create(workflowId: string) {
    const secret = randomBytes(32).toString('hex');
    return this.db
      .insert(webhook)
      .values({ workflowId, secret })
      .returning()
      .then((res) => res[0]);
  }

  async findByWorkflowId(workflowId: string) {
    return this.db.query.webhook.findFirst({
      where: eq(webhook.workflowId, workflowId),
    });
  }

  async findBySecret(secret: string) {
    return this.db
      .select({
        id: webhook.id,
        workflowId: webhook.workflowId,
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

  async deleteByWorkflowId(workflowId: string) {
    return this.db
      .delete(webhook)
      .where(eq(webhook.workflowId, workflowId))
      .returning();
  }
}
