import { CONNECTION_TABLE_CONSTANTS } from '@/db/constants/connection.constant';
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { workflow } from './workflow.schema';
import { node } from './node.schema';

export const connection = pgTable(CONNECTION_TABLE_CONSTANTS.TABLE_NAME, {
  id: uuid(CONNECTION_TABLE_CONSTANTS.COLUMNS.ID)
    .primaryKey()
    .notNull()
    .defaultRandom(),

  workflowId: uuid(CONNECTION_TABLE_CONSTANTS.COLUMNS.WORKFLOW_ID)
    .notNull()
    .references(() => workflow.id, { onDelete: 'cascade' }),

  fromNodeId: uuid(CONNECTION_TABLE_CONSTANTS.COLUMNS.FROM_NODE_ID)
    .notNull()
    .references(() => node.id, { onDelete: 'cascade' }),

  toNodeId: uuid(CONNECTION_TABLE_CONSTANTS.COLUMNS.TO_NODE_ID)
    .notNull()
    .references(() => node.id, { onDelete: 'cascade' }),

  fromOutput: text(CONNECTION_TABLE_CONSTANTS.COLUMNS.FROM_OUTPUT).default(
    'main',
  ),

  toInput: text(CONNECTION_TABLE_CONSTANTS.COLUMNS.TO_INPUT).default('main'),

  createdAt: timestamp(
    CONNECTION_TABLE_CONSTANTS.COLUMNS.CREATED_AT,
  ).defaultNow(),

  updatedAt: timestamp(
    CONNECTION_TABLE_CONSTANTS.COLUMNS.UPDATED_AT,
  ).defaultNow(),
});

export type Connection = InferSelectModel<typeof connection>;
export type NewConnection = InferInsertModel<typeof connection>;
