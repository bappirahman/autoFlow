import { api } from "./config/axios";

export const getAllWorkflows = async () => {
  const response = await api.get("workflow/get-all");
  return response.data;
};
