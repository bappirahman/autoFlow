import { getQueryClient } from "@/app/providers/get-query-client";
import {
  WorkfkowsContainer,
  WorkflowsList,
  WorkflowsError,
} from "@/features/workflows/components/workflows";
import { workflowsParamsLoader } from "@/features/workflows/server/params-loader";
import { prefetchWorkflows } from "@/features/workflows/server/prefetch";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { type SearchParams } from "nuqs/server";
import { ErrorBoundary } from "react-error-boundary";

type Props = {
  searchParams: Promise<SearchParams>;
};

export default async function Workflows({ searchParams }: Props) {
  const queryClient = getQueryClient();
  const params = await workflowsParamsLoader(searchParams);
  await prefetchWorkflows({ queryClient, params });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <WorkfkowsContainer>
        <ErrorBoundary fallback={<WorkflowsError />}>
          <WorkflowsList />
        </ErrorBoundary>
      </WorkfkowsContainer>
    </HydrationBoundary>
  );
}
