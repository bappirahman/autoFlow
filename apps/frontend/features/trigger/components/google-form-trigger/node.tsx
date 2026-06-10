'use client';
import { GoogleFormIcon } from '@/components/icons/google-form-icon';
import { BaseTriggerNode } from '@/features/trigger/components/base-trigger-node';
import { ManualTriggerDialog } from '@/features/trigger/components/manual-trigger/dialog';
// import { useManualTriggerStatusToken } from '@/features/executions/hooks/use-manual-trigger-status-token';
// import { useNodeStatus } from '@/features/executions/hooks/use-node-status';
import { NodeProps } from '@xyflow/react';
import { memo, useState } from 'react';

export const GoogleFormTrigger = memo((props: NodeProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  // const { refreshToken } = useManualTriggerStatusToken();

  const nodeStatus = 'initial';
  // useNodeStatus({
  //   nodeId: props.id,
  //   topic: 'status',
  //   refreshToken,
  // });

  const handleOpenSettings = () => setDialogOpen(true);

  return (
    <>
      <ManualTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen} />
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

GoogleFormTrigger.displayName = 'GoogleFormTrigger';
