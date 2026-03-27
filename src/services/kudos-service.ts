import { unstable_noStore as noStore } from 'next/cache';
import { createClient } from '@/libs/supabase/server';
import type {
  KudoWithDetails,
  KudoFilters,
  KudoProfile,
  KudoHashtag,
  KudoImage,
  PaginatedKudos,
  KudoStats,
  SpotlightEntry,
  RecentSpotlightKudo,
  SecretBoxOpener,
  HeroBadgeTier,
} from '@/types/kudos';

const DEFAULT_PAGE_SIZE = 20;

// ---------------------------------------------------------------------------
// T008: fetchKudosFeed
// ---------------------------------------------------------------------------
export async function fetchKudosFeed(
  filters: KudoFilters = {},
  currentUserId?: string,
): Promise<PaginatedKudos> {
  noStore();

  const page = filters.page ?? 1;
  const limit = filters.limit ?? DEFAULT_PAGE_SIZE;
  const offset = (page - 1) * limit;

  const supabase = await createClient();

  // Build base query on the view that includes like_count
  let query = supabase
    .from('kudos_with_stats')
    .select(
      `
      id,
      sender_id,
      recipient_id,
      title,
      content,
      is_anonymous,
      anonymous_name,
      created_at,
      like_count,
      sender:profiles!kudos_sender_id_fkey(id, full_name, avatar_url, hero_badge, department:departments(name)),
      recipient:profiles!kudos_recipient_id_fkey(id, full_name, avatar_url, hero_badge, department:departments(name)),
      kudo_hashtags(hashtag_id, hashtags(name, key)),
      kudo_images(url, order_index)
    `,
      { count: 'exact' },
    )
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  // Apply filters
  if (filters.hashtag_key) {
    const hashtagId = await resolveHashtagKeyToId(supabase, filters.hashtag_key);
    if (hashtagId) {
      query = query.eq('kudo_hashtags.hashtag_id', hashtagId);
    } else {
      // Key doesn't match any hashtag — return empty
      return { data: [], total: 0, page, limit, has_more: false };
    }
  }
  if (filters.department_name) {
    const departmentId = await resolveDepartmentNameToId(supabase, filters.department_name);
    if (departmentId) {
      query = query.eq('recipient.department_id', departmentId);
    } else {
      return { data: [], total: 0, page, limit, has_more: false };
    }
  }

  const { data, count, error } = await query;

  if (error) {
    console.error('[kudos-service] fetchKudosFeed error:', error);
    return { data: [], total: 0, page, limit, has_more: false };
  }

  // Fetch current user's likes for these kudos
  const kudoIds = (data ?? []).map((k: Record<string, unknown>) => k.id as string);
  const likedSet = currentUserId
    ? await getUserLikedKudoIds(kudoIds, currentUserId)
    : new Set<string>();

  const kudos = (data ?? []).map((row: Record<string, unknown>) =>
    mapRowToKudoWithDetails(row, likedSet),
  );
  const total = count ?? 0;

  return {
    data: kudos,
    total,
    page,
    limit,
    has_more: offset + limit < total,
  };
}

