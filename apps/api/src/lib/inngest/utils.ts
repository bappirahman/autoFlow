import { Connection, Node } from '@/db/schema';
import type { Realtime } from '@inngest/realtime';
import type { NodeStatusEnum } from '@autoflow/shared';
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

export function getReachableNodes(
  startNodeId: string,
  nodes: Node[],
  connections: Connection[],
): Node[] {
  const visited = new Set<string>([startNodeId]);
  const queue = [startNodeId];
  while (queue.length) {
    const current = queue.shift()!;
    for (const conn of connections) {
      if (conn.fromNodeId === current && !visited.has(conn.toNodeId)) {
        visited.add(conn.toNodeId);
        queue.push(conn.toNodeId);
      }
    }
  }
  return nodes.filter((n) => visited.has(n.id));
}

export const getChannelKey = (userId: string, channelName: string) =>
  `${channelName}:${userId}`;

type PublishToken = Parameters<Realtime.PublishFn>[0];

type StatusChannel = {
  status: (args: { nodeId: string; status: NodeStatusEnum }) => PublishToken;
};

/**
 * Creates a `publishStatus` helper bound to a specific Inngest channel and node.
 *
 * Each executor uses a dedicated channel (e.g. `geminiChannel`, `httpRequestChannel`).
 * This factory captures the `publish` function, channel instance, and nodeId so
 * callers only need to pass the status value.
 *
 * @param publish - The Inngest `publish` function from the executor params.
 * @param channel - The channel instance bound to a userId (e.g. `geminiChannel(userId)`).
 * @param nodeId - The ID of the node whose status is being published.
 *
 * @example
 * const publishStatus = createPublishStatus(publish, geminiChannel(userId), nodeId);
 * await publishStatus(NodeStatus.LOADING);
 */
export function createPublishStatus(
  publish: Realtime.PublishFn,
  channel: StatusChannel,
  nodeId: string,
) {
  return (status: NodeStatusEnum) =>
    publish(channel.status({ nodeId, status }));
}
