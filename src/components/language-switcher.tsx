"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale, withLocale } from "@/i18n/settings";
import type { Messages } from "@/messages";

type Props = {
  locale: Locale;
  messages: Messages;
};

export function LanguageSwitcher({ locale, messages }: Props) {
  const pathname = usePathname();

  return (
    <div className="flex shrink-0 rounded-full border border-white/30 bg-white/15 p-1 text-xs shadow-sm sm:text-sm">
      {locales.map((item) => {
        const nextPath = withLocale(pathname, item);
        const href = `/api/locale?locale=${item}&next=${encodeURIComponent(nextPath)}`;
        return (
          <Link
            key={item}
            href={href}
            className={`flex min-h-9 items-center rounded-full px-2.5 py-1.5 font-medium transition sm:min-h-0 sm:px-3 ${
              item === locale
                ? "bg-[#ffc83d] text-[#241326]"
                : "text-[#fff6df] hover:bg-white/15"
            }`}
          >
            {item === "ja"
              ? messages.common.languageJa
              : messages.common.languageEn}
          </Link>
        );
      })}
    </div>
  );
}
