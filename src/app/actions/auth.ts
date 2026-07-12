"use server";

import { redirect } from "next/navigation";
import type { Locale } from "@/i18n/settings";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function logout(locale: Locale) {
  const supabase = await createSupabaseServerClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
  redirect(`/${locale}`);
}
