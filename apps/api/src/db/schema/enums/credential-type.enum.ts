import { CredentialType } from '@/common/enums/credential-type';
import { pgEnum } from 'drizzle-orm/pg-core';

export const credentialTypePgEnum = pgEnum(
  'credential_type',
  Object.values(CredentialType) as [string, ...string[]],
);
