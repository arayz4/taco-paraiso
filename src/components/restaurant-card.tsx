import Link from "next/link";
import { MapPin } from "lucide-react";
import type { Locale } from "@/i18n/settings";
import type { Messages } from "@/messages";
import type { Restaurant } from "@/types/database";
import { restaurantComment, restaurantName } from "@/lib/display";
import { Rating } from "@/components/rating";
import { SceneTags } from "@/components/scene-tags";

type Props = {
  restaurant: Restaurant;
  locale: Locale;
  messages: Messages;
};

export function RestaurantCard({ restaurant, locale, messages }: Props) {
  return (
    <article className="fiesta-card group overflow-hidden rounded-lg transition hover:-translate-y-1 hover:shadow-xl">
      <Link href={`/${locale}/restaurants/${restaurant.id}`}>
        <div className="relative aspect-[4/3] bg-[#fbe7b8]">
          {restaurant.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={restaurant.image_url}
              alt={restaurantName(restaurant, locale)}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_28%_30%,#ffc83d_0_18%,transparent_19%),radial-gradient(circle_at_70%_62%,#ff5a72_0_15%,transparent_16%),linear-gradient(135deg,#ffe9a6,#bff2e7)] text-sm font-semibold text-[#6d3d2f]">
              {messages.common.noPhoto}
            </div>
          )}
          <div className="absolute left-3 top-3 h-8 w-8 rounded-full flower-dot opacity-95" />
        </div>
        <div className="space-y-3 p-4">
          <div>
            <h2 className="line-clamp-2 text-xl font-black text-[#241326]">
              {restaurantName(restaurant, locale)}
            </h2>
            <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-[#8c3a54]">
              <MapPin size={15} aria-hidden="true" />
              {restaurant.area}
            </p>
          </div>
          <Rating value={restaurant.rating} label={messages.restaurants.rating} />
          {restaurant.atmosphere_rating ? (
            <Rating
              value={restaurant.atmosphere_rating}
              label={messages.restaurants.atmosphereRating}
            />
          ) : null}
          <SceneTags tags={restaurant.scene_tags} messages={messages} />
          <p className="line-clamp-3 text-sm leading-6 text-[#4b3443]">
            {restaurantComment(restaurant, locale)}
          </p>
          <span className="text-sm font-black text-[#0b8d88]">
            {messages.restaurants.detail}
          </span>
        </div>
      </Link>
    </article>
  );
}
