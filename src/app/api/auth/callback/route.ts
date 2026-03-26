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
  const cookiesBeforeExchange = cookieStore.getAll().map((c) => c.name);

  const setCookiesLog: string[] = [];

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          setCookiesLog.push(...cookiesToSet.map((c) => c.name));
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        },
      },
    },
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(new URL('/login?error=auth_failed', request.url));
  }

  return NextResponse.redirect(new URL(safeNext, request.url));
}
