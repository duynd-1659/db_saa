import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { fetchKudosFeed } from '@/services/kudos-service';
import { createKudo } from '@/services/kudo-write-service';
import { createClient } from '@/libs/supabase/server';

const querySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(50).optional().default(20),
  hashtag: z.string().optional(),
  dept: z.string().optional(),
});

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const parsed = querySchema.safeParse(searchParams);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid query parameters' }, { status: 400 });
    }

    const { page, limit, hashtag, dept } = parsed.data;

    // Get current user for liked_by_me
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const result = await fetchKudosFeed(
      { page, limit, hashtag_key: hashtag, department_name: dept },
      user?.id,
    );

    return NextResponse.json(result);
  } catch (err) {
    console.error('[GET /api/kudos] Unexpected error', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

const createKudoBodySchema = z.object({
  recipient_id: z.string().uuid(),
  title: z.string().min(1),
  content: z.string().min(1),
  hashtag_ids: z.array(z.string().uuid()).min(1).max(5),
  image_urls: z.array(z.string().url()).max(5).optional().default([]),
  is_anonymous: z.boolean().optional().default(false),
  anonymous_name: z.string().optional(),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = createKudoBodySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const result = await createKudo(parsed.data, user.id);
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    console.error('[POST /api/kudos] Unexpected error', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
