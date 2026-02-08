import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { WORKFLOW_TABLE_CONSTANTS } from '../constants/workflow.constant';

export const workflow = pgTable(WORKFLOW_TABLE_CONSTANTS.TABLE_NAME, {
  id: uuid(WORKFLOW_TABLE_CONSTANTS.COLUMNS.ID).primaryKey().defaultRandom(),
  name: text(WORKFLOW_TABLE_CONSTANTS.COLUMNS.NAME).notNull(),
  createdAt: timestamp(WORKFLOW_TABLE_CONSTANTS.COLUMNS.CREATED_AT, {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp(WORKFLOW_TABLE_CONSTANTS.COLUMNS.UPDATED_AT, {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
});

export type Workflow = InferSelectModel<typeof workflow>;
export type NewWorkflow = InferInsertModel<typeof workflow>;
