import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { searchProfiles } from '@/services/profile-service';

const querySchema = z.object({
  q: z.string().min(2),
});

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const parsed = querySchema.safeParse(searchParams);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Query must be at least 2 characters' }, { status: 400 });
    }

    const results = await searchProfiles(parsed.data.q);
    return NextResponse.json(results);
  } catch (err) {
    console.error('[GET /api/profiles/search] Unexpected error', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
