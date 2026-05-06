import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/ui/section-card";
import { supportedLanguages } from "@/lib/i18n/config";
import { getDirection } from "@/lib/i18n/direction";
import {
  defaultLanguagePreference,
  defaultThemePreference,
} from "@/lib/preferences/defaults";
import { themePreferences } from "@/lib/preferences/types";

const languageLabels = {
  en: "English",
  ar: "Arabic",
} as const;

const themeLabels = {
  light: "Light",
  dark: "Dark",
  system: "System",
} as const;

export function PreferencesFoundation({
  settingsHref,
}: {
  settingsHref: string;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <SectionCard
        description="Foundation only. Preferences are not saved yet."
        title="Language"
      >
        <div className="grid gap-3">
          {supportedLanguages.map((language) => (
            <div
              className="flex items-center justify-between gap-3 rounded-md border p-3"
              key={language}
            >
              <div>
                <p className="font-medium">{languageLabels[language]}</p>
                <p className="text-sm text-muted-foreground">
                  Direction: {getDirection(language).toUpperCase()}
                </p>
              </div>
              {language === defaultLanguagePreference ? (
                <Badge variant="secondary">Default</Badge>
              ) : (
                <Badge variant="outline">Available</Badge>
              )}
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        description="Current UI remains light until preference persistence is built."
        title="Appearance"
      >
        <div className="grid gap-3">
          {themePreferences.map((theme) => (
            <div
              className="flex items-center justify-between gap-3 rounded-md border p-3"
              key={theme}
            >
              <p className="font-medium">{themeLabels[theme]}</p>
              {theme === defaultThemePreference ? (
                <Badge variant="secondary">Default</Badge>
              ) : (
                <Badge variant="outline">Prepared</Badge>
              )}
            </div>
          ))}
        </div>
      </SectionCard>

      <div className="lg:col-span-2">
        <Button asChild variant="outline">
          <Link href={settingsHref}>Back to settings</Link>
        </Button>
      </div>
    </div>
  );
}
