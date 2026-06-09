import { Connection, Node } from '@/db/schema';
import toposort from 'toposort';

export const topologicalSort = (
  nodes: Node[],
  connections: Connection[],
): Node[] => {
  if (connections.length === 0) {
    return nodes;
  }

  const allNodeIds = nodes.map((n) => n.id);
  const edges: [string, string][] = connections.map((conn) => [
    conn.fromNodeId,
    conn.toNodeId,
  ]);

  let sortedNodeIds: string[];
  try {
    sortedNodeIds = toposort.array(allNodeIds, edges);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Cyclic')) {
      throw new Error('Workflow contains a cycle');
    }
    throw error;
  }

  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  return sortedNodeIds.map((id) => nodeMap.get(id)!).filter(Boolean);
};
