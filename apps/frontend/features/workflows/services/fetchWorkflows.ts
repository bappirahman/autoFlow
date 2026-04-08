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
