'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createPortal } from 'react-dom';
import { useLocale } from 'next-intl';
import type { SunnerHoverTarget } from '@/types/sunner-hover';
import { HERO_BADGE_IMAGE } from '@/config/hero-badge';

interface Stats {
  kudos_received: number;
  kudos_sent: number;
}

const statsCache = new Map<string, Stats>();

interface SunnerHoverCardProps {
  target: SunnerHoverTarget;
  anchorStyle: React.CSSProperties;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onSendKudo: () => void;
}

export function SunnerHoverCard({
  target,
  anchorStyle,
  onMouseEnter,
  onMouseLeave,
  onSendKudo,
}: SunnerHoverCardProps): React.ReactElement {
  const locale = useLocale();
  const [stats, setStats] = useState<Stats | null>(statsCache.get(target.userId) ?? null);
  const [statsError, setStatsError] = useState(false);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (statsCache.has(target.userId)) {
      setStats(statsCache.get(target.userId)!);
      return;
    }
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    fetch(`/api/users/${target.userId}/spotlight-stats`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed');
        return res.json() as Promise<Stats>;
      })
      .then((data) => {
        statsCache.set(target.userId, data);
        setStats(data);
      })
      .catch(() => setStatsError(true));
  }, [target.userId]);

  const profileHref = `/${locale}/users/${target.userId}`;

  const card = (
    <div
      role="dialog"
      aria-label={`Thông tin của ${target.name}`}
      style={anchorStyle}
      className="z-50 min-w-[220px] max-w-[300px] rounded-xl border border-[#998C5F] bg-[rgba(0,16,26,0.95)] p-4 shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Row 1 — View profile link + Full name */}
      <div className="flex flex-col gap-1">
        <Link href={profileHref}>
          <p className="font-montserrat text-base font-bold text-white underline">{target.name}</p>
        </Link>
      </div>

      {/* Row 2 — Department + Hero badge */}
      {(target.department ?? target.heroBadge) && (
        <div className="mt-2 flex flex-row items-center gap-1.5">
          {target.department && (
            <span className="font-montserrat text-xs text-[rgba(255,255,255,0.5)]">
              {target.department}
            </span>
          )}
          {target.heroBadge && (
            <Image
              src={HERO_BADGE_IMAGE[target.heroBadge]}
              alt={target.heroBadge}
              width={109}
              height={19}
              className="object-contain"
            />
          )}
        </div>
      )}

      {/* Row 3 — Divider */}
      <hr className="my-2 border-t border-[rgba(255,255,255,0.15)]" />

      {/* Rows 4–5 — Stats */}
      {statsError ? (
        <div className="flex flex-col gap-1.5">
          <StatRow label="Kudos đã nhận" value="–" />
          <StatRow label="Kudos đã gửi" value="–" />
        </div>
      ) : stats ? (
        <div className="flex flex-col gap-1.5">
          <StatRow label="Kudos đã nhận" value={stats.kudos_received} />
          <StatRow label="Kudos đã gửi" value={stats.kudos_sent} />
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          <SkeletonRow />
          <SkeletonRow />
        </div>
      )}

      {/* Row 6 — Send KUDO button */}
      <button
        type="button"
        onClick={onSendKudo}
        className="mt-2 w-full rounded-full bg-[#FFEA9E] px-4 py-2 font-montserrat text-[13px] font-semibold text-[#00101A] transition-opacity hover:opacity-90"
      >
        ✏ Send KUDO
      </button>
    </div>
  );

  return createPortal(card, document.body);
}

function StatRow({ label, value }: { label: string; value: number | string }): React.ReactElement {
  return (
    <div className="flex flex-row items-center justify-between">
      <span className="font-montserrat text-xs text-[rgba(255,255,255,0.5)]">{label}</span>
      <span className="font-montserrat text-sm font-bold text-white">{value}</span>
    </div>
  );
}

function SkeletonRow(): React.ReactElement {
  return (
    <div className="flex flex-row items-center justify-between">
      <span className="h-[16px] w-24 animate-pulse rounded bg-white/20" />
      <span className="h-[20px] w-6 animate-pulse rounded bg-white/20" />
    </div>
  );
}
