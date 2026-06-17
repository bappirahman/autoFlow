export const OPENAI_MODELS = [
  // GPT Models (text)
  "gpt-5",
  "gpt-5-mini",
  "gpt-5-nano",
  "gpt-5.1",
  "gpt-5.1-codex-max",
  "gpt-4.5",
  "gpt-4o",
  "gpt-4o-mini",
  "gpt-4-turbo",
  "gpt-4",
  "gpt-3.5-turbo",

  // Reasoning Models
  "o1",
  "o1-mini",
  "o1-preview",
  "o3",
  "o3-mini",
  "o4-mini",
] as const;

export type OpenAIModel = (typeof OPENAI_MODELS)[number];
