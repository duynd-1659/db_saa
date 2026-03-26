import { unstable_noStore as noStore } from 'next/cache';
import { createClient } from '@/libs/supabase/server';
import type { Department } from '@/types/department';

export async function fetchDepartments(): Promise<Department[]> {
  noStore();

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('departments')
    .select('id, name')
    .order('name', { ascending: true });

  if (error) {
    console.error('[department-service] fetchDepartments error:', error);
    return [];
  }

  return (data ?? []) as Department[];
}
