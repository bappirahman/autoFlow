"use client";
import { GoogleFormIcon } from "@/components/icons/google-form-icon";
import { useGoogleFormTriggerStatusToken } from "@/features/executions/hooks/use-google-form-trigger-status.token";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { BaseTriggerNode } from "@/features/trigger/components/base-trigger-node";
import { GoogleFormTriggerDialog } from "@/features/trigger/components/google-form-trigger/dialog";
import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";

export const GoogleFormTriggerNode = memo((props: NodeProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { refreshToken } = useGoogleFormTriggerStatusToken();

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    topic: "status",
    refreshToken,
  });

  const handleOpenSettings = () => setDialogOpen(true);

  return (
    <>
      <GoogleFormTriggerDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        nodeId={props.id}
      />
      <BaseTriggerNode
        {...props}
        icon={GoogleFormIcon}
        name="Google Form Trigger"
        description="Start the workflow when a Google Form is submitted."
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
        status={nodeStatus}
      />
    </>
  );
});

GoogleFormTriggerNode.displayName = "GoogleFormTriggerNode";
