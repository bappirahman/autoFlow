import { WebhookProvider } from '@/common/enums/webhook-provider';
import { pgEnum } from 'drizzle-orm/pg-core';

export const webhookProviderPgEnum = pgEnum(
  'webhook_provider',
  Object.values(WebhookProvider) as [string, ...string[]],
);
