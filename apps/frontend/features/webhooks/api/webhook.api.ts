import { api } from "@/lib/api/config/axios";
import { API_ENDPOINTS } from "@/lib/api/config/endpoints";

export type WebhookResponse = {
  id: string;
  nodeId: string;
  workflowId: string;
  provider: string;
  secret: string;
  createdAt: string;
};

export const fetchWebhook = async ({
  nodeId,
  provider,
}: {
  nodeId: string;
  provider: string;
}) => {
  const response = await api.get(
    API_ENDPOINTS.WEBHOOKS.getOrCreate(nodeId, provider),
  );
  return response.data as WebhookResponse;
};
