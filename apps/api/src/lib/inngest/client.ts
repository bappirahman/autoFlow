import { Inngest } from 'inngest';

export const inngest = new Inngest({ id: process.env.APP_NAME || 'autoFlow' });
