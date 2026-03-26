import { NextResponse } from 'next/server';
import { fetchSpotlightData } from '@/services/kudos-service';

export async function GET(): Promise<NextResponse> {
  try {
    const data = await fetchSpotlightData();
    return NextResponse.json(data);
  } catch (err) {
    console.error('[GET /api/kudos/spotlight] Unexpected error', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
