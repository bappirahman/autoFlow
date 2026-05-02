export const CredentialType = Object.freeze({
  OPENAI: 'OPENAI',
  ANTHROPIC: 'ANTHROPIC',
  GEMINI: 'GEMINI',
} as const);

export type CredentialTypeEnum =
  (typeof CredentialType)[keyof typeof CredentialType];
