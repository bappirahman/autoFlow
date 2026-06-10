'use client';

import { fetchHttpRequestStatusToken } from '@/features/executions/api/execution.api';
import { executionKeys } from '@/lib/query-keys/executions';
import { useRealtimeStatusToken } from './use-realtime-status-token';

export const useHttpRequestStatusToken = () =>
  useRealtimeStatusToken(
    executionKeys.httpRequestStatusToken(),
    fetchHttpRequestStatusToken,
  );
