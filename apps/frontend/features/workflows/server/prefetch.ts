import {
  fetchWorkflowById,
  fetchWorkflows,
} from "@/features/workflows/api/workflow.api";
import { type WorkflowsQueryParams } from "@/features/workflows/types/workflow";
import { workflowKeys } from "@/lib/query-keys/workflows";
import { type QueryClient } from "@tanstack/react-query";

export const prefetchWorkflows = async ({
  queryClient,
  params,
}: {
  queryClient: QueryClient;
  params?: WorkflowsQueryParams;
}): Promise<void> => {
  await queryClient.prefetchQuery({
    queryKey: workflowKeys.list(params),
    queryFn: () => fetchWorkflows({ params }),
  });
};

export const prefetchWorkflow = async ({
  queryClient,
  id,
}: {
  queryClient: QueryClient;
  id: string;
}): Promise<void> => {
  await queryClient.prefetchQuery({
    queryKey: workflowKeys.details(id),
    queryFn: () => fetchWorkflowById({ id }),
  });
};
