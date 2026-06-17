'use client';

import { GeminiIcon } from '@/components/icons/gemini-icon';
import { useNodeStatus } from '@/features/executions/hooks/use-node-status';
import { useReactFlow, type Node, type NodeProps } from '@xyflow/react';
import { memo, useState } from 'react';
import { BaseExecutionNode } from '../base-execution-node';
import { GEMINI_MODELS, type GeminiModel } from '@autoflow/shared';
import { GeminiDialog, GeminiFormValues } from './dialog';
import { useGeminiStatusToken } from '@/features/executions/hooks/use-gemini-status-token';

type GeminiNodeData = {
  model?: GeminiModel;
  systemPrompt?: string;
  userPrompt?: string;
};

type GeminiNodeType = Node<GeminiNodeData>;

export const GeminiNode = memo((props: NodeProps<GeminiNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();
  const { refreshToken } = useGeminiStatusToken();

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    topic: 'status',
    refreshToken,
  });

  const handleOpenSettings = () => setDialogOpen(true);

  const handleSubmit = (values: GeminiFormValues) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === props.id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...values,
            },
          };
        }
        return node;
      }),
    );
  };

  const nodeData = props.data;
  const description = nodeData.userPrompt
    ? `${nodeData.model || GEMINI_MODELS[0]}: ${nodeData.userPrompt.slice(0, 50)}...`
    : 'Not configured';

  return (
    <>
      <GeminiDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        icon={GeminiIcon}
        name="Gemini Execution"
        description={description}
        status={nodeStatus}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      ></BaseExecutionNode>
    </>
  );
});

GeminiNode.displayName = 'GeminiNode';
