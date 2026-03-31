import { fetchWorkflows } from "@/features/workflows/services/fetchWorkflows";
import { workflowKeys } from "@/lib/query-keys/workflows";
import { QueryClient } from "@tanstack/react-query";

export const prefetchWorkflows = async ({
  queryClient,
}: {
  queryClient: QueryClient;
}): Promise<void> => {
  await queryClient.prefetchQuery({
    queryKey: workflowKeys.all,
    queryFn: fetchWorkflows,
  });
};
