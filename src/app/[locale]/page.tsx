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
    <div className="mx-auto max-w-5xl px-3 py-7 sm:px-4 sm:py-14">
      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="space-y-5">
          <div className="inline-flex rounded-full border border-[#ffc83d]/70 bg-[#fff2b8] px-3 py-1 text-sm font-black text-[#78313f] shadow-sm">
            {messages.home.badge}
          </div>
          <div className="space-y-4">
            <h1 className="text-balance-mobile max-w-2xl text-4xl font-black tracking-tight text-[#241326] drop-shadow-sm sm:text-7xl">
              {siteConfig.titles[locale]}
            </h1>
            <p className="max-w-xl text-base font-medium leading-7 text-[#56384f] sm:text-lg sm:leading-8">
              {messages.home.description}
            </p>
          </div>
          <div className="flex flex-col gap-3 min-[420px]:flex-row">
            <Link
              href={`/${locale}/restaurants`}
              className="rounded-full bg-[#0b8d88] px-5 py-3 text-center text-sm font-black text-white shadow-lg shadow-[#0b8d88]/25 transition hover:bg-[#08736f]"
            >
              {messages.home.viewAll}
            </Link>
            {canEdit ? (
              <Link
                href={`/${locale}/restaurants/new`}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#ff5a72]/25 bg-white px-5 py-3 text-sm font-black text-[#8c3a54] shadow-sm transition hover:bg-[#fff1f3]"
              >
                <Plus size={16} aria-hidden="true" />
                {messages.common.newRestaurant}
              </Link>
            ) : null}
          </div>
        </div>
        <div className="relative min-h-64 overflow-hidden rounded-lg border-2 border-[#241326]/10 bg-[#2a1740] p-4 shadow-2xl shadow-[#4c245c]/20 sm:min-h-72 sm:p-6">
          <div className="absolute -right-12 -top-10 h-40 w-40 rounded-full bg-[#ffc83d]" />
          <div className="absolute bottom-6 right-10 h-24 w-24 rounded-full bg-[#ff5a72]" />
          <div className="absolute left-7 top-8 h-16 w-16 rounded-full flower-dot" />
          <div className="absolute inset-x-0 top-0 h-7 bg-[linear-gradient(90deg,#ff5a72_0_16.66%,#ffc83d_16.66%_33.33%,#12a6a2_33.33%_50%,#7b3fb5_50%_66.66%,#f36a2d_66.66%_83.33%,#21b574_83.33%_100%)]" />
          <div className="relative flex h-full min-h-56 flex-col justify-end rounded-lg border border-white/20 bg-white/10 p-4 backdrop-blur-sm sm:min-h-64 sm:p-5">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#ffc83d] sm:text-sm sm:tracking-[0.2em]">
              Al pastor / Carnitas / Barbacoa
            </p>
            <p className="mt-3 max-w-sm text-2xl font-black text-[#fff6df] sm:text-3xl">
              {messages.home.heroNote}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-10 space-y-5 sm:mt-14">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-2xl font-black text-[#241326]">
            {messages.home.recent}
          </h2>
          <Link
            href={`/${locale}/restaurants`}
            className="text-sm font-black text-[#0b8d88] hover:text-[#075f5b]"
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
          <p className="fiesta-card rounded-lg p-6 font-semibold text-[#56384f]">
            {messages.home.empty}
          </p>
        )}
      </section>
    </div>
  );
}
