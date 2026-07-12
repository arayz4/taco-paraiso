import Link from "next/link";
import Image from "next/image";
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
      <section className="relative isolate overflow-hidden rounded-[1.5rem] shadow-2xl shadow-[#6d3d2f]/15 sm:rounded-[2rem]">
        <Image
          src="/images/wishlist-hero.png"
          alt=""
          fill
          priority
          className="object-cover brightness-110 saturate-125"
          sizes="(max-width: 1024px) 100vw, 1024px"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(34,17,18,0.6),rgba(61,26,23,0.28)_46%,rgba(61,26,23,0.02)),linear-gradient(0deg,rgba(34,17,18,0.22),transparent_58%)]" />
        <div className="relative flex min-h-[22rem] flex-col justify-end px-6 py-8 sm:min-h-[27rem] sm:px-10 sm:py-10">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#f6bd45] text-[#2c1c25] shadow-lg shadow-black/15">
            <Sparkles size={21} aria-hidden="true" />
          </div>
          <p className="section-kicker text-xs font-black uppercase text-[#ffe7a8]">
            {messages.wishlist.kicker}
          </p>
          <h1 className="text-balance-mobile mt-3 max-w-2xl text-4xl font-black text-white drop-shadow-[0_4px_22px_rgba(25,12,10,0.45)] sm:text-6xl">
            {messages.wishlist.title}
          </h1>
          <p className="mt-3 max-w-xl text-base font-medium leading-7 text-[#fff7ec]">
            {messages.wishlist.description}
          </p>
          {canEdit ? (
            <Link
              href={`/${locale}/wishlist/new`}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#f6bd45] px-5 py-3 text-sm font-black text-[#2c1c25] shadow-lg shadow-black/20 transition hover:bg-[#ffd166] sm:w-fit"
            >
              <Plus size={17} aria-hidden="true" />
              {messages.common.newWishlist}
            </Link>
          ) : null}
        </div>
      </section>

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
