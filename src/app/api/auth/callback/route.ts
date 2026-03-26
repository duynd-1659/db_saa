import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/vi';

  const safeNext = next.startsWith('/') && !next.startsWith('//') ? next : '/vi';

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=auth_failed', request.url));
  }

  const cookieStore = await cookies();
  const pendingCookies: Array<{ name: string; value: string; options: object }> = [];

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          pendingCookies.push(...cookiesToSet);
        },
      },
    },
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  console.log('OAuth callback received code:', code);

  if (error) {
    console.log('OAuth callback error:', error);
    return NextResponse.redirect(new URL('/login?error=auth_failed', 'https://db-saa.vercel.app'));
  }

  console.log(
    'OAuth callback successful, session established.',
    request.nextUrl.origin,
    request.url,
  );
  const response = NextResponse.redirect(new URL(safeNext, 'https://db-saa.vercel.app'));
  pendingCookies.forEach(({ name, value, options }) =>
    response.cookies.set(name, value, options as Parameters<typeof response.cookies.set>[2]),
  );
  return response;
}
