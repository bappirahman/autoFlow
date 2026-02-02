import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { VERIFICATION_TABLE_CONSTANTS } from '../constants/verification.constant';

export const verification = pgTable(VERIFICATION_TABLE_CONSTANTS.TABLE_NAME, {
  id: text(VERIFICATION_TABLE_CONSTANTS.COLUMNS.ID).primaryKey(),
  identifier: text(VERIFICATION_TABLE_CONSTANTS.COLUMNS.IDENTIFIER).notNull(),
  value: text(VERIFICATION_TABLE_CONSTANTS.COLUMNS.VALUE).notNull(),
  expiresAt: timestamp(
    VERIFICATION_TABLE_CONSTANTS.COLUMNS.EXPIRES_AT,
  ).notNull(),
  createdAt: timestamp(VERIFICATION_TABLE_CONSTANTS.COLUMNS.CREATED_AT)
    .notNull()
    .defaultNow(),
  updatedAt: timestamp(VERIFICATION_TABLE_CONSTANTS.COLUMNS.UPDATED_AT)
    .notNull()
    .defaultNow(),
});

export type Verification = InferSelectModel<typeof verification>;
export type NewVerification = InferInsertModel<typeof verification>;
