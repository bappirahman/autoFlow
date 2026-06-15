import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { WEBHOOK_TABLE_CONSTANTS } from '../constants/webhook.constant';
import { workflow } from './workflow.schema';

export const webhook = pgTable(WEBHOOK_TABLE_CONSTANTS.TABLE_NAME, {
  id: uuid(WEBHOOK_TABLE_CONSTANTS.COLUMNS.ID)
    .primaryKey()
    .notNull()
    .defaultRandom(),

  workflowId: uuid(WEBHOOK_TABLE_CONSTANTS.COLUMNS.WORKFLOW_ID)
    .notNull()
    .references(() => workflow.id, { onDelete: 'cascade' }),

  secret: text(WEBHOOK_TABLE_CONSTANTS.COLUMNS.SECRET).notNull().unique(),

  createdAt: timestamp(WEBHOOK_TABLE_CONSTANTS.COLUMNS.CREATED_AT, {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
});

export type Webhook = InferSelectModel<typeof webhook>;
export type NewWebhook = InferInsertModel<typeof webhook>;
