import type { SupportedLanguage } from "@/lib/i18n/config";

export const themePreferences = ["light", "dark", "system"] as const;

export type ThemePreference = (typeof themePreferences)[number];

export type UserPreferenceFoundation = {
  language: SupportedLanguage;
  theme: ThemePreference;
};
