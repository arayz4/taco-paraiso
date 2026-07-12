export type Role = "viewer" | "editor" | "admin";

export type Profile = {
  id: string;
  display_name: string | null;
  role: Role;
  created_at: string;
};

export type Restaurant = {
  id: string;
  name: string;
  name_en: string | null;
  area: string;
  taco_name: string;
  rating: number;
  atmosphere_rating: number | null;
  scene_tags: string[] | null;
  comment: string;
  comment_en: string | null;
  google_maps_url: string | null;
  image_url: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  profiles?: Pick<Profile, "display_name"> | null;
};

export type RestaurantInput = {
  name: string;
  name_en?: string | null;
  area: string;
  taco_name: string;
  rating: number;
  atmosphere_rating?: number | null;
  scene_tags?: string[] | null;
  comment: string;
  comment_en?: string | null;
  google_maps_url?: string | null;
  image_url?: string | null;
};

export type PlaceToTry = {
  id: string;
  name: string;
  name_en: string | null;
  area: string;
  note: string | null;
  note_en: string | null;
  google_maps_url: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
};
