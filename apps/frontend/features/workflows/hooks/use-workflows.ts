"use client";

import { createWorkflow } from "@/features/workflows/api/create-workflow";
import { fetchWorkflows } from "@/features/workflows/services/fetchWorkflows";
import { type Workflow } from "@/features/workflows/types/workflow";
import { workflowKeys } from "@/lib/query-keys/workflows";

import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { toast } from "sonner";

export const useWorkflows = (
  options: Omit<
    UseQueryOptions<Workflow[], Error, Workflow[], typeof workflowKeys.all>,
    "queryKey" | "queryFn"
  > = {},
) => {
  return useQuery({
    queryKey: workflowKeys.all,
    // CSR: same function auto-resolves browser Axios client.
    queryFn: fetchWorkflows,
    enabled: typeof window !== "undefined",
    ...options,
  });
};

export const useCreateWorkflow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createWorkflow,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: workflowKeys.all });
      toast.success(`${data.name} workflow created successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to create workflow: ${error.message}`);
    },
  });
};
