"use client";

import {
  createWorkflow,
  fetchWorkflows,
  removeWorkflow,
} from "@/features/workflows/api/workflow.api";
import { useWorkflowsParams } from "@/features/workflows/hooks/use-workflows-params";
import { type WorkflowsResponse } from "@/features/workflows/types/workflow";
import { workflowKeys } from "@/lib/query-keys/workflows";

import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { toast } from "sonner";

export const useWorkflows = (
  options: Omit<
    UseQueryOptions<
      WorkflowsResponse,
      Error,
      WorkflowsResponse,
      ReturnType<typeof workflowKeys.list>
    >,
    "queryKey" | "queryFn"
  > = {},
) => {
  const [params] = useWorkflowsParams();
  return useQuery({
    queryKey: workflowKeys.list(params),
    // CSR: same function auto-resolves browser Axios client.
    queryFn: () => fetchWorkflows({ params }),
    enabled: typeof window !== "undefined",
    ...options,
  });
};

export const useCreateWorkflow = (
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof createWorkflow>>,
    Error,
    unknown
  >,
) => {
  const { onSuccess, onError, ...restOptions } = options ?? {};
  const queryClient = useQueryClient();

  return useMutation({
    ...restOptions,
    mutationFn: createWorkflow,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: workflowKeys.all });
      toast.success(`${data[0].name} workflow created successfully`);
      onSuccess?.(data, variables, onMutateResult, context);
    },
    onError: (error, variables, onMutateResult, context) => {
      toast.error(`Failed to create workflow: ${error.message}`);
      onError?.(error, variables, onMutateResult, context);
    },
  });
};

export const useRemoveWorkflow = (
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof removeWorkflow>>,
    Error,
    { id: string }
  >,
) => {
  const { onSuccess, onError, ...restOptions } = options ?? {};
  const queryClient = useQueryClient();

  return useMutation({
    ...restOptions,
    mutationFn: ({ id }: { id: string }) => removeWorkflow(id),
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: workflowKeys.all });
      console.log(data);
      toast.success(`Workflow removed successfully`);
      onSuccess?.(data, variables, onMutateResult, context);
    },
    onError: (error, variables, onMutateResult, context) => {
      toast.error(`Failed to remove workflow: ${error.message}`);
      onError?.(error, variables, onMutateResult, context);
    },
  });
};
