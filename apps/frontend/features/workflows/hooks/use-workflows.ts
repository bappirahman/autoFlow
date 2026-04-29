"use client";

import {
  createWorkflow,
  fetchWorkflowById,
  fetchWorkflows,
  removeWorkflow,
  updateWorkflow,
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
    queryFn: () => fetchWorkflows({ params }),
    ...options,
  });
};
export const useWorkflow = ({
  id,
  options,
}: {
  id: string;
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof fetchWorkflowById>>,
      Error,
      Awaited<ReturnType<typeof fetchWorkflowById>>,
      ReturnType<typeof workflowKeys.details>
    >,
    "queryKey" | "queryFn"
  >;
}) => {
  return useQuery({
    queryKey: workflowKeys.details(id),
    queryFn: () => fetchWorkflowById({ id }),
    ...options,
  });
};

export const useCreateWorkflow = (
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof createWorkflow>>,
    Error,
    unknown | undefined
  >,
) => {
  const { onSuccess, onError, ...restOptions } = options ?? {};
  const queryClient = useQueryClient();

  return useMutation({
    ...restOptions,
    mutationFn: (data) => createWorkflow(data ?? undefined),
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
export const useUpdateWorkflow = (
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof updateWorkflow>>,
    Error,
    { id: string; data: unknown }
  >,
) => {
  const { onSuccess, onError, ...restOptions } = options ?? {};
  const queryClient = useQueryClient();

  return useMutation({
    ...restOptions,
    mutationFn: ({ id, data }: { id: string; data: unknown }) =>
      updateWorkflow({ id, data }),
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: workflowKeys.all });
      toast.success(`${data[0].name} workflow updated successfully`);
      onSuccess?.(data, variables, onMutateResult, context);
    },
    onError: (error, variables, onMutateResult, context) => {
      toast.error(`Failed to update workflow: ${error.message}`);
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
    mutationFn: ({ id }: { id: string }) => removeWorkflow({ id }),
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
