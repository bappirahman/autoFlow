export const OPENAI_MODELS = [
  // GPT-5 Series
  "gpt-5",
  "gpt-5-mini",
  "gpt-5-nano",

  // Reasoning Models
  "o3",
  "o4-mini",

  // Legacy
  "gpt-4",
  "gpt-4o",
] as const;

export type OpenAIModel = (typeof OPENAI_MODELS)[number];
