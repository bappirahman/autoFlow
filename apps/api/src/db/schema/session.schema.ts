import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { user } from './user.schema';
import { SESSION_TABLE_CONSTANTS } from '../constants/session.constant';

export const session = pgTable(SESSION_TABLE_CONSTANTS.TABLE_NAME, {
  id: text(SESSION_TABLE_CONSTANTS.COLUMNS.ID).primaryKey(),
  expiresAt: timestamp(SESSION_TABLE_CONSTANTS.COLUMNS.EXPIRES_AT).notNull(),
  token: text(SESSION_TABLE_CONSTANTS.COLUMNS.TOKEN).notNull(),
  createdAt: timestamp(SESSION_TABLE_CONSTANTS.COLUMNS.CREATED_AT)
    .notNull()
    .defaultNow(),
  updatedAt: timestamp(SESSION_TABLE_CONSTANTS.COLUMNS.UPDATED_AT)
    .notNull()
    .defaultNow(),
  ipAddress: text(SESSION_TABLE_CONSTANTS.COLUMNS.IP_ADDRESS),
  userAgent: text(SESSION_TABLE_CONSTANTS.COLUMNS.USER_AGENT),
  userId: text(SESSION_TABLE_CONSTANTS.COLUMNS.USER_ID)
    .notNull()
    .references(() => user.id),
});

export type Session = InferSelectModel<typeof session>;
export type NewSession = InferInsertModel<typeof session>;