// ---------------------------------------------------------------------------
// T009: fetchHighlightKudos
// ---------------------------------------------------------------------------
export async function fetchHighlightKudos(
  filters: Pick<KudoFilters, 'hashtag_key' | 'department_name'> = {},
  currentUserId?: string,
): Promise<KudoWithDetails[]> {
  noStore();

  const supabase = await createClient();

  let hashtagId: string | null = null;
  if (filters.hashtag_key) {
    hashtagId = await resolveHashtagKeyToId(supabase, filters.hashtag_key);
    if (!hashtagId) return [];
  }

  const hashtagJoin = hashtagId
    ? 'kudo_hashtags!inner(hashtag_id, hashtags(name, key))'
    : 'kudo_hashtags(hashtag_id, hashtags(name, key))';

  let query = supabase
    .from('kudos_with_stats')
    .select(
      `
      id,
      sender_id,
      recipient_id,
      title,
      content,
      is_anonymous,
      anonymous_name,
      created_at,
      like_count,
      sender:profiles!kudos_sender_id_fkey(id, full_name, avatar_url, hero_badge, department:departments(name)),
      recipient:profiles!kudos_recipient_id_fkey(id, full_name, avatar_url, hero_badge, department:departments(name)),
      ${hashtagJoin},
      kudo_images(url, order_index)
    `,
    )
    .order('like_count', { ascending: false })
    .limit(5);

  if (hashtagId) {
    query = query.eq('kudo_hashtags.hashtag_id', hashtagId);
  }
  if (filters.department_name) {
    const departmentId = await resolveDepartmentNameToId(supabase, filters.department_name);
    if (departmentId) {
      query = query.eq('recipient.department_id', departmentId);
    } else {
      return [];
    }
  }

  const { data, error } = await query;

  if (error) {
    console.error('[kudos-service] fetchHighlightKudos error:', error);
    return [];
  }

  const kudoIds = (data ?? []).map((k: Record<string, unknown>) => k.id as string);
  const likedSet = currentUserId
    ? await getUserLikedKudoIds(kudoIds, currentUserId)
    : new Set<string>();

  return (data ?? []).map((row: Record<string, unknown>) => mapRowToKudoWithDetails(row, likedSet));
}

// ---------------------------------------------------------------------------
// T010: toggleKudoLike
// ---------------------------------------------------------------------------
export async function toggleKudoLike(
  kudoId: string,
  userId: string,
): Promise<{ liked: boolean; like_count: number }> {
  const supabase = await createClient();

  // Check if already liked
  const { data: existing } = await supabase
    .from('kudo_likes')
    .select('kudo_id')
    .eq('kudo_id', kudoId)
    .eq('user_id', userId)
    .maybeSingle();

  if (existing) {
    // Unlike
    const { error } = await supabase
      .from('kudo_likes')
      .delete()
      .eq('kudo_id', kudoId)
      .eq('user_id', userId);

    if (error) {
      console.error('[kudos-service] toggleKudoLike delete error:', error);
      throw new Error('Failed to unlike kudo');
    }
  } else {
    // Like
    const { error } = await supabase
      .from('kudo_likes')
      .insert({ kudo_id: kudoId, user_id: userId });

    if (error) {
      console.error('[kudos-service] toggleKudoLike insert error:', error);
      throw new Error('Failed to like kudo');
    }
  }

  // Fetch updated count from view
  const { data: updated } = await supabase
    .from('kudos_with_stats')
    .select('like_count')
    .eq('id', kudoId)
    .single();

  return {
    liked: !existing,
    like_count: (updated?.like_count as number) ?? 0,
  };
}

// ---------------------------------------------------------------------------
// T011 / T006: fetchSpotlightData (extended with profile fields)
// ---------------------------------------------------------------------------
export async function fetchTotalKudosCount(): Promise<number> {
  noStore();
  const supabase = await createClient();
  const { count, error } = await supabase
    .from('kudos')
    .select('*', { count: 'exact', head: true });
  if (error) {
    console.error('[kudos-service] fetchTotalKudosCount error:', error);
    return 0;
  }
  return count ?? 0;
}

