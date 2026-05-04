import { BaseTriggerNode } from '@/features/trigger/components/base-trigger-node';
import { NodeProps } from '@xyflow/react';
import { MousePointerIcon } from 'lucide-react';
import { memo } from 'react';

export const ManualTriggerNode = memo((props: NodeProps) => {
  return (
    <>
      <BaseTriggerNode
        {...props}
        icon={MousePointerIcon}
        name="Manual Trigger"
        // onSettings={handleOpenSettings}
        // onDoubleClick={handleDoubleClick} TODO: Implement settings and double click handlers
        // status={nodeStatus} TODO: Pass actual status
      ></BaseTriggerNode>
    </>
  );
});

ManualTriggerNode.displayName = 'ManualTriggerNode';
