import Link from "next/link";
import { Plus, UserRound } from "lucide-react";
import { siteConfig } from "@/config/site";
import type { Locale } from "@/i18n/settings";
import type { Messages } from "@/messages";
import type { Profile } from "@/types/database";
import { LanguageSwitcher } from "@/components/language-switcher";
import { LogoutButton } from "@/components/logout-button";
import { logout } from "@/app/actions/auth";

type Props = {
  locale: Locale;
  messages: Messages;
  profile: Profile | null;
  canEdit: boolean;
};

export function Header({ locale, messages, profile, canEdit }: Props) {
  return (
    <header className="papel-edge sticky top-0 z-20 border-b border-[#4c245c]/20 bg-[#2a1740]/95 pt-2 text-white shadow-lg shadow-[#4c245c]/10 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4 sm:py-4">
        <div className="flex min-w-0 items-center justify-between gap-3">
          <Link href={`/${locale}`} className="group min-w-0">
            <span className="block max-w-[48vw] truncate text-lg font-black tracking-wide text-[#fff6df] drop-shadow-sm sm:max-w-none">
              {siteConfig.titles[locale]}
            </span>
            <span className="block h-1 w-20 rounded-full bg-[#ffc83d] transition group-hover:w-full" />
          </Link>
          <div className="sm:hidden">
            <LanguageSwitcher locale={locale} messages={messages} />
          </div>
        </div>
        <nav className="grid grid-cols-2 gap-2 min-[420px]:flex min-[420px]:flex-wrap min-[420px]:items-center">
          <Link
            href={`/${locale}/restaurants`}
            className="flex min-h-11 items-center justify-center rounded-full px-3 py-2 text-center text-sm font-semibold text-[#fff6df] transition hover:bg-white/10 sm:min-h-0 sm:px-4"
          >
            {messages.common.restaurants}
          </Link>
          {canEdit ? (
            <Link
              href={`/${locale}/restaurants/new`}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#ff5a72] px-3 py-2 text-sm font-semibold text-white shadow-sm shadow-[#ff5a72]/30 transition hover:bg-[#e94862] sm:min-h-0 sm:px-4"
            >
              <Plus size={16} aria-hidden="true" />
              {messages.common.newRestaurant}
            </Link>
          ) : null}
          {profile ? (
            <LogoutButton action={logout.bind(null, locale)} messages={messages} />
          ) : (
            <Link
              href={`/${locale}/login`}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-sm font-semibold text-[#fff6df] shadow-sm transition hover:bg-white/15 sm:min-h-0 sm:px-4"
            >
              <UserRound size={16} aria-hidden="true" />
              {messages.common.login}
            </Link>
          )}
          <div className="hidden sm:block">
            <LanguageSwitcher locale={locale} messages={messages} />
          </div>
        </nav>
      </div>
    </header>
  );
}
