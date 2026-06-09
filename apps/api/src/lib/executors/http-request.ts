import type { NodeExecutor } from '@/types';
import { NonRetriableError } from 'inngest';

type TMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
type HttpRequestData = {
  variableName?: string; // variable name to store the response in context
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

  if (!data.variableName) {
    throw new NonRetriableError(
      'Variable name is required for HTTP Request node',
    );
  }
  if (!data.endpoint) {
    throw new NonRetriableError('Endpoint is required for HTTP Request node');
  }

  const result = await step.run('http-request', async () => {
    const method = data.method || 'GET';
    const endpoint = data.endpoint!;

    const options: RequestInit = { method };

    if (['POST', 'PUT', 'PATCH'].includes(method) && data.body) {
      options.headers = { 'Content-Type': 'application/json' };
      options.body = data.body;
    }

    const response = await step.fetch(endpoint, options);
    const contentType = response.headers.get('content-type');
    const responseData: unknown = contentType?.includes('application/json')
      ? await response.json()
      : await response.text();

    const responsePayload = {
      httpResponse: {
        status: response.status,
        statusText: response.statusText,
        data: responseData,
      },
    };

    return {
      ...context,
      [data.variableName!]: responsePayload,
    };
  });
  return result;
};
