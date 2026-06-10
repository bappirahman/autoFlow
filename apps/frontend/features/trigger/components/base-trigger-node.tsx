'use client';

import { BaseHandle } from '@/components/react-flow/base-handle';
import { BaseNode, BaseNodeContent } from '@/components/react-flow/base-node';
import { NodeStatusIndicator } from '@/components/react-flow/node-status-indicator';
import { NodeStatusEnum } from '@autoflow/shared';
import { WorkflowNode } from '@/components/workflow-node';
import { type NodeProps, Position, useReactFlow } from '@xyflow/react';
import type { LucideIcon } from 'lucide-react';
import Image from 'next/image';
import { memo, type ReactNode } from 'react';

interface BaseTriggerNodeProps extends NodeProps {
  id: string;
  icon: LucideIcon | string;
  name: string;
  description?: string;
  children?: ReactNode;
  status?: NodeStatusEnum;
  onSettings?: () => void;
  onDoubleClick?: () => void;
}

export const BaseTriggerNode = memo(
  ({
    id,
    icon: Icon,
    name,
    description,
    status = 'initial',
    children,
    onSettings,
    onDoubleClick,
  }: BaseTriggerNodeProps) => {
    const { setNodes, setEdges } = useReactFlow();

    const handleDelete = () => {
      console.log('clicked');
      setNodes((currentNodes) => currentNodes.filter((node) => node.id !== id));
      setEdges((currentEdges) =>
        currentEdges.filter((edge) => edge.source !== id && edge.target !== id),
      );
    };
    return (
      <WorkflowNode
        name={name}
        description={description}
        onDelete={handleDelete}
        onSettings={onSettings}
      >
        <NodeStatusIndicator status={status} variant="border">
          <BaseNode
            onDoubleClick={onDoubleClick}
            className="rounded-l-2xl relative group"
            status={status}
          >
            <BaseNodeContent>
              {typeof Icon === 'string' ? (
                <Image src={Icon} alt={`${name} icon`} width={16} height={16} />
              ) : (
                <Icon className="size-4 text-muted-foreground" />
              )}
              {children}
              <BaseHandle
                id="source-1"
                type="source"
                position={Position.Right}
              />
            </BaseNodeContent>
          </BaseNode>
        </NodeStatusIndicator>
      </WorkflowNode>
    );
  },
);

BaseTriggerNode.displayName = 'BaseTriggerNode';
