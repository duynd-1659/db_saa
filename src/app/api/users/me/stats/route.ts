import { NextResponse } from 'next/server';
import { fetchUserKudoStats } from '@/services/kudos-service';
import { createClient } from '@/libs/supabase/server';

export async function GET(): Promise<NextResponse> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const stats = await fetchUserKudoStats(user.id);

    return NextResponse.json(stats);
  } catch (err) {
    console.error('[GET /api/users/me/stats] Unexpected error', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
