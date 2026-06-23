"use client";

import {
  fetchExecutionById,
  fetchExecutions,
} from "@/features/executions/api/execution-history.api";
import { useExecutionHistoryParams } from "@/features/executions/hooks/use-execution-history-params";
import { type ExecutionHistoryResponse } from "@/features/executions/types/execution-history";
import { executionKeys } from "@/lib/query-keys/executions";
import {
  useQuery,
  type UseQueryOptions,
} from "@tanstack/react-query";

export const useExecutionHistory = (
  options: Omit<
    UseQueryOptions<
      ExecutionHistoryResponse,
      Error,
      ExecutionHistoryResponse,
      ReturnType<typeof executionKeys.list>
    >,
    "queryKey" | "queryFn"
  > = {},
) => {
  const [params] = useExecutionHistoryParams();
  return useQuery({
    queryKey: executionKeys.list(params),
    queryFn: () => fetchExecutions({ params }),
    ...options,
  });
};

export const useExecutionHistoryItem = ({
  id,
  options,
}: {
  id: string;
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof fetchExecutionById>>,
      Error,
      Awaited<ReturnType<typeof fetchExecutionById>>,
      ReturnType<typeof executionKeys.details>
    >,
    "queryKey" | "queryFn"
  >;
}) => {
  return useQuery({
    queryKey: executionKeys.details(id),
    queryFn: () => fetchExecutionById({ id }),
    ...options,
  });
};
