import {
  type ExecutionHistoryItem,
  type ExecutionHistoryQueryParams,
  type ExecutionHistoryResponse,
} from "@/features/executions/types/execution-history";
import { api } from "@/lib/api/config/axios";
import { API_ENDPOINTS } from "@/lib/api/config/endpoints";

export const fetchExecutions = async ({
  params,
}: {
  params?: ExecutionHistoryQueryParams;
}): Promise<ExecutionHistoryResponse> => {
  const response = await api.get(API_ENDPOINTS.EXECUTION_HISTORY.getAll, {
    params,
  });
  return response.data;
};

export const fetchExecutionById = async ({
  id,
}: {
  id: string;
}): Promise<ExecutionHistoryItem> => {
  const response = await api.get(API_ENDPOINTS.EXECUTION_HISTORY.getById(id));
  return response.data;
};
