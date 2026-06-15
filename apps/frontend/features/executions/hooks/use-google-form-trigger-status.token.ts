'use client';

import { fetchGoogleFormTriggerStatusToken } from '@/features/executions/api/execution.api';
import { executionKeys } from '@/lib/query-keys/executions';
import { useRealtimeStatusToken } from './use-realtime-status-token';

export const useGoogleFormTriggerStatusToken = () =>
  useRealtimeStatusToken(
    executionKeys.googleFormTriggerStatusToken(),
    fetchGoogleFormTriggerStatusToken,
  );
