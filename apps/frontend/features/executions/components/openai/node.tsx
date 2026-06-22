"use client";

import { OpenaiIcon } from "@/components/icons/openai-icon";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { OPENAI_MODELS, type OpenAIModel } from "@autoflow/shared";
import { OpenAIDialog, OpenAIFormValues } from "./dialog";
import { useOpenAIStatusToken } from "@/features/executions/hooks/use-openai-status-token";

type OpenAINodeData = {
  variableName?: string;
  model?: OpenAIModel;
  systemPrompt?: string;
  userPrompt?: string;
};

type OpenAINodeType = Node<OpenAINodeData> & { credentialId?: string | null };

export const OpenAINode = memo((props: NodeProps<OpenAINodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { getNode, setNodes } = useReactFlow();
  const { refreshToken } = useOpenAIStatusToken();

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    topic: "status",
    refreshToken,
  });

  const handleOpenSettings = () => setDialogOpen(true);

  const handleSubmit = (values: OpenAIFormValues) => {
    const { credentialId, ...nodeData } = values;
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === props.id) {
          return {
            ...node,
            credentialId: credentialId ?? null,
            data: {
              ...node.data,
              ...nodeData,
            },
          };
        }
        return node;
      }),
    );
  };

  const nodeData = props.data;
  const currentNode = getNode(props.id) as OpenAINodeType | undefined;
  const description = nodeData.userPrompt
    ? `${nodeData.model || OPENAI_MODELS[0]}: ${nodeData.userPrompt.slice(0, 50)}...`
    : "Not configured";

  return (
    <>
      <OpenAIDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={{
          ...nodeData,
          credentialId: currentNode?.credentialId ?? null,
        }}
      />
      <BaseExecutionNode
        {...props}
        icon={OpenaiIcon}
        name="OpenAI Execution"
        description={description}
        status={nodeStatus}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      ></BaseExecutionNode>
    </>
  );
});

OpenAINode.displayName = "OpenAINode";
