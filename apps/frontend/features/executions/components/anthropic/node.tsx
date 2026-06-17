"use client";

import { AnthropicIcon } from "@/components/icons/anthropic-icon";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { ANTHROPIC_MODELS, type AnthropicModel } from "@autoflow/shared";
import { AnthropicDialog, AnthropicFormValues } from "./dialog";
import { useAnthropicStatusToken } from "@/features/executions/hooks/use-anthropic-status-token";

type AnthropicNodeData = {
  variableName?: string;
  model?: AnthropicModel;
  systemPrompt?: string;
  userPrompt?: string;
};

type AnthropicNodeType = Node<AnthropicNodeData>;

export const AnthropicNode = memo((props: NodeProps<AnthropicNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();
  const { refreshToken } = useAnthropicStatusToken();

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    topic: "status",
    refreshToken,
  });

  const handleOpenSettings = () => setDialogOpen(true);

  const handleSubmit = (values: AnthropicFormValues) => {
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
    ? `${nodeData.model || ANTHROPIC_MODELS[0]}: ${nodeData.userPrompt.slice(0, 50)}...`
    : "Not configured";

  return (
    <>
      <AnthropicDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        icon={AnthropicIcon}
        name="Anthropic Execution"
        description={description}
        status={nodeStatus}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      ></BaseExecutionNode>
    </>
  );
});

AnthropicNode.displayName = "AnthropicNode";
