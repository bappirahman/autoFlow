import { api } from "@/lib/api/config/axios";
import { API_ENDPOINTS } from "@/lib/api/config/endpoints";

/**
 * Single typed service for both SSR and CSR.
 */
export const fetchWorkflows = async () => {
  const response = await api.get(API_ENDPOINTS.WORKFLOWS.getAll);
  return response.data;
};
