import { NextRequest, NextResponse } from 'next/server';
import { toggleKudoLike } from '@/services/kudos-service';
import { createClient } from '@/libs/supabase/server';

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: kudoId } = await params;

    const result = await toggleKudoLike(kudoId, user.id);

    return NextResponse.json(result);
  } catch (err) {
    console.error('[POST /api/kudos/:id/heart] Unexpected error', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
