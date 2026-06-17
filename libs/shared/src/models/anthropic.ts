export const ANTHROPIC_MODELS = [
  // Claude 4
  "claude-opus-4-1",
  "claude-opus-4",
  "claude-sonnet-4",
  "claude-haiku-4-5",

  // Claude 3.7
  "claude-3-7-sonnet-20250219",

  // Claude 3.5
  "claude-3-5-sonnet-20241022",
  "claude-3-5-sonnet-20240620",
  "claude-3-5-haiku-20241022",

  // Claude 3
  "claude-3-opus-20240229",
  "claude-3-sonnet-20240229",
  "claude-3-haiku-20240307",
] as const;

export type AnthropicModel = (typeof ANTHROPIC_MODELS)[number];
