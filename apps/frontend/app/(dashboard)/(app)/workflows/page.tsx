import { getQueryClient } from "@/app/providers/get-query-client";
import {
  WorkfkowsContainer,
  WorkflowList,
} from "@/features/workflows/components/workflows";
import { prefetchWorkflows } from "@/features/workflows/server/prefetch";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default function Workflows() {
  const queryClient = getQueryClient();
  prefetchWorkflows({ queryClient });
  return (
    <WorkfkowsContainer>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <WorkflowList />
      </HydrationBoundary>
    </WorkfkowsContainer>
  );
}
