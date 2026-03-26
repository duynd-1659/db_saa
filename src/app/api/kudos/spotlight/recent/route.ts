import { NextResponse } from 'next/server';
import { fetchRecentSpotlightKudos } from '@/services/kudos-service';

export async function GET(): Promise<NextResponse> {
  try {
    const data = await fetchRecentSpotlightKudos(7);
    return NextResponse.json(data);
  } catch (err) {
    console.error('[GET /api/kudos/spotlight/recent] Unexpected error', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
