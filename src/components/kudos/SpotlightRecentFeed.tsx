'use client';

import { useTranslations } from 'next-intl';
import type { RecentSpotlightKudo } from '@/types/kudos';

interface SpotlightRecentFeedProps {
  items: RecentSpotlightKudo[];
}

function formatTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    const vnDate = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));
    const hours = vnDate.getHours();
    const minutes = vnDate.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHour = hours % 12 || 12;
    return `${displayHour.toString().padStart(2, '0')}:${minutes}${ampm}`;
  } catch {
    return '';
  }
}

export function SpotlightRecentFeed({ items }: SpotlightRecentFeedProps): React.ReactElement {
  const t = useTranslations('kudosLiveBoard');

  if (items.length === 0) return <></>;

  return (
    <div className="absolute bottom-0 left-0 z-20 flex w-[330px] h-[136px] overflow-hidden flex-col gap-0.5 pb-2 pl-3">
      {items.map((item) => (
        <div
          key={item.kudo_id}
          className="flex items-baseline gap-1.5 font-montserrat"
        >
          <span className="text-[11px] text-[var(--color-text-muted)] tabular-nums shrink-0">
            {formatTime(item.created_at)}
          </span>
          <span className="text-[11px] font-normal text-white leading-tight">
            <span className="font-semibold">{item.recipient_name}</span>{' '}
            {t('spotlightRecentReceived')}
          </span>
        </div>
      ))}
    </div>
  );
}
