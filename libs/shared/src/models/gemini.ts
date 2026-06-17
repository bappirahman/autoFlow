export const GEMINI_MODELS = [
  // Gemini 3.x
  "gemini-3.1-pro",
  "gemini-3.5-flash",
  "gemini-3.1-flash-live",

  // Gemini 2.5
  "gemini-2.5-pro",
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",

  // Gemini 2.0
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",

  // Gemini 1.5
  "gemini-1.5-pro",
  "gemini-1.5-flash",
] as const;

export type GeminiModel = (typeof GEMINI_MODELS)[number];
