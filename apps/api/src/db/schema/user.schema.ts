import { pgTable, text, timestamp, boolean } from 'drizzle-orm/pg-core';
import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { USER_TABLE_CONSTANTS } from '../constants/user.constant';

export const user = pgTable(USER_TABLE_CONSTANTS.TABLE_NAME, {
  id: text(USER_TABLE_CONSTANTS.COLUMNS.ID).primaryKey(),
  name: text(USER_TABLE_CONSTANTS.COLUMNS.NAME).notNull(),
  email: text(USER_TABLE_CONSTANTS.COLUMNS.EMAIL).notNull(),
  emailVerified: boolean(USER_TABLE_CONSTANTS.COLUMNS.EMAIL_VERIFIED)
    .notNull()
    .default(false),
  image: text(USER_TABLE_CONSTANTS.COLUMNS.IMAGE),
  createdAt: timestamp(USER_TABLE_CONSTANTS.COLUMNS.CREATED_AT)
    .notNull()
    .defaultNow(),
  updatedAt: timestamp(USER_TABLE_CONSTANTS.COLUMNS.UPDATED_AT)
    .notNull()
    .defaultNow(),
});

export type User = InferSelectModel<typeof user>;
export type NewUser = InferInsertModel<typeof user>;
