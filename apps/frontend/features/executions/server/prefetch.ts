import {
  fetchExecutionById,
  fetchExecutions,
} from "@/features/executions/api/execution-history.api";
import { type ExecutionHistoryQueryParams } from "@/features/executions/types/execution-history";
import { executionKeys } from "@/lib/query-keys/executions";
import { type QueryClient } from "@tanstack/react-query";

export const prefetchExecutions = async ({
  queryClient,
  params,
}: {
  queryClient: QueryClient;
  params?: ExecutionHistoryQueryParams;
}): Promise<void> => {
  await queryClient.prefetchQuery({
    queryKey: executionKeys.list(params),
    queryFn: () => fetchExecutions({ params }),
  });
};

export const prefetchExecutionById = async ({
  queryClient,
  id,
}: {
  queryClient: QueryClient;
  id: string;
}): Promise<void> => {
  await queryClient.prefetchQuery({
    queryKey: executionKeys.details(id),
    queryFn: () => fetchExecutionById({ id }),
  });
};
