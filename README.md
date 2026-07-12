# TACOS PARAÍSO / タコパライソ

A small Next.js record site for Mexican taco restaurants. Public visitors can view visited restaurants and the places-to-try list; only pre-approved Supabase users with `editor` or `admin` roles can create, edit, delete, and upload photos.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Database, Authentication, Storage
- Vercel-ready configuration

## Environment Variables

Create `.env.local` from `.env.example`.

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Do not expose Supabase service-role keys in this app.

## Supabase Setup

1. Create a Supabase project.
2. Open the SQL editor.
3. Run all SQL in `supabase/schema.sql`.
4. Confirm that the public Storage bucket `restaurant-photos` exists.
5. In Authentication settings, keep public sign-up disabled for this app flow.

If the database already exists, run the same SQL again. It safely adds newer fields and the `places_to_try` table used by the wishlist.

## Create the First Posting User

1. In Supabase, go to Authentication > Users.
2. Create a user with email and password.
3. Go to Table Editor > `profiles`.
4. Find the created user's profile row.
5. Set `role` to `admin` or `editor`.
6. Optionally set `display_name`.

The app does not include a public registration page.

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. The root redirects to `/ja` by default. Use the header buttons to switch between `/ja` and `/en`; the selected locale is stored in a cookie.

## Vercel Deployment

1. Push the repository to GitHub.
2. Import it into Vercel as a Next.js project.
3. Add the two environment variables from `.env.example`.
4. Deploy.
5. After deployment, confirm `/ja`, `/en`, `/ja/restaurants`, `/en/restaurants`, `/ja/wishlist`, and `/en/wishlist`.

## Search Engine Blocking

The app sets:

- `robots` metadata with `noindex` and `nofollow`
- `X-Robots-Tag: noindex, nofollow` from middleware
- `public/robots.txt` with `Disallow: /`

This discourages indexing. It is not access control; anyone with the URL can view public pages.

## Checks

- `/ja` and `/en` render and keep the same page when switching languages.
- Public visitors can view the home page, restaurant list, details, and photos.
- Public visitors can view the places-to-try list.
- Public visitors cannot see create, edit, or delete controls.
- Login works only for Supabase-created users.
- Users with `viewer` role cannot create, edit, delete, or upload.
- Users with `editor` or `admin` role can create, edit, delete, and upload.
- Users with `editor` or `admin` role can manage the places-to-try list.
- Image upload rejects unsupported file types and files over 5 MB.
- Google Maps URL validation rejects invalid URLs.
- `robots.txt` is available and blocks crawling.

## Main Files

- `src/messages/ja.ts` and `src/messages/en.ts`: UI translations
- `src/config/site.ts`: editable site name and upload settings
- `src/lib/supabase/server.ts`: server-side Supabase client
- `src/app/[locale]/restaurants/actions.ts`: authenticated mutations
- `supabase/schema.sql`: database, RLS, and Storage policies
