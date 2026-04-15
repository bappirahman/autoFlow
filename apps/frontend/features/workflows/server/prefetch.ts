import { fetchWorkflows } from "@/features/workflows/api/workflow.api";
import { type WorkflowsQueryParams } from "@/features/workflows/types/workflow";
import { workflowKeys } from "@/lib/query-keys/workflows";
import { QueryClient } from "@tanstack/react-query";

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
