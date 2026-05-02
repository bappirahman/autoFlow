import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { CREDENTIAL_TABLE_CONSTANTS } from '../constants/credential.constant';
import { credentialTypePgEnum } from './enums/credential-type.enum';
import { user } from './user.schema';

export const credential = pgTable(CREDENTIAL_TABLE_CONSTANTS.TABLE_NAME, {
  id: uuid(CREDENTIAL_TABLE_CONSTANTS.COLUMNS.ID)
    .primaryKey()
    .notNull()
    .defaultRandom(),

  name: text(CREDENTIAL_TABLE_CONSTANTS.COLUMNS.NAME).notNull(),

  value: text(CREDENTIAL_TABLE_CONSTANTS.COLUMNS.VALUE).notNull(),

  type: credentialTypePgEnum(CREDENTIAL_TABLE_CONSTANTS.COLUMNS.TYPE).notNull(),

  userId: text(CREDENTIAL_TABLE_CONSTANTS.COLUMNS.USER_ID)
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),

  createdAt: timestamp(CREDENTIAL_TABLE_CONSTANTS.COLUMNS.CREATED_AT, {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),

  updatedAt: timestamp(CREDENTIAL_TABLE_CONSTANTS.COLUMNS.UPDATED_AT, {
    withTimezone: true,
  })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type Credential = InferSelectModel<typeof credential>;
export type NewCredential = InferInsertModel<typeof credential>;
