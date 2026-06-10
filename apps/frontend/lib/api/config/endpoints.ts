// lib/api/endpoints.ts
export const API_ENDPOINTS = {
  WORKFLOWS: {
    getAll: `/workflows`,
    getById: (id: string) => `/workflows/${id}`,
    create: `/workflows`,
    update: (id: string) => `/workflows/${id}`,
    remove: (id: string) => `/workflows/${id}`,
    execute: (id: string) => `/workflows/${id}/execute`,
  },
  EXECUTIONS: {
    httpRequestStatusToken: () => '/realtime/http-request/status',
    manualTriggerStatusToken: () => '/realtime/manual-trigger/status',
  },
  USER: {
    base: '/users',
    getAll: () => `/users`,
    getById: (id: string) => `/users/${id}`,
    create: () => `/users`,
    update: (id: string) => `/users/${id}`,
    delete: (id: string) => `/users/${id}`,
  },
};
