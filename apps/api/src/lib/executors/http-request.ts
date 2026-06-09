import type { NodeExecutor } from '@/types';
import { NonRetriableError } from 'inngest';
import Handlebars from 'handlebars';

Handlebars.registerHelper('json', (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  return new Handlebars.SafeString(jsonString);
});
type TMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
type HttpRequestData = {
  variableName: string; // variable name to store the response in context
  endpoint: string;
  method: TMethod;
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
      'HTTP Request Node: Variable name is required for HTTP Request node',
    );
  }
  if (!data.endpoint) {
    throw new NonRetriableError(
      'HTTP Request Node: Endpoint is required for HTTP Request node',
    );
  }
  if (!data.method) {
    throw new NonRetriableError(
      'HTTP Request Node: Method is required for HTTP Request node',
    );
  }

  const result = await step.run('http-request', async () => {
    // Compile the endpoint with Handlebars to allow dynamic values from context
    const endpoint = Handlebars.compile(data.endpoint)(context);
    const method = data.method;

    const options: RequestInit = { method };

    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      options.headers = { 'Content-Type': 'application/json' };
      const resolved = Handlebars.compile(data.body || '{}')(context);
      JSON.parse(resolved); // Validate JSON format
      options.body = resolved;
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
      [data.variableName]: responsePayload,
    };
  });
  return result;
};
