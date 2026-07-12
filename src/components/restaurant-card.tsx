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
    <article className="fiesta-card group overflow-hidden rounded-[1.25rem] transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Link href={`/${locale}/restaurants/${restaurant.id}`}>
        <div className="relative aspect-[4/3] overflow-hidden bg-[#fbe7b8]">
          {restaurant.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={restaurant.image_url}
              alt={restaurantName(restaurant, locale)}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.035]"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_28%_30%,#ffc83d_0_18%,transparent_19%),radial-gradient(circle_at_70%_62%,#ff5a72_0_15%,transparent_16%),linear-gradient(135deg,#ffe9a6,#bff2e7)] text-sm font-semibold text-[#6d3d2f]">
              {messages.common.noPhoto}
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#2c1c25]/30 to-transparent" />
          <div className="absolute left-4 top-4 rounded-full bg-[#fffaf3]/90 px-2.5 py-1 text-[11px] font-black tracking-wide text-[#9d433c] shadow-sm">
            TACOS
          </div>
        </div>
        <div className="space-y-3 p-5">
          <div>
            <h2 className="line-clamp-2 text-xl font-black text-[#2c1c25]">
              {restaurantName(restaurant, locale)}
            </h2>
            <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-[#9b5544]">
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
          <span className="inline-flex items-center border-b border-[#277c70]/30 pb-0.5 text-sm font-black text-[#277c70]">
            {messages.restaurants.detail}
          </span>
        </div>
      </Link>
    </article>
  );
}
