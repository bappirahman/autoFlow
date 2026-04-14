import { getQueryClient } from "@/app/providers/get-query-client";
import {
  WorkfkowsContainer,
  WorkflowList,
} from "@/features/workflows/components/workflows";
import { workflowsParamsLoader } from "@/features/workflows/server/params-loader";
import { prefetchWorkflows } from "@/features/workflows/server/prefetch";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { type SearchParams } from "nuqs/server";

type Props = {
  searchParams: Promise<SearchParams>;
};

export default async function Workflows({ searchParams }: Props) {
  const queryClient = getQueryClient();
  const params = await workflowsParamsLoader(searchParams);

  prefetchWorkflows({ queryClient, params });
  return (
    <WorkfkowsContainer>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <WorkflowList />
      </HydrationBoundary>
    </WorkfkowsContainer>
  );
}
