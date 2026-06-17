import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { WEBHOOK_TABLE_CONSTANTS } from '../constants/webhook.constant';
import { node } from './node.schema';
import { workflow } from './workflow.schema';
import { webhookProviderPgEnum } from './enums/webhook-provider.enum';

export const webhook = pgTable(WEBHOOK_TABLE_CONSTANTS.TABLE_NAME, {
  id: uuid(WEBHOOK_TABLE_CONSTANTS.COLUMNS.ID)
    .primaryKey()
    .notNull()
    .defaultRandom(),

  nodeId: uuid(WEBHOOK_TABLE_CONSTANTS.COLUMNS.NODE_ID)
    .notNull()
    .unique()
    .references(() => node.id, { onDelete: 'cascade' }),

  workflowId: uuid(WEBHOOK_TABLE_CONSTANTS.COLUMNS.WORKFLOW_ID)
    .notNull()
    .references(() => workflow.id, { onDelete: 'cascade' }),

  provider: webhookProviderPgEnum(
    WEBHOOK_TABLE_CONSTANTS.COLUMNS.PROVIDER,
  ).notNull(),

  secret: text(WEBHOOK_TABLE_CONSTANTS.COLUMNS.SECRET).notNull().unique(),

  createdAt: timestamp(WEBHOOK_TABLE_CONSTANTS.COLUMNS.CREATED_AT, {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
});

export type Webhook = InferSelectModel<typeof webhook>;
export type NewWebhook = InferInsertModel<typeof webhook>;
