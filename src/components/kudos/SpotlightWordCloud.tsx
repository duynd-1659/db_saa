'use client';

import { useMemo, useLayoutEffect, useRef, useState } from 'react';
import type { SpotlightEntry } from '@/types/kudos';
import { SunnerHoverCardTrigger } from './SunnerHoverCardTrigger';

interface WordCloudEntry extends SpotlightEntry {
  highlighted: boolean;
}

interface SpotlightWordCloudProps {
  entries: WordCloudEntry[];
}

// Deterministic values from index to avoid hydration mismatch
function getOscillateDelay(index: number): string {
  return `${(index * 317) % 2000}ms`;
}

function getOscillateDuration(index: number): string {
  return `${12000 + ((index * 173) % 3000)}ms`;
}

// Deterministic pseudo-random using Math.sin (same result on SSR & client)
function seededRandom(seed: number): number {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

// SpotlightRecentFeed: bottom-left, fixed 330px × 136px, container height 688px.
const FEED_W_PX = 330 + 8; // add some buffer to avoid crowding the feed area
const FEED_H_PX = 136 + 16; // add some buffer to avoid crowding the feed area
const CONTAINER_H_PX = 688;
const FEED_EXCLUDE_Y_MIN_PCT = ((CONTAINER_H_PX - FEED_H_PX) / CONTAINER_H_PX) * 100; // ≈ 80.23%

// Generate non-overlapping random positions within [pad%, (100-pad)%],
// avoiding the bottom-left region occupied by SpotlightRecentFeed.
function generatePositions(
  count: number,
  containerWidthPx: number,
): Array<{ x: number; y: number }> {
  const positions: Array<{ x: number; y: number }> = [];
  const PAD = 8; // % margin from edges
  const MIN_DIST = 8; // minimum distance between centers in % units
  const MAX_ATTEMPTS = 50;
  const feedExcludeXMaxPct = containerWidthPx > 0 ? (FEED_W_PX / containerWidthPx) * 100 : 0;

  for (let i = 0; i < count; i++) {
    let pos = { x: 50, y: 50 };
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      const rx = seededRandom(i * 3 + attempt * 97);
      const ry = seededRandom(i * 3 + 1 + attempt * 97);
      const y = PAD + ry * (100 - PAD * 2);
      // In the bottom strip, remap x to [feedExcludeXMaxPct, 100-PAD] to avoid the feed zone
      const xMin = feedExcludeXMaxPct > 0 && y > FEED_EXCLUDE_Y_MIN_PCT ? feedExcludeXMaxPct : PAD;
      pos = { x: xMin + rx * (100 - PAD - xMin), y };
      const tooClose = positions.some((p) => Math.hypot(p.x - pos.x, p.y - pos.y) < MIN_DIST);
      if (!tooClose) break;
    }
    positions.push(pos);
  }
  return positions;
}

export function SpotlightWordCloud({ entries }: SpotlightWordCloudProps): React.ReactElement {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [containerWidthPx, setContainerWidthPx] = useState(0);

  useLayoutEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    setContainerWidthPx(el.offsetWidth);
    const ro = new ResizeObserver((resizeEntries) => {
      setContainerWidthPx(resizeEntries[0].contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const names = useMemo(() => {
    const positions = generatePositions(entries.length, containerWidthPx);
    return entries.map((entry, i) => ({
      ...entry,
      delay: getOscillateDelay(i),
      duration: getOscillateDuration(i),
      opacity: 1,
      x: parseFloat(positions[i].x.toFixed(4)),
      y: parseFloat(positions[i].y.toFixed(4)),
    }));
  }, [entries, containerWidthPx]);

  return (
    <div ref={wrapperRef} className="absolute inset-0 overflow-hidden">
      {names.map((entry) => (
        <SunnerHoverCardTrigger
          key={entry.user_id}
          target={{
            userId: entry.user_id,
            name: entry.name,
            department: entry.department,
            heroBadge: entry.hero_badge,
            avatarUrl: entry.avatar_url,
          }}
          wrapperClassName="spotlight-name-oscillate absolute cursor-pointer font-montserrat font-normal group"
          wrapperStyle={{
            fontSize: '9px',
            color: entry.highlighted ? '#ff6b35' : `rgba(255, 255, 255, ${entry.opacity})`,
            animationDelay: entry.delay,
            animationDuration: entry.duration,
            transition: 'color 0.2s',
            left: `${entry.x}%`,
            top: `${entry.y}%`,
            transform: 'translate(-50%, -50%)',
            whiteSpace: 'nowrap',
          }}
        >
          <span className="group-hover:text-[#FFEA9E] group-data-[hovered=true]:text-[#FFEA9E]">
            {entry.name}
          </span>
        </SunnerHoverCardTrigger>
      ))}
    </div>
  );
}
