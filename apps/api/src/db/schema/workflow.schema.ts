import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { WORKFLOW_TABLE_CONSTANTS } from '../constants/workflow.constant';
import { user } from './user.schema';

import { uuid } from 'drizzle-orm/pg-core';

export const workflow = pgTable(WORKFLOW_TABLE_CONSTANTS.TABLE_NAME, {
  id: uuid(WORKFLOW_TABLE_CONSTANTS.COLUMNS.ID)
    .primaryKey()
    .notNull()
    .defaultRandom(),
  name: text(WORKFLOW_TABLE_CONSTANTS.COLUMNS.NAME).notNull(),
  userId: text(WORKFLOW_TABLE_CONSTANTS.COLUMNS.USER_ID)
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
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
