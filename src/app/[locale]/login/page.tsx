import { notFound, redirect } from "next/navigation";
import { LoginForm } from "@/components/login-form";
import { login } from "@/app/[locale]/login/actions";
import { isLocale, type Locale } from "@/i18n/settings";
import { getCurrentUserProfile } from "@/lib/auth";
import { getMessages } from "@/messages";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function LoginPage({ params }: Props) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  const messages = getMessages(locale);
  const { user } = await getCurrentUserProfile();

  if (user) redirect(`/${locale}`);

  return (
    <div className="mx-auto max-w-md px-3 py-8 sm:px-4 sm:py-10">
      <h1 className="mb-6 text-3xl font-black text-[#241326]">
        {messages.auth.title}
      </h1>
      <LoginForm
        locale={locale}
        messages={messages}
        action={login.bind(null, locale)}
      />
    </div>
  );
}
