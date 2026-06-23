import { type Realtime } from "@inngest/realtime";

import { api } from "@/lib/api/config/axios";
import { API_ENDPOINTS } from "@/lib/api/config/endpoints";

export const fetchHttpRequestStatusToken =
  async (): Promise<Realtime.Subscribe.Token> => {
    const response = await api.get(
      API_ENDPOINTS.EXECUTIONS.httpRequestStatusToken(),
    );
    return response.data;
  };
export const fetchGeminiStatusToken =
  async (): Promise<Realtime.Subscribe.Token> => {
    const response = await api.get(
      API_ENDPOINTS.EXECUTIONS.geminiStatusToken(),
    );
    return response.data;
  };
export const fetchDiscordStatusToken =
  async (): Promise<Realtime.Subscribe.Token> => {
    const response = await api.get(
      API_ENDPOINTS.EXECUTIONS.discordStatusToken(),
    );
    return response.data;
  };

export const fetchSlackStatusToken =
  async (): Promise<Realtime.Subscribe.Token> => {
    const response = await api.get(API_ENDPOINTS.EXECUTIONS.slackStatusToken());
    return response.data;
  };

export const fetchOpenAIStatusToken =
  async (): Promise<Realtime.Subscribe.Token> => {
    const response = await api.get(
      API_ENDPOINTS.EXECUTIONS.openaiStatusToken(),
    );
    return response.data;
  };

export const fetchAnthropicStatusToken =
  async (): Promise<Realtime.Subscribe.Token> => {
    const response = await api.get(
      API_ENDPOINTS.EXECUTIONS.anthropicStatusToken(),
    );
    return response.data;
  };

export const fetchManualTriggerStatusToken =
  async (): Promise<Realtime.Subscribe.Token> => {
    const response = await api.get(
      API_ENDPOINTS.EXECUTIONS.manualTriggerStatusToken(),
    );
    return response.data;
  };
export const fetchGoogleFormTriggerStatusToken =
  async (): Promise<Realtime.Subscribe.Token> => {
    const response = await api.get(
      API_ENDPOINTS.EXECUTIONS.googleFormTriggerStatusToken(),
    );
    return response.data;
  };

export const fetchStripeTriggerStatusToken =
  async (): Promise<Realtime.Subscribe.Token> => {
    const response = await api.get(
      API_ENDPOINTS.EXECUTIONS.stripeTriggerStatusToken(),
    );
    return response.data;
  };
