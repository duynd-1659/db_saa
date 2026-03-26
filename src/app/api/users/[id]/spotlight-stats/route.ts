import { NextResponse } from 'next/server';
import { createClient } from '@/libs/supabase/server';
import { fetchSpotlightStats } from '@/services/kudos-service';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const stats = await fetchSpotlightStats(id);
    return NextResponse.json(stats);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
