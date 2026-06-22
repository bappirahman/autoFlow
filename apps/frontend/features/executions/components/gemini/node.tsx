"use client";

import { GeminiIcon } from "@/components/icons/gemini-icon";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { GEMINI_MODELS, type GeminiModel } from "@autoflow/shared";
import { GeminiDialog, GeminiFormValues } from "./dialog";
import { useGeminiStatusToken } from "@/features/executions/hooks/use-gemini-status-token";

type GeminiNodeData = {
  variableName?: string;
  model?: GeminiModel;
  systemPrompt?: string;
  userPrompt?: string;
};

type GeminiNodeType = Node<GeminiNodeData> & { credentialId?: string | null };

export const GeminiNode = memo((props: NodeProps<GeminiNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { getNode, setNodes } = useReactFlow();
  const { refreshToken } = useGeminiStatusToken();

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    topic: "status",
    refreshToken,
  });

  const handleOpenSettings = () => setDialogOpen(true);

  const handleSubmit = (values: GeminiFormValues) => {
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
  const currentNode = getNode(props.id) as GeminiNodeType | undefined;
  const description = nodeData.userPrompt
    ? `${nodeData.model || GEMINI_MODELS[0]}: ${nodeData.userPrompt.slice(0, 50)}...`
    : "Not configured";

  return (
    <>
      <GeminiDialog
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

GeminiNode.displayName = "GeminiNode";
