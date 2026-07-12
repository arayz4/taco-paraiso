import Link from "next/link";
import { ExternalLink, MapPin, Pencil, Plus, Sparkles } from "lucide-react";
import { DeleteWishlistButton } from "@/components/delete-wishlist-button";
import { isLocale, type Locale } from "@/i18n/settings";
import { getCurrentUserProfile } from "@/lib/auth";
import { placeToTryName, placeToTryNote } from "@/lib/display";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getMessages } from "@/messages";
import type { PlaceToTry } from "@/types/database";
import { deletePlaceToTry } from "@/app/[locale]/wishlist/actions";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ locale: string }> };

export default async function WishlistPage({ params }: Props) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  const messages = getMessages(locale);
  const { canEdit } = await getCurrentUserProfile();
  const supabase = await createSupabaseServerClient();

  const places = supabase
    ? await supabase
        .from("places_to_try")
        .select("*")
        .order("created_at", { ascending: false })
        .returns<PlaceToTry[]>()
    : { data: [] as PlaceToTry[] };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-14">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#f6bd45] text-[#2c1c25]">
            <Sparkles size={21} aria-hidden="true" />
          </div>
          <h1 className="text-balance-mobile text-3xl font-black text-[#2c1c25] sm:text-5xl">
            {messages.wishlist.title}
          </h1>
          <p className="mt-3 leading-7 text-[#654843]">{messages.wishlist.description}</p>
        </div>
        {canEdit ? (
          <Link
            href={`/${locale}/wishlist/new`}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#e35f50] px-5 py-3 text-sm font-black text-white shadow-lg shadow-[#e35f50]/20 transition hover:bg-[#c94d41] sm:w-auto"
          >
            <Plus size={17} aria-hidden="true" />
            {messages.common.newWishlist}
          </Link>
        ) : null}
      </div>

      {places.data && places.data.length > 0 ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {places.data.map((place, index) => {
            const note = placeToTryNote(place, locale);
            return (
              <article key={place.id} className="fiesta-card relative overflow-hidden rounded-[1.25rem] p-5 sm:p-6">
                <span className="absolute right-5 top-4 text-4xl font-black text-[#e35f50]/10">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="relative pr-12">
                  <h2 className="text-xl font-black text-[#2c1c25]">{placeToTryName(place, locale)}</h2>
                  <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-[#9b5544]">
                    <MapPin size={15} aria-hidden="true" />
                    {place.area}
                  </p>
                </div>
                {note ? <p className="mt-4 leading-7 text-[#654843]">{note}</p> : null}
                <div className="mt-5 flex flex-wrap items-center gap-2">
                  {place.google_maps_url ? (
                    <a
                      href={place.google_maps_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[#277c70] px-4 py-2 text-sm font-black text-white transition hover:bg-[#1d665c]"
                    >
                      <ExternalLink size={15} aria-hidden="true" />
                      {messages.wishlist.openMap}
                    </a>
                  ) : null}
                  {canEdit ? (
                    <>
                      <Link
                        href={`/${locale}/wishlist/${place.id}/edit`}
                        title={messages.common.edit}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#3c2b2b]/15 bg-white text-[#654843] transition hover:bg-[#fff2e8]"
                      >
                        <Pencil size={16} aria-hidden="true" />
                        <span className="sr-only">{messages.common.edit}</span>
                      </Link>
                      <DeleteWishlistButton
                        action={deletePlaceToTry.bind(null, locale, place.id)}
                        messages={messages}
                      />
                    </>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <p className="fiesta-card mt-8 rounded-[1.25rem] p-6 font-semibold text-[#654843]">
          {messages.wishlist.empty}
        </p>
      )}
    </div>
  );
}
