import { defaultLanguage } from "../i18n/config";
import { themePreferences, type ThemePreference } from "./types";

export const defaultLanguagePreference = defaultLanguage;
export const defaultThemePreference: ThemePreference = "light";

export function isThemePreference(value: unknown): value is ThemePreference {
  return (
    typeof value === "string" &&
    themePreferences.includes(value as ThemePreference)
  );
}
