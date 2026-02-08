// src/lib/api/endpoints.ts
export const API_ENDPOINTS = {
  workflows: {
    base: "/workflows",
    getAll: () => `${API_ENDPOINTS.workflows.base}/get-all`,
    byId: (id: string) => `${API_ENDPOINTS.workflows.base}/${id}`,
    publish: (id: string) => `${API_ENDPOINTS.workflows.base}/${id}/publish`,
  },
};
