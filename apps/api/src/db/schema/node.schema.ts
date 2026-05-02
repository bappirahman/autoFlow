import { NODE_TABLE_CONSTANTS } from '@/db/constants/node.constant';
import { nodeTypePgEnum } from './enums/node-type.enum';
import { workflow } from './workflow.schema';
import { uuid } from 'drizzle-orm/pg-core';
import { pgTable, text, timestamp, jsonb } from 'drizzle-orm/pg-core';
import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { credential } from './credential.schema';

export const node = pgTable(NODE_TABLE_CONSTANTS.TABLE_NAME, {
  id: uuid(NODE_TABLE_CONSTANTS.COLUMNS.ID)
    .primaryKey()
    .notNull()
    .defaultRandom(),

  workflowId: uuid(NODE_TABLE_CONSTANTS.COLUMNS.WORKFLOW_ID)
    .notNull()
    .references(() => workflow.id, { onDelete: 'cascade' }),

  name: text(NODE_TABLE_CONSTANTS.COLUMNS.NAME).notNull(),

  type: nodeTypePgEnum(NODE_TABLE_CONSTANTS.COLUMNS.TYPE).notNull(),

  position: jsonb(NODE_TABLE_CONSTANTS.COLUMNS.POSITION).notNull(),

  data: jsonb(NODE_TABLE_CONSTANTS.COLUMNS.DATA).default({}),

  credentialId: uuid('credential_id').references(() => credential.id),

  createdAt: timestamp(NODE_TABLE_CONSTANTS.COLUMNS.CREATED_AT).defaultNow(),

  updatedAt: timestamp(NODE_TABLE_CONSTANTS.COLUMNS.UPDATED_AT).defaultNow(),
});

export type Node = InferSelectModel<typeof node>;
export type NewNode = InferInsertModel<typeof node>;
