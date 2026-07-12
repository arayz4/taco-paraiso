"use server";

import { redirect } from "next/navigation";
import type { Locale } from "@/i18n/settings";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getMessages } from "@/messages";

export type LoginState = {
  ok: boolean;
  message?: string;
};

export async function login(
  locale: Locale,
  _state: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const messages = getMessages(locale);
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { ok: false, message: messages.errors.missingConfig };

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { ok: false, message: messages.errors.invalidLogin };
  }

  redirect(`/${locale}`);
}
