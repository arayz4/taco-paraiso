import type { Locale } from "@/i18n/settings";
import type { PlaceToTry, Restaurant } from "@/types/database";

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

export function placeToTryName(place: PlaceToTry, locale: Locale) {
  return locale === "en" ? place.name_en || place.name : place.name || place.name_en || "";
}

export function placeToTryNote(place: PlaceToTry, locale: Locale) {
  return locale === "en" ? place.note_en || place.note : place.note || place.note_en;
}

export function formatDate(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "ja" ? "ja-JP" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}
