import { notFound, redirect } from "next/navigation";
import { createPlaceToTry } from "@/app/[locale]/wishlist/actions";
import { WishlistForm } from "@/components/wishlist-form";
import { isLocale, type Locale } from "@/i18n/settings";
import { getCurrentUserProfile } from "@/lib/auth";
import { getMessages } from "@/messages";

type Props = { params: Promise<{ locale: string }> };

export default async function NewWishlistPage({ params }: Props) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  const messages = getMessages(locale);
  const { user, canEdit } = await getCurrentUserProfile();

  if (!user) redirect(`/${locale}/login`);
  if (!canEdit) redirect(`/${locale}/wishlist`);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
      <h1 className="text-balance-mobile mb-6 text-3xl font-black text-[#2c1c25]">
        {messages.wishlist.createTitle}
      </h1>
      <WishlistForm
        locale={locale}
        messages={messages}
        action={createPlaceToTry.bind(null, locale)}
      />
    </div>
  );
}
