import type { HeroBadgeTier } from '@/types/kudos';

export interface SunnerHoverTarget {
  userId: string;
  name: string;
  department: string | null;
  heroBadge: HeroBadgeTier | null;
  avatarUrl: string | null;
}
