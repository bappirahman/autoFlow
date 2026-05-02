import { ExecutionStatus } from '@/common/enums/execution-status';
import { pgEnum } from 'drizzle-orm/pg-core';

export const executionStatusPgEnum = pgEnum(
  'execution_status',
  Object.values(ExecutionStatus) as [string, ...string[]],
);
