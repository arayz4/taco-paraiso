import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale } from "@/i18n/settings";

export function GET(request: NextRequest) {
  const localeParam = request.nextUrl.searchParams.get("locale") ?? undefined;
  const nextParam = request.nextUrl.searchParams.get("next") || "/";
  const locale = isLocale(localeParam) ? localeParam : defaultLocale;
  const safeNext = nextParam.startsWith("/") && !nextParam.startsWith("//")
    ? nextParam
    : `/${locale}`;

  const response = NextResponse.redirect(new URL(safeNext, request.url));
  response.cookies.set("locale", locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return response;
}
