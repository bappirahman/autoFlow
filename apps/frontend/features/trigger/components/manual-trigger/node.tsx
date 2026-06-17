"use client";

import { BaseTriggerNode } from "@/features/trigger/components/base-trigger-node";
import { ManualTriggerDialog } from "@/features/trigger/components/manual-trigger/dialog";
import { useManualTriggerStatusToken } from "@/features/executions/hooks/use-manual-trigger-status-token";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { NodeProps } from "@xyflow/react";
import { MousePointerIcon } from "lucide-react";
import { memo, useState } from "react";

export const ManualTriggerNode = memo((props: NodeProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { refreshToken } = useManualTriggerStatusToken();

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    topic: "status",
    refreshToken,
  });

  const handleOpenSettings = () => setDialogOpen(true);

  return (
    <>
      <ManualTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      <BaseTriggerNode
        {...props}
        icon={MousePointerIcon}
        name="Manual Trigger"
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
        status={nodeStatus}
      />
    </>
  );
});

ManualTriggerNode.displayName = "ManualTriggerNode";
