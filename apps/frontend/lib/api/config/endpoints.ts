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
    httpRequestStatusToken: () => "/realtime/http-request/status",
    geminiStatusToken: () => "/realtime/gemini/status",
    openaiStatusToken: () => "/realtime/openai/status",
    anthropicStatusToken: () => "/realtime/anthropic/status",
    manualTriggerStatusToken: () => "/realtime/manual-trigger/status",
    googleFormTriggerStatusToken: () => "/realtime/google-form-trigger/status",
    stripeTriggerStatusToken: () => "/realtime/stripe-trigger/status",
    discordStatusToken: () => "/realtime/discord/status",
    slackStatusToken: () => "/realtime/slack/status",
  },
  WEBHOOKS: {
    getOrCreate: (nodeId: string, provider: string) =>
      `/webhooks/${nodeId}/${provider}`,
  },
  CREDENTIALS: {
    getAll: `/credentials`,
    create: `/credentials`,
    remove: (id: string) => `/credentials/${id}`,
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
