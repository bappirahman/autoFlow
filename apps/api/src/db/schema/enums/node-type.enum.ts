import { NodeType } from '@/common/enums/node-type';
import { pgEnum } from 'drizzle-orm/pg-core';

export const nodeTypePgEnum = pgEnum(
  'node_type',
  Object.values(NodeType) as [string, ...string[]],
);
