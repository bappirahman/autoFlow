import { getQueryClient } from "@/app/providers/get-query-client";
import {
  ExecutionsContainer,
  ExecutionsList,
  ExecutionsError,
} from "@/features/executions/components/execution-history";
import { executionHistoryParamsLoader } from "@/features/executions/server/params-loader";
import { prefetchExecutions } from "@/features/executions/server/prefetch";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { type SearchParams } from "nuqs/server";
import { ErrorBoundary } from "react-error-boundary";

type Props = {
  searchParams: Promise<SearchParams>;
};

export default async function Executions({ searchParams }: Props) {
  const queryClient = getQueryClient();
  const params = await executionHistoryParamsLoader(searchParams);
  await prefetchExecutions({ queryClient, params });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ExecutionsContainer>
        <ErrorBoundary fallback={<ExecutionsError />}>
          <ExecutionsList />
        </ErrorBoundary>
      </ExecutionsContainer>
    </HydrationBoundary>
  );
}
