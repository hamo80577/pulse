import type { SupportedLanguage } from "./config";

export type TextDirection = "ltr" | "rtl";

export function getDirection(language: SupportedLanguage): TextDirection {
  return language === "ar" ? "rtl" : "ltr";
}
