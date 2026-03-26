import { NextResponse } from 'next/server';
import { fetchHashtags } from '@/services/hashtag-service';

export async function GET(): Promise<NextResponse> {
  try {
    const hashtags = await fetchHashtags();
    return NextResponse.json(hashtags);
  } catch (err) {
    console.error('[GET /api/hashtags] Unexpected error', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
