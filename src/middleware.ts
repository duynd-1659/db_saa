import createIntlMiddleware from 'next-intl/middleware';
import { type NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';
import { createClient } from './libs/supabase/middleware';

const handleI18n = createIntlMiddleware(routing);

/** Paths that are accessible without authentication */
const AUTH_PATHS = ['/login'];
const PUBLIC_API_PREFIXES = ['/api/auth/'];

function isAuthPath(pathname: string): boolean {
  return AUTH_PATHS.some(
    (p) => pathname === p || routing.locales.some((locale) => pathname === `/${locale}${p}`),
  );
}

function isPublicPath(pathname: string): boolean {
  return isAuthPath(pathname) || PUBLIC_API_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // ✅ QUAN TRỌNG: skip API trước
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  const { supabase, supabaseResponse } = createClient(request);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  function withSessionCookies(response: NextResponse): NextResponse {
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      response.cookies.set(cookie.name, cookie.value, { path: '/' });
    });
    return response;
  }

  if (!isPublicPath(pathname) && !user) {
    const loginUrl = new URL('/login', request.url);
    return withSessionCookies(NextResponse.redirect(loginUrl));
  }

  if (isAuthPath(pathname) && user) {
    const locale =
      routing.locales.find((l) => pathname.startsWith(`/${l}/`) || pathname === `/${l}`) ??
      routing.defaultLocale;

    return withSessionCookies(NextResponse.redirect(new URL(`/${locale}`, request.url)));
  }

  return withSessionCookies(handleI18n(request));
}

export const config = {
  matcher: [
    // Skip Next.js internals, static files, and image assets
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
