// import type { Realtime } from '@inngest/realtime';
// import { useInngestSubscription } from '@inngest/realtime/hooks';
// import { useEffect, useState } from 'react';
// import { type NodeStatusEnum, NodeStatus } from '@autoflow/shared';

// interface UseNodeStatusProps {
//   nodeId: string;
//   channel: string;
//   topic: string;
//   refreshToken: () => Promise<Realtime.Subscribe.Token>;
// }

// export const useNodeStatus = ({
//   nodeId,
//   channel,
//   topic,
//   refreshToken,
// }: UseNodeStatusProps) => {
//   const [status, setStatus] = useState<NodeStatusEnum>(NodeStatus.INITIAL);

//   const { data } = useInngestSubscription({
//     refreshToken,
//     enabled: true,
//   });

//   useEffect(() => {
//     if (!data.length) return;

//     // find the latest message for this node

//     const latestMessage = data
//       .filter(
//         (message) =>
//           message.kind === 'data' &&
//           message.channel === channel &&
//           message.topic === topic &&
//           message.data.nodeId === nodeId,
//       )
//       .sort((a, b) => {
//         if (a.kind === 'data' && b.kind === 'data') {
//           return (
//             new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//           );
//         }
//         return 0;
//       })[0];

//     if (latestMessage?.kind === 'data') {
//       setStatus(latestMessage.data.status as NodeStatusEnum);
//     }
//   }, [data, nodeId, channel, topic]);

//   return status;
// };
