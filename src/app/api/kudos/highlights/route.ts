import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { fetchHighlightKudos } from '@/services/kudos-service';
import { createClient } from '@/libs/supabase/server';

const querySchema = z.object({
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

    const { hashtag, dept } = parsed.data;

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const highlights = await fetchHighlightKudos(
      { hashtag_key: hashtag, department_name: dept },
      user?.id,
    );

    return NextResponse.json(highlights);
  } catch (err) {
    console.error('[GET /api/kudos/highlights] Unexpected error', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
