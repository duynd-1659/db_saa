import { createClient } from '@/libs/supabase/server';
import type { CreateKudoPayload, CreateKudoResponse } from '@/types/kudo-write';

export async function createKudo(
  payload: CreateKudoPayload,
  currentUserId: string,
): Promise<CreateKudoResponse> {
  const supabase = await createClient();

  const senderId = payload.is_anonymous ? null : currentUserId;

  // Insert the kudo
  const { data: kudo, error: kudoError } = await supabase
    .from('kudos')
    .insert({
      sender_id: senderId,
      recipient_id: payload.recipient_id,
      title: payload.title,
      content: payload.content,
      is_anonymous: payload.is_anonymous,
      anonymous_name: payload.is_anonymous ? (payload.anonymous_name ?? null) : null,
    })
    .select('id, created_at')
    .single();

  if (kudoError || !kudo) {
    console.error('[kudo-write-service] createKudo insert error:', kudoError);
    throw new Error('Failed to create kudo');
  }

  const kudoId = kudo.id as string;

  // Insert hashtag associations
  const hashtagRows = payload.hashtag_ids.map((hashtag_id) => ({
    kudo_id: kudoId,
    hashtag_id,
  }));

  const { error: hashtagError } = await supabase.from('kudo_hashtags').insert(hashtagRows);

  if (hashtagError) {
    console.error('[kudo-write-service] createKudo hashtag insert error:', hashtagError);
    // Clean up the kudo if hashtags fail
    await supabase.from('kudos').delete().eq('id', kudoId);
    throw new Error('Failed to attach hashtags');
  }

  // Insert image associations (if any)
  if (payload.image_urls.length > 0) {
    const imageRows = payload.image_urls.map((url, index) => ({
      kudo_id: kudoId,
      url,
      order_index: index,
    }));

    const { error: imageError } = await supabase.from('kudo_images').insert(imageRows);

    if (imageError) {
      console.error('[kudo-write-service] createKudo image insert error:', imageError);
      // Clean up on failure
      await supabase.from('kudo_hashtags').delete().eq('kudo_id', kudoId);
      await supabase.from('kudos').delete().eq('id', kudoId);
      throw new Error('Failed to attach images');
    }
  }

  return {
    id: kudoId,
    created_at: kudo.created_at as string,
  };
}
