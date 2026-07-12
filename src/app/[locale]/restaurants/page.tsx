import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { RestaurantCard } from "@/components/restaurant-card";
import { isLocale, type Locale } from "@/i18n/settings";
import { getCurrentUserProfile } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getMessages } from "@/messages";
import type { Restaurant } from "@/types/database";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ sort?: string }>;
};

export default async function RestaurantsPage({ params, searchParams }: Props) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  const { sort } = await searchParams;
  const messages = getMessages(locale);
  const { canEdit } = await getCurrentUserProfile();
  const supabase = await createSupabaseServerClient();
  const orderColumn = sort === "rating" ? "rating" : "created_at";

  const restaurants = supabase
    ? await supabase
        .from("restaurants")
        .select("*, profiles(display_name)")
        .order(orderColumn, { ascending: false })
        .order("created_at", { ascending: false })
        .returns<Restaurant[]>()
    : { data: [] as Restaurant[] };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-14">
      <section className="relative isolate overflow-hidden rounded-[1.5rem] shadow-2xl shadow-[#6d3d2f]/15 sm:rounded-[2rem]">
        <Image
          src="/images/taco-log-hero.png"
          alt=""
          fill
          priority
          className="object-cover brightness-110 saturate-125"
          sizes="(max-width: 1024px) 100vw, 1024px"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(34,17,18,0.62),rgba(61,26,23,0.32)_46%,rgba(61,26,23,0.02)),linear-gradient(0deg,rgba(34,17,18,0.24),transparent_58%)]" />
        <div className="relative flex min-h-[22rem] flex-col justify-end px-6 py-8 sm:min-h-[27rem] sm:px-10 sm:py-10">
          <p className="section-kicker text-xs font-black uppercase text-[#ffe7a8]">
            {messages.restaurants.kicker}
          </p>
          <h1 className="text-balance-mobile mt-3 max-w-2xl text-4xl font-black text-white drop-shadow-[0_4px_22px_rgba(25,12,10,0.45)] sm:text-6xl">
            {messages.restaurants.title}
          </h1>
          {canEdit ? (
            <Link
              href={`/${locale}/restaurants/new`}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#f6bd45] px-5 py-3 text-sm font-black text-[#2c1c25] shadow-lg shadow-black/20 transition hover:bg-[#ffd166] sm:w-fit"
            >
              <Plus size={16} aria-hidden="true" />
              {messages.common.newRestaurant}
            </Link>
          ) : null}
        </div>
      </section>

      <div className="mt-6 flex flex-wrap gap-2">
        <SortLink locale={locale} active={sort !== "rating"} href={`/${locale}/restaurants`}>
          {messages.restaurants.sortNewest}
        </SortLink>
        <SortLink
          locale={locale}
          active={sort === "rating"}
          href={`/${locale}/restaurants?sort=rating`}
        >
          {messages.restaurants.sortRating}
        </SortLink>
      </div>

      {restaurants.data && restaurants.data.length > 0 ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
        <p className="fiesta-card mt-6 rounded-[1rem] p-6 font-semibold text-[#654843]">
          {messages.restaurants.empty}
        </p>
      )}
    </div>
  );
}

function SortLink({
  href,
  active,
  children,
}: {
  locale: Locale;
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full px-4 py-2 text-sm font-bold transition ${
        active
          ? "bg-[#277c70] text-white shadow-md shadow-[#277c70]/20"
          : "border border-[#3c2b2b]/10 bg-white/75 text-[#654843] hover:bg-[#fff2e8]"
      }`}
    >
      {children}
    </Link>
  );
}
