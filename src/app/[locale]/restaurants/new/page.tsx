import { redirect, notFound } from "next/navigation";
import { RestaurantForm } from "@/components/restaurant-form";
import { createRestaurant } from "@/app/[locale]/restaurants/actions";
import { isLocale, type Locale } from "@/i18n/settings";
import { getCurrentUserProfile } from "@/lib/auth";
import { getMessages } from "@/messages";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function NewRestaurantPage({ params }: Props) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  const messages = getMessages(locale);
  const { user, canEdit } = await getCurrentUserProfile();

  if (!user) redirect(`/${locale}/login`);
  if (!canEdit) redirect(`/${locale}`);

  return (
    <div className="mx-auto max-w-2xl px-3 py-7 sm:px-4 sm:py-10">
      <h1 className="text-balance-mobile mb-6 text-3xl font-black text-[#241326]">
        {messages.form.createTitle}
      </h1>
      <RestaurantForm
        locale={locale}
        messages={messages}
        action={createRestaurant.bind(null, locale)}
      />
    </div>
  );
}
