import { pgTable, text, timestamp, uuid, jsonb } from 'drizzle-orm/pg-core';
import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { EXECUTION_TABLE_CONSTANTS } from '../constants/execution.constant';
import { executionStatusPgEnum } from './enums/execution-status.enum';
import { workflow } from './workflow.schema';

export const execution = pgTable(EXECUTION_TABLE_CONSTANTS.TABLE_NAME, {
  id: uuid(EXECUTION_TABLE_CONSTANTS.COLUMNS.ID)
    .primaryKey()
    .notNull()
    .defaultRandom(),

  workflowId: uuid(EXECUTION_TABLE_CONSTANTS.COLUMNS.WORKFLOW_ID)
    .notNull()
    .references(() => workflow.id, { onDelete: 'cascade' }),

  status: executionStatusPgEnum(EXECUTION_TABLE_CONSTANTS.COLUMNS.STATUS)
    .notNull()
    .default('RUNNING'),

  error: text(EXECUTION_TABLE_CONSTANTS.COLUMNS.ERROR),

  errorStack: text(EXECUTION_TABLE_CONSTANTS.COLUMNS.ERROR_STACK),

  output: jsonb(EXECUTION_TABLE_CONSTANTS.COLUMNS.OUTPUT),

  startedAt: timestamp(EXECUTION_TABLE_CONSTANTS.COLUMNS.STARTED_AT, {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),

  completedAt: timestamp(EXECUTION_TABLE_CONSTANTS.COLUMNS.COMPLETED_AT, {
    withTimezone: true,
  }),

  inngestEventId: text(EXECUTION_TABLE_CONSTANTS.COLUMNS.INNGEST_EVENT_ID)
    .notNull()
    .unique(),

  createdAt: timestamp(EXECUTION_TABLE_CONSTANTS.COLUMNS.CREATED_AT, {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),

  updatedAt: timestamp(EXECUTION_TABLE_CONSTANTS.COLUMNS.UPDATED_AT, {
    withTimezone: true,
  })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type Execution = InferSelectModel<typeof execution>;
export type NewExecution = InferInsertModel<typeof execution>;
