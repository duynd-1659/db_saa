'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/libs/supabase/server';
import { z } from 'zod';

const updateRoleSchema = z.object({
  role: z.enum(['user', 'admin']),
});

export async function updateMyRole(formData: FormData): Promise<UpdateResult> {
  const parsed = updateRoleSchema.safeParse({ role: formData.get('role') });

  if (!parsed.success) {
    return { success: false, error: 'Invalid role.' };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Unauthorized.' };
  }

  const { error } = await supabase
    .from('profiles')
    .update({ role: parsed.data.role })
    .eq('id', user.id);

  if (error) {
    console.error('[admin-service] updateMyRole failed', error);
    return { success: false, error: 'Failed to update role.' };
  }

  revalidatePath('/admin');

  return { success: true };
}

const updateEventDatetimeSchema = z.object({
  event_start_datetime: z.string().datetime({ offset: true }),
});

type UpdateResult = { success: true } | { success: false; error: string };

export async function updateEventStartDatetime(formData: FormData): Promise<UpdateResult> {
  const raw = formData.get('event_start_datetime');

  const parsed = updateEventDatetimeSchema.safeParse({
    event_start_datetime: raw,
  });

  if (!parsed.success) {
    return { success: false, error: 'Invalid datetime format. Use ISO-8601 with timezone offset.' };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Unauthorized.' };
  }

  const { error } = await supabase
    .from('app_config')
    .update({ value: parsed.data.event_start_datetime, updated_at: new Date().toISOString() })
    .eq('key', 'event_start_datetime');

  if (error) {
    console.error('[admin-service] updateEventStartDatetime failed', error);
    return { success: false, error: 'Failed to update. Please try again.' };
  }

  revalidatePath('/');

  return { success: true };
}
