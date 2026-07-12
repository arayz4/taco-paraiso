import { notFound, redirect } from "next/navigation";
import { updatePlaceToTry } from "@/app/[locale]/wishlist/actions";
import { WishlistForm } from "@/components/wishlist-form";
import { isLocale, type Locale } from "@/i18n/settings";
import { getCurrentUserProfile } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getMessages } from "@/messages";
import type { PlaceToTry } from "@/types/database";

type Props = { params: Promise<{ locale: string; id: string }> };

export default async function EditWishlistPage({ params }: Props) {
  const { locale: rawLocale, id } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  const messages = getMessages(locale);
  const { user, canEdit } = await getCurrentUserProfile();

  if (!user) redirect(`/${locale}/login`);
  if (!canEdit) redirect(`/${locale}/wishlist`);

  const supabase = await createSupabaseServerClient();
  const { data: place } = supabase
    ? await supabase.from("places_to_try").select("*").eq("id", id).maybeSingle<PlaceToTry>()
    : { data: null };
  if (!place) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
      <h1 className="text-balance-mobile mb-6 text-3xl font-black text-[#2c1c25]">
        {messages.wishlist.editTitle}
      </h1>
      <WishlistForm
        locale={locale}
        messages={messages}
        place={place}
        action={updatePlaceToTry.bind(null, locale, place.id)}
      />
    </div>
  );
}
