"use client";

import { DiscordIcon } from "@/components/icons/discord-icon";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
// import { GEMINI_MODELS, type GeminiModel } from "@autoflow/shared";
import { useDiscordStatusToken } from "@/features/executions/hooks/use-discord-status-token";
import { DiscordDialog, DiscordFormValues } from "./dialog";

type DiscordNodeData = {
  variableName?: string;
  webhookUrl?: string;
  content?: string;
  username?: string;
};

type DiscordNodeType = Node<DiscordNodeData> & { credentialId?: string | null };

export const DiscordNode = memo((props: NodeProps<DiscordNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { getNode, setNodes } = useReactFlow();
  const { refreshToken } = useDiscordStatusToken();

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    topic: "status",
    refreshToken,
  });

  const handleOpenSettings = () => setDialogOpen(true);

  const handleSubmit = (values: DiscordFormValues) => {
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
  const currentNode = getNode(props.id) as DiscordNodeType | undefined;
  const description = nodeData?.content
    ? `Send "${nodeData.content.slice(0, 50)}..." to Discord`
    : "No content configured";

  return (
    <>
      <DiscordDialog
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
        icon={DiscordIcon}
        name="Discord Execution"
        description={description}
        status={nodeStatus}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      ></BaseExecutionNode>
    </>
  );
});

DiscordNode.displayName = "DiscordNode";
