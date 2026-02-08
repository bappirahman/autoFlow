# Inngest Event System Architecture

## Overview

This directory contains the centralized event-driven architecture using Inngest for background job processing.

## Directory Structure

```
lib/inngest/
├── client.ts          # Inngest client instance configuration
├── events/            # Domain event definitions
│   └── workflow.events.ts
└── README.md
```

## Adding New Events

### 1. Define Event in Domain Events File

```typescript
// apps/api/src/lib/inngest/events/your-domain.events.ts
import { z } from 'zod';

export const YOUR_DOMAIN_EVENTS = {
  CREATED: {
    name: 'your-domain/created' as const,
    schema: z.object({
      id: z.string().uuid(),
      // ... other fields
    }),
  },
} as const;

export type YourDomainCreatedPayload = z.infer<
  typeof YOUR_DOMAIN_EVENTS.CREATED.schema
>;
```

### 2. Register Event Schemas in Client

```typescript
// apps/api/src/lib/inngest/client.ts
import { YOUR_DOMAIN_EVENTS } from './events/your-domain.events';

const eventSchemas = new EventSchemas().fromZod({
  // ... existing events
  [YOUR_DOMAIN_EVENTS.CREATED.name]: {
    data: YOUR_DOMAIN_EVENTS.CREATED.schema as any,
  },
});
```

### 3. Create Event Handler

```typescript
// apps/api/src/modules/your-domain/your-domain.events.controller.ts
@Controller()
export class YourDomainEventsController {
  @AppInngest.Function({
    id: 'your-domain-created-handler',
    name: 'Handle Your Domain Created',
  })
  @AppInngest.Trigger({ event: YOUR_DOMAIN_EVENTS.CREATED.name })
  async handleCreated({
    event,
    step,
  }: NestInngest.context<
    typeof AppInngest,
    typeof YOUR_DOMAIN_EVENTS.CREATED.name
  >) {
    const data = (event as any).data as YourDomainCreatedPayload;

    await step.run('process-creation', async () => {
      // Business logic here
    });

    return { success: true };
  }
}
```

### 4. Register Controller in Module

```typescript
// apps/api/src/modules/your-domain/your-domain.module.ts
import { YourDomainEventsController } from './your-domain.events.controller';

@Module({
  controllers: [YourDomainEventsController],
})
export class YourDomainModule {}
```

## Event Naming Convention

- **Format**: `domain/action` (e.g., `workflow/created`, `user/updated`)
- **Domain**: Lowercase, singular noun representing the bounded context
- **Action**: Past tense verb describing what happened

## Function ID Convention

- **Format**: `domain-action-purpose` (e.g., `workflow-created-handler`, `workflow-created-email-sender`)
- **Multiple functions** can subscribe to the same event with different IDs
- Function IDs must be **globally unique** across your application

## Best Practices

1. **Idempotency**: Functions should be safe to retry
2. **Single Responsibility**: One function, one purpose
3. **Thin Handlers**: Delegate business logic to services
4. **Type Safety**: Always use Zod schemas and inferred types
5. **Observability**: Use `step.run()` for granular tracking
6. **Documentation**: Add JSDoc comments to all event handlers

## Known Issues

- **Zod 4.x Compatibility**: Using `as any` for schema registration due to internal type changes in Zod 4.x. Runtime validation still works correctly.

## Resources

- [Inngest Documentation](https://www.inngest.com/docs)
- [NestJS Inngest Integration](https://github.com/inngest/nest-inngest)
- [Event-Driven Architecture Patterns](https://martinfowler.com/articles/201701-event-driven.html)
