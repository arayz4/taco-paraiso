import type { Locale } from "@/i18n/settings";

export const siteConfig = {
  titles: {
    ja: "タコパライソ",
    en: "TACOS PARAÍSO",
  } satisfies Record<Locale, string>,
  defaultLocale: "ja" as Locale,
  photoBucket: "restaurant-photos",
  maxImageSizeMb: 5,
};
