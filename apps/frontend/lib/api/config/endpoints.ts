// lib/api/endpoints.ts
export const API_ENDPOINTS = {
  WORKFLOWS: {
    getAll: `/workflows`,
    getById: (id: string) => `/workflows/${id}`,
    create: `/workflows`,
    updateName: (id: string) => `/workflows/${id}`,
    remove: (id: string) => `/workflows/${id}`,
  },
  USER: {
    base: "/users",
    getAll: () => `/users`,
    getById: (id: string) => `/users/${id}`,
    create: () => `/users`,
    update: (id: string) => `/users/${id}`,
    delete: (id: string) => `/users/${id}`,
  },
};
