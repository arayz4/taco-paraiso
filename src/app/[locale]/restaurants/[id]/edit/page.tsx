import { notFound, redirect } from "next/navigation";
import { RestaurantForm } from "@/components/restaurant-form";
import { updateRestaurant } from "@/app/[locale]/restaurants/actions";
import { isLocale, type Locale } from "@/i18n/settings";
import { getCurrentUserProfile } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getMessages } from "@/messages";
import type { Restaurant } from "@/types/database";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function EditRestaurantPage({ params }: Props) {
  const { locale: rawLocale, id } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  const messages = getMessages(locale);
  const { user, canEdit } = await getCurrentUserProfile();

  if (!user) redirect(`/${locale}/login`);
  if (!canEdit) redirect(`/${locale}`);

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
    <div className="mx-auto max-w-2xl px-3 py-7 sm:px-4 sm:py-10">
      <h1 className="text-balance-mobile mb-6 text-3xl font-black text-[#241326]">
        {messages.form.editTitle}
      </h1>
      <RestaurantForm
        locale={locale}
        messages={messages}
        restaurant={restaurant}
        action={updateRestaurant.bind(null, locale, restaurant.id)}
      />
    </div>
  );
}
