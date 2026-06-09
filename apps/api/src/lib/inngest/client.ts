import { Inngest } from 'inngest';
import { realtimeMiddleware } from '@inngest/realtime/middleware';

export const inngest = new Inngest({
  id: process.env.APP_NAME || 'autoFlow',
  middleware: [realtimeMiddleware()],
});
