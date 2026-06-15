'use client';

import { fetchWebhook } from '@/features/trigger/api/webhook.api';
import { webhookKeys } from '@/lib/query-keys/webhooks';
import { useQuery } from '@tanstack/react-query';

export const useWebhook = (workflowId: string, enabled = true) =>
  useQuery({
    queryKey: webhookKeys.detail(workflowId),
    queryFn: () => fetchWebhook({ workflowId }),
    enabled,
  });
