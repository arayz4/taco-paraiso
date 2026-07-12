import { z } from "zod";

export const sceneTagKeys = [
  "date",
  "friends",
  "solo",
  "family",
  "quick",
] as const;

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .transform((value) => value || null)
  .refine((value) => !value || URL.canParse(value), "invalidUrl");

export const restaurantSchema = z.object({
  name: z.string().trim().min(1).max(120),
  name_en: z
    .string()
    .trim()
    .optional()
    .transform((value) => value || null),
  area: z.string().trim().min(1).max(120),
  taco_name: z.string().trim().min(1).max(120),
  rating: z.coerce.number().int().min(1).max(5),
  atmosphere_rating: z.coerce.number().int().min(1).max(5).optional(),
  scene_tags: z
    .array(z.enum(sceneTagKeys))
    .max(5)
    .optional()
    .default([]),
  comment: z.string().trim().min(1).max(1000),
  comment_en: z
    .string()
    .trim()
    .optional()
    .transform((value) => value || null),
  google_maps_url: optionalUrl,
});

export type RestaurantFormValues = z.infer<typeof restaurantSchema>;

export const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];
