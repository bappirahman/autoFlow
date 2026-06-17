'use client';
import { StripeIcon } from '@/components/icons/stripe';
import { useStripeTriggerStatusToken } from '@/features/executions/hooks/use-stripe-trigger-status.token';
import { useNodeStatus } from '@/features/executions/hooks/use-node-status';
import { BaseTriggerNode } from '@/features/trigger/components/base-trigger-node';
import { StripeTriggerDialog } from '@/features/trigger/components/stripe-trigger/dialog';
import { NodeProps } from '@xyflow/react';
import { memo, useState } from 'react';

export const StripeTriggerNode = memo((props: NodeProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { refreshToken } = useStripeTriggerStatusToken();

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    topic: 'status',
    refreshToken,
  });

  const handleOpenSettings = () => setDialogOpen(true);

  return (
    <>
      <StripeTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen} nodeId={props.id} />
      <BaseTriggerNode
        {...props}
        icon={StripeIcon}
        name="Stripe Trigger"
        description="Start the workflow when a Stripe event occurs."
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
        status={nodeStatus}
      />
    </>
  );
});

StripeTriggerNode.displayName = 'StripeTriggerNode';
