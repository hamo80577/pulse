import type { Metadata } from "next";
import { defaultLanguage } from "@/lib/i18n/config";
import { getDirection } from "@/lib/i18n/direction";
import { defaultThemePreference } from "@/lib/preferences/defaults";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pulse",
  description: "Internal operations platform for workforce management.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      data-theme={defaultThemePreference}
      dir={getDirection(defaultLanguage)}
      lang={defaultLanguage}
    >
      <body>{children}</body>
    </html>
  );
}
