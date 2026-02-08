import { Inngest, EventSchemas } from 'inngest';
import { NestInngest } from 'nest-inngest';
import { WORKFLOW_EVENTS } from './events/workflow.events';

type EventSchemaMap = Parameters<EventSchemas['fromZod']>[0];

// Cast to EventSchemaMap to work around Zod 4.x type incompatibility
const eventSchemas = new EventSchemas().fromZod({
  [WORKFLOW_EVENTS.CREATED.name]: {
    data: WORKFLOW_EVENTS.CREATED.schema,
  },
  [WORKFLOW_EVENTS.UPDATED.name]: {
    data: WORKFLOW_EVENTS.UPDATED.schema,
  },
  [WORKFLOW_EVENTS.DELETED.name]: {
    data: WORKFLOW_EVENTS.DELETED.schema,
  },
} as unknown as EventSchemaMap);

export const inngest = new Inngest({
  id: process.env.APP_NAME || 'autoFlow',
  schemas: eventSchemas,
});

export const AppInngest = NestInngest.from(inngest);
