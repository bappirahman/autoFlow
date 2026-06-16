'use client';

import { fetchWebhook } from '@/features/webhooks/api/webhook.api';
import { webhookKeys } from '@/lib/query-keys/webhooks';
import { useQuery } from '@tanstack/react-query';

export const useWebhook = (nodeId: string, provider: string, enabled = true) =>
  useQuery({
    queryKey: webhookKeys.detail(nodeId, provider),
    queryFn: () => fetchWebhook({ nodeId, provider }),
    enabled,
  });
