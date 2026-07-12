import { en } from "@/messages/en";
import { ja } from "@/messages/ja";
import type { Locale } from "@/i18n/settings";

export const messages = { ja, en };

type WidenStrings<T> = {
  readonly [K in keyof T]: T[K] extends string ? string : WidenStrings<T[K]>;
};

export type Messages = WidenStrings<typeof ja>;

export function getMessages(locale: Locale): Messages {
  return messages[locale];
}
