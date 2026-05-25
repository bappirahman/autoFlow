import { BaseTriggerNode } from '@/features/trigger/components/base-trigger-node';
import { ManualTriggerDialog } from '@/features/trigger/components/manual-trigger/dialog';
import { NodeProps } from '@xyflow/react';
import { MousePointerIcon } from 'lucide-react';
import { memo, useState } from 'react';

export const ManualTriggerNode = memo((props: NodeProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const nodeStatus = 'initial'; // TODO: Replace with actual status

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
      ></BaseTriggerNode>
    </>
  );
});

ManualTriggerNode.displayName = 'ManualTriggerNode';
