"use client";

import { Button } from "@/components/ui/button";
import { updateWorkflow } from "@/features/workflows/api/workflow.api";
import { useExecuteWorkflow } from "@/features/workflows/hooks/use-workflows";
import { editorAtom } from "@/features/editor/store/atom";
import { NodeType } from "@autoflow/shared";
import { useAtomValue } from "jotai";
import { FlaskConicalIcon } from "lucide-react";
import { useState } from "react";

export const ExecuteWorkflowButton = ({
  workflowId,
}: {
  workflowId: string;
}) => {
  const editor = useAtomValue(editorAtom);
  const executeWorkflow = useExecuteWorkflow();
  const [isSaving, setIsSaving] = useState(false);

  const handleExecute = async () => {
    if (!editor) return;

    // Persist current canvas state so backend node IDs match frontend node IDs
    setIsSaving(true);
    try {
      await updateWorkflow({
        id: workflowId,
        data: { nodes: editor.getNodes(), edges: editor.getEdges() },
      });
    } finally {
      setIsSaving(false);
    }

    const manualTriggerNode = editor
      .getNodes()
      .find((n) => n.type === NodeType.MANUAL_TRIGGER);
    executeWorkflow.mutate({
      id: workflowId,
      triggerNodeId: manualTriggerNode?.id,
    });
  };

  return (
    <Button
      size="lg"
      onClick={handleExecute}
      disabled={isSaving || executeWorkflow.isPending}
    >
      <FlaskConicalIcon className="size-4" />
      Execute Workflow
    </Button>
  );
};
