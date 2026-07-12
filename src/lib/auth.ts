import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/database";

export async function getCurrentUserProfile() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { supabase: null, user: null, profile: null, canEdit: false };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { supabase, user: null, profile: null, canEdit: false };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, display_name, role, created_at")
    .eq("id", user.id)
    .maybeSingle<Profile>();

  const canEdit = profile?.role === "editor" || profile?.role === "admin";
  return { supabase, user, profile, canEdit };
}
