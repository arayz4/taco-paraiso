import Link from "next/link";
import { Edit, ExternalLink } from "lucide-react";
import { DeleteRestaurantButton } from "@/components/delete-restaurant-button";
import { Rating } from "@/components/rating";
import { SceneTags } from "@/components/scene-tags";
import { deleteRestaurant } from "@/app/[locale]/restaurants/actions";
import { isLocale, type Locale } from "@/i18n/settings";
import { getCurrentUserProfile } from "@/lib/auth";
import { formatDate, restaurantComment, restaurantName } from "@/lib/display";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getMessages } from "@/messages";
import type { Restaurant } from "@/types/database";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function RestaurantDetailPage({ params }: Props) {
  const { locale: rawLocale, id } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  const messages = getMessages(locale);
  const { canEdit } = await getCurrentUserProfile();
  const supabase = await createSupabaseServerClient();

  const { data: restaurant } = supabase
    ? await supabase
        .from("restaurants")
        .select("*, profiles(display_name)")
        .eq("id", id)
        .maybeSingle<Restaurant>()
    : { data: null };

  if (!restaurant) notFound();

  return (
    <div className="mx-auto max-w-4xl px-3 py-7 sm:px-4 sm:py-10">
      <div className="mb-5 flex flex-col gap-3 min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between">
        <Link
          href={`/${locale}/restaurants`}
          className="text-sm font-black text-[#0b8d88] hover:text-[#075f5b]"
        >
          {messages.common.back}
        </Link>
        {canEdit ? (
          <div className="grid grid-cols-2 gap-2 min-[420px]:flex">
            <Link
              href={`/${locale}/restaurants/${restaurant.id}/edit`}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#ffc83d]/50 bg-white px-4 py-2 text-sm font-black text-[#78313f] transition hover:bg-[#fff2b8]"
            >
              <Edit size={16} aria-hidden="true" />
              {messages.common.edit}
            </Link>
            <DeleteRestaurantButton
              action={deleteRestaurant.bind(null, locale, restaurant.id)}
              messages={messages}
            />
          </div>
        ) : null}
      </div>

      <article className="fiesta-card overflow-hidden rounded-lg">
        <div className="relative aspect-[4/3] bg-[#fbe7b8] sm:aspect-[16/9]">
          {restaurant.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={restaurant.image_url}
              alt={restaurantName(restaurant, locale)}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_28%_30%,#ffc83d_0_18%,transparent_19%),radial-gradient(circle_at_70%_62%,#ff5a72_0_15%,transparent_16%),linear-gradient(135deg,#ffe9a6,#bff2e7)] font-semibold text-[#6d3d2f]">
              {messages.common.noPhoto}
            </div>
          )}
          <div className="absolute left-4 top-4 h-10 w-10 rounded-full flower-dot" />
        </div>

        <div className="space-y-6 p-4 sm:space-y-7 sm:p-8">
          <div className="space-y-3">
            <h1 className="text-balance-mobile text-3xl font-black text-[#241326] sm:text-5xl">
              {restaurantName(restaurant, locale)}
            </h1>
            <p className="text-lg font-bold text-[#8c3a54]">{restaurant.area}</p>
            <Rating value={restaurant.rating} label={messages.restaurants.rating} />
            {restaurant.atmosphere_rating ? (
              <Rating
                value={restaurant.atmosphere_rating}
                label={messages.restaurants.atmosphereRating}
              />
            ) : null}
            <SceneTags tags={restaurant.scene_tags} messages={messages} />
          </div>

          <dl className="grid gap-4 sm:grid-cols-2 sm:gap-5">
            <Info label={messages.restaurants.tacoName} value={restaurant.taco_name} />
            {restaurant.atmosphere_rating ? (
              <Info
                label={messages.restaurants.atmosphereRating}
                value={`${restaurant.atmosphere_rating}/5`}
              />
            ) : null}
            <Info
              label={messages.restaurants.author}
              value={
                restaurant.profiles?.display_name ||
                messages.restaurants.fallbackAuthor
              }
            />
            <Info
              label={messages.restaurants.createdAt}
              value={formatDate(restaurant.created_at, locale)}
            />
            {restaurant.google_maps_url ? (
              <div>
                <dt className="text-sm font-bold text-stone-500">
                  {messages.restaurants.googleMaps}
                </dt>
                <dd className="mt-1">
                  <a
                    href={restaurant.google_maps_url}
                    target="_blank"
                    rel="noreferrer nofollow"
                  className="inline-flex items-center gap-2 font-black text-[#0b8d88] hover:text-[#075f5b]"
                  >
                    {messages.restaurants.googleMaps}
                    <ExternalLink size={16} aria-hidden="true" />
                  </a>
                </dd>
              </div>
            ) : null}
          </dl>

          <div>
            <h2 className="text-sm font-bold text-stone-500">
              {messages.restaurants.comment}
            </h2>
            <p className="mt-2 whitespace-pre-line text-lg leading-8 text-[#4b3443]">
              {restaurantComment(restaurant, locale)}
            </p>
          </div>
        </div>
      </article>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-sm font-black text-[#8c3a54]">{label}</dt>
      <dd className="mt-1 font-bold text-[#241326]">{value}</dd>
    </div>
  );
}
