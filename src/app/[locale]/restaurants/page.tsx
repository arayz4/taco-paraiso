import Link from "next/link";
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="section-kicker text-xs font-black uppercase text-[#9d433c]">Taco log</p>
          <h1 className="mt-2 text-3xl font-black text-[#2c1c25] sm:text-4xl">
            {messages.restaurants.title}
          </h1>
          <div className="mt-4 flex flex-wrap gap-2">
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
        </div>
        {canEdit ? (
          <Link
            href={`/${locale}/restaurants/new`}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#e35f50] px-5 py-3 text-sm font-black text-white shadow-lg shadow-[#e35f50]/25 transition hover:bg-[#c94d41] sm:w-auto"
          >
            <Plus size={16} aria-hidden="true" />
            {messages.common.newRestaurant}
          </Link>
        ) : null}
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
