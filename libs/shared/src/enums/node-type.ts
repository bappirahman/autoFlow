export const NodeType = Object.freeze({
  INITIAL: 'INITIAL',
  MANUAL_TRIGGER: 'MANUAL_TRIGGER',
  HTTP_REQUEST: 'HTTP_REQUEST',
  GOOGLE_FORM_TRIGGER: 'GOOGLE_FORM_TRIGGER',
  STRIPE_TRIGGER: 'STRIPE_TRIGGER',
  ANTHROPIC: 'ANTHROPIC',
  GEMINI: 'GEMINI',
  OPENAI: 'OPENAI',
  DISCORD: 'DISCORD',
  SLACK: 'SLACK',
} as const);

export type NodeTypeEnum = (typeof NodeType)[keyof typeof NodeType];
