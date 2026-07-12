import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { isLocale, type Locale } from "@/i18n/settings";
import { getCurrentUserProfile } from "@/lib/auth";
import { getMessages } from "@/messages";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    notFound();
  }

  const locale: Locale = rawLocale;
  const messages = getMessages(locale);
  const { profile, canEdit } = await getCurrentUserProfile();

  return (
    <>
      <Header
        locale={locale}
        messages={messages}
        profile={profile}
        canEdit={canEdit}
      />
      <main className="flex-1">{children}</main>
    </>
  );
}
