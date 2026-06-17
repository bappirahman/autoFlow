'use client';

import { BaseHandle } from '@/components/react-flow/base-handle';
import { BaseNode, BaseNodeContent } from '@/components/react-flow/base-node';
import { NodeStatusIndicator } from '@/components/react-flow/node-status-indicator';
import { WorkflowNode } from '@/components/workflow-node';
import { type NodeProps, Position, useReactFlow } from '@xyflow/react';
import type { LucideIcon } from 'lucide-react';
import Image from 'next/image';
import { memo, type ReactNode } from 'react';
import { type NodeStatusEnum, NodeStatus } from '@autoflow/shared';
interface BaseExecutionNodeProps extends NodeProps {
  icon: LucideIcon | string | React.ComponentType<{ className?: string }>;
  name: string;
  description?: string;
  children?: ReactNode;
  status?: NodeStatusEnum;
  onSettings?: () => void;
  onDoubleClick?: () => void;
}

export const BaseExecutionNode = memo<BaseExecutionNodeProps>(
  ({
    id,
    icon: Icon,
    name,
    description,
    status = NodeStatus.INITIAL,
    children,
    onSettings,
    onDoubleClick,
  }: BaseExecutionNodeProps) => {
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
        {/* TODO: Wrap within NodeStatus */}
        <NodeStatusIndicator status={status} variant="border">
          <BaseNode onDoubleClick={onDoubleClick} status={status}>
            <BaseNodeContent>
              {typeof Icon === 'string' ? (
                <Image src={Icon} alt={`${name} icon`} width={16} height={16} />
              ) : (
                <Icon className="size-4 text-muted-foreground" />
              )}
              {children}
              <BaseHandle
                id="target-1"
                type="target"
                position={Position.Left}
              />
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

BaseExecutionNode.displayName = 'BaseExecutionNode';
