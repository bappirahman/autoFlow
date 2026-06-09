import type { NodeExecutor } from '@/types';
import { NonRetriableError } from 'inngest';

type TMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
type HttpRequestData = {
  endpoint?: string;
  method?: TMethod;
  body?: string;
};

export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
  data,
  context,
  step,
}) => {
  // TODO: publish 'loading' state for http request node

  if (!data.endpoint) {
    throw new NonRetriableError('Endpoint is required for HTTP Request node');
  }

  const result = await step.run('http-request', async () => {
    const method = data.method || 'GET';
    const endpoint = data.endpoint!;

    const options: RequestInit = { method };

    if (['POST', 'PUT', 'PATCH'].includes(method) && data.body) {
      options.body = data.body;
    }

    const response = await step.fetch(endpoint, options);
    const contentType = response.headers.get('content-type');
    const responseData: unknown = contentType?.includes('application/json')
      ? await response.json()
      : await response.text();

    return {
      ...context,
      httpResponse: {
        status: response.status,
        statusText: response.statusText,
        data: responseData,
      },
    };
  });

  // TODO: publish 'success' state for http request node with result

  return result;
};
