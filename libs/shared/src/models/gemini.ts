export const GEMINI_MODELS = [
  // Gemini 3 Series
  "gemini-3.1-pro", // Supports thinkingLevel: 'low', 'medium', 'high'
  "gemini-3-pro", // Supports thinkingLevel: 'low', 'high'
  "gemini-3-flash", // Supports thinkingLevel: 'minimal', 'low', 'medium', 'high'

  // Gemini 2.5 Series
  "gemini-2.5-pro",
  "gemini-2.5-flash",
] as const;

export type GeminiModel = (typeof GEMINI_MODELS)[number];
