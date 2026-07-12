import Link from "next/link";
import { Plus } from "lucide-react";
import { RestaurantCard } from "@/components/restaurant-card";
import { siteConfig } from "@/config/site";
import { isLocale, type Locale } from "@/i18n/settings";
import { getCurrentUserProfile } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getMessages } from "@/messages";
import type { Restaurant } from "@/types/database";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  const messages = getMessages(locale);
  const { canEdit } = await getCurrentUserProfile();
  const supabase = await createSupabaseServerClient();

  const restaurants = supabase
    ? await supabase
        .from("restaurants")
        .select("*, profiles(display_name)")
        .order("created_at", { ascending: false })
        .limit(3)
        .returns<Restaurant[]>()
    : { data: [] as Restaurant[] };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
      <section className="hero-photo relative isolate overflow-hidden rounded-[1.5rem] sm:rounded-[2rem]">
        <div className="hero-photo-overlay absolute inset-0" />
        <div className="relative flex min-h-[30rem] max-w-xl flex-col justify-end px-6 py-8 sm:min-h-[36rem] sm:px-10 sm:py-12 lg:min-h-[38rem] lg:px-14 lg:py-16">
          <div className="space-y-6">
            <div className="section-kicker inline-flex border-b-2 border-[#f6bd45] pb-1 text-xs font-black uppercase text-[#fff5df]">
            {messages.home.badge}
            </div>
            <div className="space-y-4">
              <h1 className="text-balance-mobile max-w-2xl text-5xl font-black tracking-tight text-white drop-shadow-[0_4px_22px_rgba(25,12,10,0.45)] sm:text-7xl">
              {siteConfig.titles[locale]}
              </h1>
              <p className="max-w-xl text-base font-medium leading-7 text-[#fff7ec] sm:text-lg sm:leading-8">
              {messages.home.description}
              </p>
            </div>
            <div className="flex flex-col gap-3 min-[420px]:flex-row">
              <Link
                href={`/${locale}/restaurants`}
                className="rounded-full bg-[#f6bd45] px-5 py-3 text-center text-sm font-black text-[#2c1c25] shadow-lg shadow-black/20 transition hover:bg-[#ffd166]"
              >
                {messages.home.viewAll}
              </Link>
              {canEdit ? (
                <Link
                  href={`/${locale}/restaurants/new`}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/15 px-5 py-3 text-sm font-black text-white shadow-sm backdrop-blur-sm transition hover:bg-white/25"
                >
                  <Plus size={16} aria-hidden="true" />
                  {messages.common.newRestaurant}
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6">
        <Link
          href={`/${locale}/members`}
          className="group flex flex-col gap-2 border-y border-[#3c2b2b]/10 py-4 text-[#3c2b2b] transition hover:border-[#277c70]/40 sm:flex-row sm:items-center sm:justify-between"
        >
          <span className="text-sm font-semibold text-[#654843]">{messages.home.membersText}</span>
          <span className="section-kicker text-xs font-black uppercase text-[#277c70] transition group-hover:text-[#1d665c]">
            {messages.home.membersLink}
          </span>
        </Link>
      </section>

      <section className="mt-14 space-y-6 sm:mt-20">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-2xl font-black text-[#2c1c25]">
            {messages.home.recent}
          </h2>
          <Link
            href={`/${locale}/restaurants`}
            className="text-sm font-black text-[#277c70] hover:text-[#1d665c]"
          >
            {messages.home.viewAll}
          </Link>
        </div>
        {restaurants.data && restaurants.data.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {restaurants.data.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                locale={locale}
                messages={messages}
              />
            ))}
          </div>
        ) : (
          <p className="fiesta-card rounded-[1rem] p-6 font-semibold text-[#654843]">
            {messages.home.empty}
          </p>
        )}
      </section>
    </div>
  );
}
