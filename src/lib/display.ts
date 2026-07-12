import type { Locale } from "@/i18n/settings";
import type { Restaurant } from "@/types/database";

export function restaurantName(restaurant: Restaurant, locale: Locale) {
  if (locale === "en") {
    return restaurant.name_en || restaurant.name;
  }
  return restaurant.name || restaurant.name_en || "";
}

export function restaurantComment(restaurant: Restaurant, locale: Locale) {
  if (locale === "en") {
    return restaurant.comment_en || restaurant.comment;
  }
  return restaurant.comment || restaurant.comment_en || "";
}

export function formatDate(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "ja" ? "ja-JP" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}
