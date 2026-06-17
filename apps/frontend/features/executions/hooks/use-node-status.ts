import type { Realtime } from "@inngest/realtime";
import { useInngestSubscription } from "@inngest/realtime/hooks";
import { useMemo } from "react";

import { NodeStatus, type NodeStatusEnum } from "@autoflow/shared";

interface UseNodeStatusProps {
  nodeId: string;
  topic: string;
  refreshToken: () => Promise<Realtime.Subscribe.Token>;
}

export const useNodeStatus = ({
  nodeId,
  topic,
  refreshToken,
}: UseNodeStatusProps) => {
  const { data } = useInngestSubscription({
    refreshToken,
    enabled: true,
  });

  return useMemo(() => {
    if (!data?.length) {
      return NodeStatus.INITIAL as NodeStatusEnum;
    }

    const latestMessage = data
      .filter(
        (message) =>
          message.kind === "data" &&
          message.topic === topic &&
          message.data.nodeId === nodeId,
      )
      .sort((a, b) => {
        if (a.kind === "data" && b.kind === "data") {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }

        return 0;
      })[0];

    return (latestMessage?.data.status as NodeStatusEnum) ?? NodeStatus.INITIAL;
  }, [data, nodeId, topic]);
};
