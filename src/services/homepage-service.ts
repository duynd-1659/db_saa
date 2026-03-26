import { unstable_noStore as noStore } from 'next/cache';
import { createClient } from '@/libs/supabase/server';
import type { EventConfig } from '@/types/homepage';

export interface UserProfile {
  avatarUrl: string | null;
  fullName: string | null;
  isAdmin: boolean;
}

export async function fetchUserProfile(): Promise<UserProfile> {
  noStore();
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { avatarUrl: null, fullName: null, isAdmin: false };

    const { data } = await supabase
      .from('profiles')
      .select('avatar_url, full_name, role')
      .eq('id', user.id)
      .single();

    return {
      // Prefer the avatar URL from the current auth session (always fresh after
      // each login/token refresh) over the value stored in profiles, which was
      // only written at initial sign-up and may have expired.
      avatarUrl: (user.user_metadata?.avatar_url as string | undefined) ?? data?.avatar_url ?? null,
      fullName: data?.full_name ?? null,
      isAdmin: data?.role === 'admin',
    };
  } catch {
    return { avatarUrl: null, fullName: null, isAdmin: false };
  }
}

const FALLBACK_DATETIME =
  process.env.NEXT_PUBLIC_EVENT_START_DATETIME ?? '2026-12-31T18:30:00+07:00';

export async function fetchEventConfig(): Promise<EventConfig> {
  noStore();

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('app_config')
      .select('value')
      .eq('key', 'event_start_datetime')
      .single();

    if (error || !data?.value) {
      console.error('[homepage-service] fetchEventConfig: missing app_config key', error);
      return buildFallbackConfig();
    }

    const datetime = String(data.value);
    if (!isValidIso8601(datetime)) {
      console.error('[homepage-service] fetchEventConfig: malformed datetime value', datetime);
      return buildFallbackConfig();
    }

    return {
      event_start_datetime: datetime,
      venue: 'Nhà hát nghệ thuật quân đội',
      time_display: '18h30',
    };
  } catch (err) {
    console.error('[homepage-service] fetchEventConfig: unexpected error', err);
    return buildFallbackConfig();
  }
}

function buildFallbackConfig(): EventConfig {
  return {
    event_start_datetime: FALLBACK_DATETIME,
    venue: 'Nhà hát nghệ thuật quân đội',
    time_display: '18h30',
  };
}

function isValidIso8601(value: string): boolean {
  return !isNaN(Date.parse(value));
}
