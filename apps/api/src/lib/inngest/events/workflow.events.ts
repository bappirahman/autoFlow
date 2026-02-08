import { z } from 'zod';

/**
 * Workflow domain events.
 * Note: Multiple functions can subscribe to the same event with different functionIds.
 */
export const WORKFLOW_EVENTS = {
  CREATED: {
    name: 'workflow/created' as const,
    schema: z.object({
      id: z.string().uuid(),
      name: z.string(),
      userId: z.string().uuid(),
    }),
  },
  UPDATED: {
    name: 'workflow/updated' as const,
    schema: z.object({
      id: z.string().uuid(),
      name: z.string().optional(),
    }),
  },
  DELETED: {
    name: 'workflow/deleted' as const,
    schema: z.object({
      id: z.string().uuid(),
    }),
  },
} as const;

// Inferred types from Zod schemas
export type WorkflowCreatedPayload = z.infer<
  typeof WORKFLOW_EVENTS.CREATED.schema
>;
export type WorkflowUpdatedPayload = z.infer<
  typeof WORKFLOW_EVENTS.UPDATED.schema
>;
export type WorkflowDeletedPayload = z.infer<
  typeof WORKFLOW_EVENTS.DELETED.schema
>;

export type WorkflowEventName =
  | typeof WORKFLOW_EVENTS.CREATED.name
  | typeof WORKFLOW_EVENTS.UPDATED.name
  | typeof WORKFLOW_EVENTS.DELETED.name;
