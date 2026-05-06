export const supportedLanguages = ["en", "ar"] as const;

export type SupportedLanguage = (typeof supportedLanguages)[number];

export const defaultLanguage: SupportedLanguage = "en";

export function isSupportedLanguage(value: unknown): value is SupportedLanguage {
  return (
    typeof value === "string" &&
    supportedLanguages.includes(value as SupportedLanguage)
  );
}
