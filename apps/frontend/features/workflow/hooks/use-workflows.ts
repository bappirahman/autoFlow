"use client";

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { getAllWorkflows } from "@/lib/api/workflow.api";
import { queryKeys } from "@/lib/queryKeys";

export const useWorkflows = (
  options: Omit<
    UseQueryOptions<
      unknown,
      Error,
      unknown,
      ReturnType<typeof queryKeys.workflow.lists>
    >,
    "queryKey" | "queryFn"
  > = {},
) => {
  return useQuery({
    queryKey: queryKeys.workflow.lists(),
    queryFn: getAllWorkflows,
    ...options,
  });
};
