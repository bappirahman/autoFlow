import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { user } from './user.schema';
import { ACCOUNT_TABLE_CONSTANTS } from '../constants/account.constant';

export const account = pgTable(ACCOUNT_TABLE_CONSTANTS.TABLE_NAME, {
  id: uuid(ACCOUNT_TABLE_CONSTANTS.COLUMNS.ID).primaryKey().defaultRandom(),
  accountId: text(ACCOUNT_TABLE_CONSTANTS.COLUMNS.ACCOUNT_ID).notNull(),
  providerId: text(ACCOUNT_TABLE_CONSTANTS.COLUMNS.PROVIDER_ID).notNull(),
  userId: text(ACCOUNT_TABLE_CONSTANTS.COLUMNS.USER_ID)
    .notNull()
    .references(() => user.id),
  accessToken: text(ACCOUNT_TABLE_CONSTANTS.COLUMNS.ACCESS_TOKEN),
  refreshToken: text(ACCOUNT_TABLE_CONSTANTS.COLUMNS.REFRESH_TOKEN),
  idToken: text(ACCOUNT_TABLE_CONSTANTS.COLUMNS.ID_TOKEN),
  accessTokenExpiresAt: timestamp(
    ACCOUNT_TABLE_CONSTANTS.COLUMNS.ACCESS_TOKEN_EXPIRES_AT,
    { withTimezone: true },
  ),
  refreshTokenExpiresAt: timestamp(
    ACCOUNT_TABLE_CONSTANTS.COLUMNS.REFRESH_TOKEN_EXPIRES_AT,
    { withTimezone: true },
  ),
  scope: text(ACCOUNT_TABLE_CONSTANTS.COLUMNS.SCOPE),
  password: text(ACCOUNT_TABLE_CONSTANTS.COLUMNS.PASSWORD),
  createdAt: timestamp(ACCOUNT_TABLE_CONSTANTS.COLUMNS.CREATED_AT, {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp(ACCOUNT_TABLE_CONSTANTS.COLUMNS.UPDATED_AT, {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
});

export type Account = InferSelectModel<typeof account>;
export type NewAccount = InferInsertModel<typeof account>;
