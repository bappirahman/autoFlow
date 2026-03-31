import { api } from "@/lib/api/config/axios";
import { API_ENDPOINTS } from "@/lib/api/config/endpoints";

export const createWorkflow = async (data: unknown) => {
  const response = await api.post(API_ENDPOINTS.WORKFLOWS.create, data);
  return response.data;
};
