import { NextResponse } from 'next/server';
import { z } from 'zod';
import { fetchEventConfig } from '@/services/homepage-service';

const eventConfigSchema = z.object({
  event_start_datetime: z.string().datetime({ offset: true }),
});

export async function GET(): Promise<NextResponse> {
  try {
    const config = await fetchEventConfig();

    const parsed = eventConfigSchema.safeParse({
      event_start_datetime: config.event_start_datetime,
    });

    if (!parsed.success) {
      console.error('[GET /api/config/event] Invalid event config', parsed.error);
      return NextResponse.json({ error: 'Event configuration unavailable' }, { status: 500 });
    }

    return NextResponse.json(parsed.data);
  } catch (err) {
    console.error('[GET /api/config/event] Unexpected error', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
