import { type Realtime } from '@inngest/realtime';

import { api } from '@/lib/api/config/axios';
import { API_ENDPOINTS } from '@/lib/api/config/endpoints';

export const fetchHttpRequestStatusToken =
  async (): Promise<Realtime.Subscribe.Token> => {
    const response = await api.get(
      API_ENDPOINTS.EXECUTIONS.httpRequestStatusToken(),
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
