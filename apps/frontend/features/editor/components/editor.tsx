"use client";

import { useState, useCallback, useMemo } from "react";
import { ErrorView, LoadingView } from "@/components/entity-component";
import { useWorkflow } from "@/features/workflows/hooks/use-workflows";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type Node,
  type Edge,
  type NodeChange,
  type Connection,
  EdgeChange,
  Background,
  MiniMap,
  Panel,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { nodeComponents } from "@/config/node-components";
import { AddNodeButton } from "@/features/editor/components/add-node-button";
import { useSetAtom } from "jotai";
import { editorAtom } from "@/features/editor/store/atom";
import { NodeType } from "@autoflow/shared";
import { ExecuteWorkflowButton } from "@/features/editor/components/execute-workflow-button";

export const EditorLoading = () => {
  return <LoadingView message="Loading Editor..." />;
};

export const EditorError = ({ message }: { message: string }) => {
  return <ErrorView message={message} />;
};

const EditorCanvas = ({
  initialNodes,
  initialEdges,
  workflowId,
}: {
  initialNodes: Node[];
  initialEdges: Edge[];
  workflowId: string;
}) => {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const setEditor = useSetAtom(editorAtom);
  console.log("initialEdges", initialEdges);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );

  const hasManualTrigger = useMemo(() => {
    return nodes.some((node) => node.type === NodeType.MANUAL_TRIGGER);
  }, [nodes]);

  return (
    <section className="size-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setEditor}
        nodeTypes={nodeComponents}
        fitView
        proOptions={{
          hideAttribution: true,
        }}
        snapGrid={[10, 10]}
        snapToGrid
        panOnScroll
        selectionOnDrag
      >
        <Background />
        <MiniMap />
        <Panel position="top-right">
          <AddNodeButton />
        </Panel>
        {hasManualTrigger && (
          <Panel position="bottom-center">
            <ExecuteWorkflowButton workflowId={workflowId} />
          </Panel>
        )}
      </ReactFlow>
    </section>
  );
};

export const Editor = ({ workflowId }: { workflowId: string }) => {
  const { data: workflow, isLoading, error } = useWorkflow({ id: workflowId });

  if (isLoading) {
    return <EditorLoading />;
  }
  if (error) {
    return <EditorError message={error.message} />;
  }
  if (!workflow) {
    return <EditorLoading />;
  }

  return (
    <EditorCanvas
      key={workflow.id}
      initialNodes={workflow.nodes ?? []}
      initialEdges={workflow.edges ?? []}
      workflowId={workflow.id}
    />
  );
};