export async function fetchSpotlightData(): Promise<SpotlightEntry[]> {
  noStore();

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('kudos')
    .select(
      'recipient_id, recipient:profiles!kudos_recipient_id_fkey(id, full_name, avatar_url, hero_badge, department:departments(name))',
    )
    .not('recipient_id', 'is', null);

  if (error) {
    console.error('[kudos-service] fetchSpotlightData error:', error);
    return [];
  }

  type RecipientRow = {
    id: string;
    full_name: string;
    avatar_url: string | null;
    hero_badge: string | null;
    department: { name: string } | null;
  };

  // Aggregate counts per recipient id, preserving profile fields
  const countMap = new Map<string, { count: number; profile: RecipientRow }>();
  for (const row of data ?? []) {
    const recipient = row.recipient as unknown as RecipientRow | null;
    if (!recipient) continue;
    const existing = countMap.get(recipient.id);
    if (existing) {
      existing.count += 1;
    } else {
      countMap.set(recipient.id, { count: 1, profile: recipient });
    }
  }

  return Array.from(countMap.values())
    .map(({ count, profile }) => ({
      user_id: profile.id,
      name: profile.full_name,
      count,
      department: profile.department?.name ?? null,
      hero_badge: (profile.hero_badge as HeroBadgeTier | null) ?? null,
      avatar_url: profile.avatar_url,
    }))
    .sort((a, b) => b.count - a.count);
}

// ---------------------------------------------------------------------------
// T004: fetchSpotlightStats
// ---------------------------------------------------------------------------
export async function fetchSpotlightStats(
  userId: string,
): Promise<{ kudos_received: number; kudos_sent: number }> {
  noStore();

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('user_stats')
    .select('kudos_received, kudos_sent')
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    console.error('[kudos-service] fetchSpotlightStats error:', error);
    return { kudos_received: 0, kudos_sent: 0 };
  }

  return {
    kudos_received: data.kudos_received as number,
    kudos_sent: data.kudos_sent as number,
  };
}

// ---------------------------------------------------------------------------
// T044b: fetchRecentSpotlightKudos
// ---------------------------------------------------------------------------
export async function fetchRecentSpotlightKudos(limit = 7): Promise<RecentSpotlightKudo[]> {
  noStore();

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('kudos')
    .select('id, created_at, recipient:profiles!kudos_recipient_id_fkey(full_name)')
    .not('recipient_id', 'is', null)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[kudos-service] fetchRecentSpotlightKudos error:', error);
    return [];
  }

  return (data ?? []).map((row) => {
    const recipient = row.recipient as unknown as { full_name: string } | null;
    return {
      kudo_id: row.id as string,
      recipient_name: recipient?.full_name ?? 'Unknown',
      created_at: row.created_at as string,
    };
  });
}

// ---------------------------------------------------------------------------
// T012: fetchUserKudoStats
// ---------------------------------------------------------------------------
export async function fetchUserKudoStats(userId: string): Promise<KudoStats> {
  noStore();

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('user_stats')
    .select('kudos_sent, kudos_received, likes_received, secret_boxes_pending')
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    console.error('[kudos-service] fetchUserKudoStats error:', error);
    return {
      kudos_received: 0,
      kudos_sent: 0,
      likes_received: 0,
      boxes_opened: 0,
      boxes_remaining: 0,
    };
  }

  // Also fetch opened boxes count
  const { count: openedCount } = await supabase
    .from('user_secret_boxes')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_opened', true);

  return {
    kudos_received: (data.kudos_received as number) ?? 0,
    kudos_sent: (data.kudos_sent as number) ?? 0,
    likes_received: (data.likes_received as number) ?? 0,
    boxes_opened: openedCount ?? 0,
    boxes_remaining: (data.secret_boxes_pending as number) ?? 0,
  };
}

// ---------------------------------------------------------------------------
// T013: fetchRecentBoxOpeners
// ---------------------------------------------------------------------------
export async function fetchRecentBoxOpeners(limit = 10): Promise<SecretBoxOpener[]> {
  noStore();

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('user_secret_boxes')
    .select(
      `
      user_id,
      opened_at,
      badge:badges(name, description),
      profile:profiles!user_secret_boxes_user_id_fkey(full_name, avatar_url)
    `,
    )
    .eq('is_opened', true)
    .not('opened_at', 'is', null)
    .order('opened_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[kudos-service] fetchRecentBoxOpeners error:', error);
    return [];
  }

  return (data ?? []).map((row) => {
    const profile = row.profile as unknown as {
      full_name: string;
      avatar_url: string | null;
    } | null;
    const badge = row.badge as unknown as { name: string; description: string } | null;
    return {
      user_id: row.user_id as string,
      name: profile?.full_name ?? 'Unknown',
      avatar_url: profile?.avatar_url ?? null,
      prize_description: badge?.name ?? badge?.description ?? '',
      opened_at: (row.opened_at as string) ?? '',
    };
  });
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function resolveHashtagKeyToId(
  supabase: Awaited<ReturnType<typeof createClient>>,
  key: string,
): Promise<string | null> {
  const { data } = await supabase.from('hashtags').select('id').eq('key', key).maybeSingle();

  return (data?.id as string) ?? null;
}

