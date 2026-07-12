"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { siteConfig } from "@/config/site";
import type { Locale } from "@/i18n/settings";
import { getCurrentUserProfile } from "@/lib/auth";
import { allowedImageTypes, restaurantSchema } from "@/lib/validation";
import { getMessages } from "@/messages";

export type FormState = {
  ok: boolean;
  message?: string;
};

export async function createRestaurant(
  locale: Locale,
  _state: FormState,
  formData: FormData,
): Promise<FormState> {
  const result = await saveRestaurant(locale, formData);
  if (!result.ok) return result;
  redirect(`/${locale}/restaurants/${result.id}`);
}

export async function updateRestaurant(
  locale: Locale,
  id: string,
  _state: FormState,
  formData: FormData,
): Promise<FormState> {
  const result = await saveRestaurant(locale, formData, id);
  if (!result.ok) return result;
  redirect(`/${locale}/restaurants/${id}`);
}

export async function deleteRestaurant(locale: Locale, id: string) {
  const messages = getMessages(locale);
  const { supabase, canEdit } = await getCurrentUserProfile();
  if (!supabase) return;
  if (!canEdit) throw new Error(messages.errors.forbidden);

  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("image_url")
    .eq("id", id)
    .maybeSingle<{ image_url: string | null }>();

  await supabase.from("restaurants").delete().eq("id", id);

  const storagePath = getStoragePath(restaurant?.image_url);
  if (storagePath) {
    await supabase.storage.from(siteConfig.photoBucket).remove([storagePath]);
  }

  revalidatePath(`/${locale}`);
  revalidatePath(`/${locale}/restaurants`);
  redirect(`/${locale}/restaurants`);
}

async function saveRestaurant(locale: Locale, formData: FormData, id?: string) {
  const messages = getMessages(locale);
  const { supabase, user, canEdit } = await getCurrentUserProfile();

  if (!supabase) return { ok: false, message: messages.errors.missingConfig };
  if (!user) return { ok: false, message: messages.errors.unauthorized };
  if (!canEdit) return { ok: false, message: messages.errors.forbidden };

  const parsed = restaurantSchema.safeParse({
    name: formData.get("name"),
    name_en: formData.get("name_en"),
    area: formData.get("area"),
    taco_name: formData.get("taco_name"),
    rating: formData.get("rating"),
    atmosphere_rating: formData.get("atmosphere_rating"),
    scene_tags: formData.getAll("scene_tags"),
    comment: formData.get("comment"),
    comment_en: formData.get("comment_en"),
    google_maps_url: formData.get("google_maps_url"),
  });

  if (!parsed.success) {
    const hasUrlError = parsed.error.issues.some(
      (issue) => issue.message === "invalidUrl",
    );
    return {
      ok: false,
      message: hasUrlError ? messages.errors.invalidUrl : messages.errors.generic,
    };
  }

  const photo = formData.get("photo");
  let imageUrl: string | null | undefined;

  if (photo instanceof File && photo.size > 0) {
    if (!allowedImageTypes.includes(photo.type)) {
      return { ok: false, message: messages.errors.invalidImage };
    }
    if (photo.size > siteConfig.maxImageSizeMb * 1024 * 1024) {
      return { ok: false, message: messages.errors.imageTooLarge };
    }

    const extension = photo.type.split("/")[1]?.replace("jpeg", "jpg") ?? "jpg";
    const path = `${user.id}/${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await supabase.storage
      .from(siteConfig.photoBucket)
      .upload(path, photo, { contentType: photo.type, upsert: false });

    if (uploadError) {
      return { ok: false, message: uploadError.message };
    }

    const { data } = supabase.storage
      .from(siteConfig.photoBucket)
      .getPublicUrl(path);
    imageUrl = data.publicUrl;
  }

  const payload = {
    ...parsed.data,
    ...(imageUrl ? { image_url: imageUrl } : {}),
  };

  if (id) {
    const { error } = await supabase
      .from("restaurants")
      .update(payload)
      .eq("id", id);
    if (error) return { ok: false, message: error.message };
  } else {
    const { data, error } = await supabase
      .from("restaurants")
      .insert({ ...payload, created_by: user.id })
      .select("id")
      .single<{ id: string }>();
    if (error) return { ok: false, message: error.message };
    id = data.id;
  }

  revalidatePath(`/${locale}`);
  revalidatePath(`/${locale}/restaurants`);
  return { ok: true, id };
}

function getStoragePath(publicUrl?: string | null) {
  if (!publicUrl) return null;
  const marker = `/storage/v1/object/public/${siteConfig.photoBucket}/`;
  const index = publicUrl.indexOf(marker);
  if (index === -1) return null;
  return decodeURIComponent(publicUrl.slice(index + marker.length));
}
