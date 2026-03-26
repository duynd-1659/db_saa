import { createClient } from '@/libs/supabase/server';
import type { KudoHashtag } from '@/types/kudos';

export async function fetchHashtags(): Promise<KudoHashtag[]> {
  const supabase = await createClient();

  const { data, error } = await supabase.from('hashtags').select('id, name, key').order('name');

  if (error) {
    console.error('[hashtag-service] fetchHashtags error:', error);
    return [];
  }

  return (data ?? []).map((row) => ({
    hashtag_id: row.id as string,
    name: row.name as string,
    key: row.key as string,
  }));
}
