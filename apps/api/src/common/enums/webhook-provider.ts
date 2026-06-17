export const WebhookProvider = Object.freeze({
  GOOGLE_FORM: 'google_form',
  STRIPE: 'stripe',
} as const);

export type WebhookProviderEnum =
  (typeof WebhookProvider)[keyof typeof WebhookProvider];
