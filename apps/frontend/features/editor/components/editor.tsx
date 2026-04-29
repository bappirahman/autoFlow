"use client";

import { ErrorView, LoadingView } from "@/components/entity-component";
import { useWorkflow } from "@/features/workflows/hooks/use-workflows";

export const EditorLoading = () => {
  return <LoadingView message="Loading Editor..." />;
};

export const EditorError = ({ message }: { message: string }) => {
  return <ErrorView message={message} />;
};

export const Editor = ({ workflowId }: { workflowId: string }) => {
  const { data: workflow, isLoading, error } = useWorkflow({ id: workflowId });
  if (isLoading) {
    return <EditorLoading />;
  }
  if (error) {
    return <EditorError message={error.message} />;
  }

  return <p>{JSON.stringify({ workflow })}</p>;
};
