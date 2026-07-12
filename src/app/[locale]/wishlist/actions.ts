"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Locale } from "@/i18n/settings";
import { getCurrentUserProfile } from "@/lib/auth";
import { placeToTrySchema } from "@/lib/validation";
import { getMessages } from "@/messages";

export type WishlistFormState = {
  ok: boolean;
  message?: string;
};

export async function createPlaceToTry(
  locale: Locale,
  _state: WishlistFormState,
  formData: FormData,
): Promise<WishlistFormState> {
  const result = await savePlaceToTry(locale, formData);
  if (!result.ok) return result;
  redirect(`/${locale}/wishlist`);
}

export async function updatePlaceToTry(
  locale: Locale,
  id: string,
  _state: WishlistFormState,
  formData: FormData,
): Promise<WishlistFormState> {
  const result = await savePlaceToTry(locale, formData, id);
  if (!result.ok) return result;
  redirect(`/${locale}/wishlist`);
}

export async function deletePlaceToTry(locale: Locale, id: string) {
  const messages = getMessages(locale);
  const { supabase, canEdit } = await getCurrentUserProfile();
  if (!supabase) return;
  if (!canEdit) throw new Error(messages.errors.forbidden);

  const { error } = await supabase.from("places_to_try").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath(`/${locale}/wishlist`);
  redirect(`/${locale}/wishlist`);
}

async function savePlaceToTry(locale: Locale, formData: FormData, id?: string) {
  const messages = getMessages(locale);
  const { supabase, user, canEdit } = await getCurrentUserProfile();

  if (!supabase) return { ok: false, message: messages.errors.missingConfig };
  if (!user) return { ok: false, message: messages.errors.unauthorized };
  if (!canEdit) return { ok: false, message: messages.errors.forbidden };

  const parsed = placeToTrySchema.safeParse({
    name: formData.get("name"),
    name_en: formData.get("name_en"),
    area: formData.get("area"),
    note: formData.get("note"),
    note_en: formData.get("note_en"),
    google_maps_url: formData.get("google_maps_url"),
  });

  if (!parsed.success) {
    const hasUrlError = parsed.error.issues.some((issue) => issue.message === "invalidUrl");
    return {
      ok: false,
      message: hasUrlError ? messages.errors.invalidUrl : messages.errors.generic,
    };
  }

  if (id) {
    const { error } = await supabase.from("places_to_try").update(parsed.data).eq("id", id);
    if (error) return { ok: false, message: error.message };
  } else {
    const { error } = await supabase
      .from("places_to_try")
      .insert({ ...parsed.data, created_by: user.id });
    if (error) return { ok: false, message: error.message };
  }

  revalidatePath(`/${locale}/wishlist`);
  return { ok: true };
}
