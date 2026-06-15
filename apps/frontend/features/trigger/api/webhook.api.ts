import { api } from '@/lib/api/config/axios';
import { API_ENDPOINTS } from '@/lib/api/config/endpoints';

export const fetchWebhook = async ({ workflowId }: { workflowId: string }) => {
  const response = await api.get(API_ENDPOINTS.WEBHOOKS.getOrCreate(workflowId));
  return response.data as { id: string; workflowId: string; secret: string; createdAt: string };
};
