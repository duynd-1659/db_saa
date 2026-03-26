import { createClient } from '@/libs/supabase/server';
import type { RecipientProfile } from '@/types/kudo-write';

export async function searchProfiles(query: string): Promise<RecipientProfile[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url, departments(name)')
    .ilike('full_name', `%${query}%`)
    .limit(10);

  if (error) {
    console.error('[profile-service] searchProfiles error:', error);
    return [];
  }

  return (data ?? []).map((row) => {
    const dept = row.departments as unknown as { name: string } | null;
    return {
      id: row.id as string,
      full_name: row.full_name as string,
      avatar_url: (row.avatar_url as string | null) ?? null,
      department_name: dept?.name ?? null,
    };
  });
}
