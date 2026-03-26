import { createClient } from '@/libs/supabase/client';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png'];

export async function uploadKudoImage(file: File): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Only JPEG and PNG images are allowed');
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File size must be under 10MB');
  }

  const supabase = createClient();
  const ext = file.name.split('.').pop() ?? 'jpg';
  const path = `kudos/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage.from('images').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });

  if (error) {
    console.error('[image-upload-service] upload error:', error);
    throw new Error('Failed to upload image');
  }

  const { data: urlData } = supabase.storage.from('images').getPublicUrl(path);
  return urlData.publicUrl;
}
