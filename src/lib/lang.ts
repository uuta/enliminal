export const SUPPORTED_LANGS = [
  "en",
  "ja",
  "de",
  "fr",
  "es",
  "zh",
  "ru",
  "pt",
  "ar",
  "ko",
  "it",
  "nl",
] as const;

export type Language = (typeof SUPPORTED_LANGS)[number];
