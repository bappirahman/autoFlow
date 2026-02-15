import { checkout, polar, portal, webhooks } from '@polar-sh/better-auth';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { eq } from 'drizzle-orm';

import { polarClient } from '@/lib/polar';
import { WebhookSubscriptionActivePayload } from '@polar-sh/sdk/models/components/webhooksubscriptionactivepayload.js';
import { drizzleDb } from '../db';
import { authSchema } from '../db/schema';
import { subscription, user } from '../db/schema';

export const auth = betterAuth({
  database: drizzleAdapter(drizzleDb, {
    provider: 'pg',
    schema: authSchema,
  }),
  baseUrl: process.env.API_URL || 'http://localhost:3000',
  basePath: '/api/auth',
  trustedOrigins: [process.env.CORS_URL!],
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  plugins: [
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      getCustomerCreateParams: async ({ user }) => {
        await Promise.resolve();
        return {
          email: user.email,
          externalId: user.id,
          metadata: {
            createdAt: new Date().toISOString(),
          },
        };
      },

      use: [
        checkout({
          products: [
            {
              productId: 'ac5c2e7d-b347-48f7-8531-6c04ad2ef7b2',
              slug: 'autoFlow-pro-Sandbox',
            },
          ],
          successUrl: process.env.POLAR_SUCCESS_URL,
          authenticatedUsersOnly: true,
        }),
        portal(),
        webhooks({
          secret: process.env.POLAR_WEBHOOK_SECRET!,
          onSubscriptionActive: async (
            payload: WebhookSubscriptionActivePayload,
          ): Promise<void> => {
            console.log('[Polar] Subscription active:', payload.data.id);

            const externalId = payload.data.customer?.externalId;
            if (!externalId) {
              console.error('[Polar] No externalId in subscription payload');
              return;
            }

            const userRecord = await drizzleDb
              .select()
              .from(user)
              .where(eq(user.id, externalId))
              .limit(1);
            if (userRecord.length === 0) {
              console.error('[Polar] User not found for customer:', externalId);
              return;
            }

            await drizzleDb
              .insert(subscription)
              .values({
                id: payload.data.id,
                userId: userRecord[0].id,
                polarSubscriptionId: payload.data.id,
                polarProductId: payload.data.productId,
                status: payload.data.status,
                currentPeriodStart: payload.data.currentPeriodStart
                  ? new Date(payload.data.currentPeriodStart)
                  : null,
                currentPeriodEnd: payload.data.currentPeriodEnd
                  ? new Date(payload.data.currentPeriodEnd)
                  : null,
                cancelAtPeriodEnd: payload.data.cancelAtPeriodEnd || false,
              })
              .onConflictDoUpdate({
                target: subscription.polarSubscriptionId,
                set: {
                  status: payload.data.status,
                  currentPeriodStart: payload.data.currentPeriodStart
                    ? new Date(payload.data.currentPeriodStart)
                    : null,
                  currentPeriodEnd: payload.data.currentPeriodEnd
                    ? new Date(payload.data.currentPeriodEnd)
                    : null,
                  cancelAtPeriodEnd: payload.data.cancelAtPeriodEnd || false,
                  updatedAt: new Date(),
                },
              });

            // Update user plan and status (current active subscription)
            await drizzleDb
              .update(user)
              .set({
                plan: 'pro',
                subscriptionStatus: 'active',
                updatedAt: new Date(),
              })
              .where(eq(user.id, userRecord[0].id));

            console.log(
              '[Polar] Subscription saved and user updated:',
              payload.data.id,
            );
          },
          onSubscriptionUpdated: async (payload): Promise<void> => {
            console.log('[Polar] Subscription updated:', payload.data.id);

            // Update subscription table
            await drizzleDb
              .update(subscription)
              .set({
                status: payload.data.status,
                currentPeriodStart: payload.data.currentPeriodStart
                  ? new Date(payload.data.currentPeriodStart)
                  : null,
                currentPeriodEnd: payload.data.currentPeriodEnd
                  ? new Date(payload.data.currentPeriodEnd)
                  : null,
                cancelAtPeriodEnd: payload.data.cancelAtPeriodEnd || false,
                updatedAt: new Date(),
              })
              .where(eq(subscription.polarSubscriptionId, payload.data.id));

            console.log('[Polar] Subscription updated in DB:', payload.data.id);
          },
          onSubscriptionCanceled: async (payload): Promise<void> => {
            console.log('[Polar] Subscription canceled:', payload.data.id);

            // Get subscription to find user
            const subscriptionRecord = await drizzleDb
              .select()
              .from(subscription)
              .where(eq(subscription.polarSubscriptionId, payload.data.id))
              .limit(1);

            // Update subscription table
            await drizzleDb
              .update(subscription)
              .set({
                status: 'canceled',
                cancelAtPeriodEnd: true,
                updatedAt: new Date(),
              })
              .where(eq(subscription.polarSubscriptionId, payload.data.id));

            // Update user to free plan if subscription was found
            if (subscriptionRecord.length > 0) {
              await drizzleDb
                .update(user)
                .set({
                  plan: 'free',
                  subscriptionStatus: 'canceled',
                  updatedAt: new Date(),
                })
                .where(eq(user.id, subscriptionRecord[0].userId));
            }

            console.log(
              '[Polar] Subscription canceled in DB:',
              payload.data.id,
            );
          },
        }),
      ],
    }),
  ],
});
