import type { SupportedLanguage } from "./config";

export const dictionaries = {
  en: {
    settings: "Settings",
    preferences: "Preferences",
    language: "Language",
    appearance: "Appearance",
  },
  ar: {
    settings: "Settings",
    preferences: "Preferences",
    language: "Language",
    appearance: "Appearance",
  },
} satisfies Record<SupportedLanguage, Record<string, string>>;
