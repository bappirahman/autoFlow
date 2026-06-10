'use client';

import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { Realtime } from '@inngest/realtime';

import { fetchHttpRequestStatusToken } from '@/features/executions/api/execution.api';
import { executionKeys } from '@/lib/query-keys/executions';

export const useHttpRequestStatusToken = () => {
  const { data, error, isFetching, refetch, status } = useQuery({
    queryKey: executionKeys.httpRequestStatusToken(),
    queryFn: fetchHttpRequestStatusToken,
    enabled: false,
    staleTime: 0,
  });

  const refreshToken = useCallback(
    async (): Promise<Realtime.Subscribe.Token> => {
      const result = await refetch();

      if (!result.data) {
        throw new Error('Failed to fetch realtime subscription token');
      }

      return result.data;
    },
    [refetch],
  );

  return {
    data,
    error,
    isFetching,
    status,
    refreshToken,
  };
};
