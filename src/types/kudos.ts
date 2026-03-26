/** Hero badge tier for kudo recipients */
export type HeroBadgeTier = 'New Hero' | 'Rising Hero' | 'Super Hero' | 'Legend Hero';

/** Profile info embedded in kudo card display */
export interface KudoProfile {
  id: string;
  name: string;
  avatar_url: string | null;
  department: string | null;
  hero_badge: HeroBadgeTier | null;
}

/** Base kudo entity from `public.kudos` table (via `kudos_with_stats` view) */
export interface Kudo {
  id: string;
  sender_id: string | null;
  recipient_id: string;
  title: string;
  content: string;
  is_anonymous: boolean;
  anonymous_name: string | null;
  created_at: string;
  /** Aggregated from `kudo_likes` via `kudos_with_stats` view */
  like_count: number;
}

/** Kudo with joined profile + hashtag + image data for display */
export interface KudoWithDetails extends Kudo {
  sender: KudoProfile;
  recipient: KudoProfile;
  hashtags: KudoHashtag[];
  images: KudoImage[];
  /** Whether the current user has liked this kudo */
  liked_by_me: boolean;
}

/** Highlight kudo — same shape as feed kudo */
export type HighlightKudo = KudoWithDetails;

/** Junction: kudo ↔ hashtag */
export interface KudoHashtag {
  hashtag_id: string;
  name: string;
  key: string;
}

/** Image attached to a kudo */
export interface KudoImage {
  url: string;
  order_index: number;
}

/** Like junction for deduplication (DB table: `kudo_likes`) */
export interface KudoLike {
  kudo_id: string;
  user_id: string;
}

/** Authenticated user's personal kudo stats for sidebar (from `user_stats` view) */
export interface KudoStats {
  kudos_received: number;
  kudos_sent: number;
  likes_received: number;
  boxes_opened: number;
  boxes_remaining: number;
}

/** Spotlight board entry: recipient name + kudos count + profile fields */
export interface SpotlightEntry {
  user_id: string;
  name: string;
  count: number;
  department: string | null;
  hero_badge: HeroBadgeTier | null;
  avatar_url: string | null;
}

/** Filter params for feed / highlights queries */
export interface KudoFilters {
  hashtag_key?: string;
  department_name?: string;
  page?: number;
  limit?: number;
}

/** Paginated response wrapper */
export interface PaginatedKudos {
  data: KudoWithDetails[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}

/** Recent kudos entry for Spotlight bottom-left live feed */
export interface RecentSpotlightKudo {
  kudo_id: string;
  recipient_name: string;
  created_at: string;
}

/** Recent secret box opener for sidebar list */
export interface SecretBoxOpener {
  user_id: string;
  name: string;
  avatar_url: string | null;
  prize_description: string;
  opened_at: string;
}
