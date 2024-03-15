import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";

// Can be imported from a shared config
// const locales = ["en", "de"];

export const i18n = {
  defaultLocale: "en",
  locales: ["en", "de"],
} as const;

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!i18n.locales.includes(locale as any)) notFound();

  return {
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});

export type Locale = (typeof i18n)["locales"][number];