async function resolveDepartmentNameToId(
  supabase: Awaited<ReturnType<typeof createClient>>,
  name: string,
): Promise<string | null> {
  const { data } = await supabase.from('departments').select('id').eq('name', name).maybeSingle();

  return (data?.id as string) ?? null;
}

async function getUserLikedKudoIds(kudoIds: string[], userId: string): Promise<Set<string>> {
  if (kudoIds.length === 0) return new Set();

  const supabase = await createClient();

  const { data } = await supabase
    .from('kudo_likes')
    .select('kudo_id')
    .eq('user_id', userId)
    .in('kudo_id', kudoIds);

  return new Set((data ?? []).map((r) => r.kudo_id as string));
}

function mapRowToKudoWithDetails(
  row: Record<string, unknown>,
  likedSet: Set<string>,
): KudoWithDetails {
  const senderRaw = row.sender as Record<string, unknown> | null;
  const recipientRaw = row.recipient as Record<string, unknown> | null;
  const hashtagsRaw = (row.kudo_hashtags ?? []) as Array<Record<string, unknown>>;
  const imagesRaw = (row.kudo_images ?? []) as Array<Record<string, unknown>>;

  const senderDept = senderRaw?.department as Record<string, unknown> | null;
  const recipientDept = recipientRaw?.department as Record<string, unknown> | null;

  const sender: KudoProfile = {
    id: (senderRaw?.id as string) ?? '',
    name: (senderRaw?.full_name as string) ?? '',
    avatar_url: (senderRaw?.avatar_url as string | null) ?? null,
    department: (senderDept?.name as string | null) ?? null,
    hero_badge: (senderRaw?.hero_badge as HeroBadgeTier | null) ?? null,
  };

  const recipient: KudoProfile = {
    id: (recipientRaw?.id as string) ?? '',
    name: (recipientRaw?.full_name as string) ?? '',
    avatar_url: (recipientRaw?.avatar_url as string | null) ?? null,
    department: (recipientDept?.name as string | null) ?? null,
    hero_badge: (recipientRaw?.hero_badge as HeroBadgeTier | null) ?? null,
  };

  const hashtags: KudoHashtag[] = hashtagsRaw.map((h) => {
    const tag = h.hashtags as Record<string, unknown> | null;
    return {
      hashtag_id: h.hashtag_id as string,
      name: (tag?.name as string) ?? '',
      key: (tag?.key as string) ?? '',
    };
  });

  const images: KudoImage[] = imagesRaw
    .map((img) => ({
      url: img.url as string,
      order_index: (img.order_index as number) ?? 0,
    }))
    .sort((a, b) => a.order_index - b.order_index);

  return {
    id: row.id as string,
    sender_id: (row.sender_id as string | null) ?? null,
    recipient_id: row.recipient_id as string,
    title: (row.title as string) ?? '',
    content: row.content as string,
    is_anonymous: row.is_anonymous as boolean,
    anonymous_name: (row.anonymous_name as string | null) ?? null,
    created_at: row.created_at as string,
    like_count: (row.like_count as number) ?? 0,
    sender,
    recipient,
    hashtags,
    images,
    liked_by_me: likedSet.has(row.id as string),
  };
}
