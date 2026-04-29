import { getQueryClient } from "@/app/providers/get-query-client";
import { Editor } from "@/features/editor/components/editor";
import { EditorHeader } from "@/features/editor/components/editor-header";
import { prefetchWorkflow } from "@/features/workflows/server/prefetch";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

interface IPageProps {
  params: {
    workflowId: string;
  };
}

export default async function WorkflowId({ params }: IPageProps) {
  const { workflowId } = await params;
  const queryClient = getQueryClient();
  prefetchWorkflow({ queryClient, id: workflowId });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EditorHeader workflowId={workflowId} />
      <main className="flex-1">
        <Editor workflowId={workflowId} />
      </main>
    </HydrationBoundary>
  );
}
