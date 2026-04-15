import {
  type WorkflowsQueryParams,
  type WorkflowsResponse,
} from "@/features/workflows/types/workflow";
import { api } from "@/lib/api/config/axios";
import { API_ENDPOINTS } from "@/lib/api/config/endpoints";

export const fetchWorkflows = async ({
  params,
}: {
  params?: WorkflowsQueryParams;
}): Promise<WorkflowsResponse> => {
  const response = await api.get(API_ENDPOINTS.WORKFLOWS.getAll, { params });
  return response.data;
};

export const createWorkflow = async (data: unknown) => {
  const response = await api.post(API_ENDPOINTS.WORKFLOWS.create, data);
  return response.data;
};

export const removeWorkflow = async (id: string) => {
  const response = await api.delete(API_ENDPOINTS.WORKFLOWS.remove(id));
  return response.data;
};
