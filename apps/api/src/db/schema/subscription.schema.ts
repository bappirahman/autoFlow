import { pgTable, text, timestamp, boolean } from 'drizzle-orm/pg-core';
import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { user } from './user.schema';
import { SUBSCRIPTION_TABLE_CONSTANTS } from '../constants/subscription.constant';

export const subscription = pgTable(SUBSCRIPTION_TABLE_CONSTANTS.TABLE_NAME, {
  id: text(SUBSCRIPTION_TABLE_CONSTANTS.COLUMNS.ID).primaryKey().notNull(),
  userId: text(SUBSCRIPTION_TABLE_CONSTANTS.COLUMNS.USER_ID)
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  polarSubscriptionId: text(
    SUBSCRIPTION_TABLE_CONSTANTS.COLUMNS.POLAR_SUBSCRIPTION_ID,
  )
    .notNull()
    .unique(),
  polarProductId: text(
    SUBSCRIPTION_TABLE_CONSTANTS.COLUMNS.POLAR_PRODUCT_ID,
  ).notNull(),
  status: text(SUBSCRIPTION_TABLE_CONSTANTS.COLUMNS.STATUS).notNull(),
  currentPeriodStart: timestamp(
    SUBSCRIPTION_TABLE_CONSTANTS.COLUMNS.CURRENT_PERIOD_START,
    {
      withTimezone: true,
    },
  ),
  currentPeriodEnd: timestamp(
    SUBSCRIPTION_TABLE_CONSTANTS.COLUMNS.CURRENT_PERIOD_END,
    {
      withTimezone: true,
    },
  ),
  cancelAtPeriodEnd: boolean(
    SUBSCRIPTION_TABLE_CONSTANTS.COLUMNS.CANCEL_AT_PERIOD_END,
  ).default(false),
  createdAt: timestamp(SUBSCRIPTION_TABLE_CONSTANTS.COLUMNS.CREATED_AT, {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp(SUBSCRIPTION_TABLE_CONSTANTS.COLUMNS.UPDATED_AT, {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
});

export type Subscription = InferSelectModel<typeof subscription>;
export type NewSubscription = InferInsertModel<typeof subscription>;
