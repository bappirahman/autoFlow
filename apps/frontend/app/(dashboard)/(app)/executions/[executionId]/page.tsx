import { getQueryClient } from "@/app/providers/get-query-client";
import { ExecutionDetail } from "@/features/executions/components/execution-detail";
import { prefetchExecutionById } from "@/features/executions/server/prefetch";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

interface IPageProps {
  params: Promise<{
    executionId: string;
  }>;
}

export default async function ExecutionDetailPage({ params }: IPageProps) {
  const { executionId } = await params;
  const queryClient = getQueryClient();
  await prefetchExecutionById({ queryClient, id: executionId });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ExecutionDetail id={executionId} />
    </HydrationBoundary>
  );
}
