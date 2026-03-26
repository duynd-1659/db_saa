'use client';

import { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useRouter, usePathname } from '@/i18n/navigation';
import type { SpotlightEntry, RecentSpotlightKudo } from '@/types/kudos';
import { SpotlightStarBackground } from './SpotlightStarBackground';
import dynamic from 'next/dynamic';

const SpotlightWordCloud = dynamic(
  () => import('./SpotlightWordCloud').then((m) => m.SpotlightWordCloud),
  { ssr: false },
);
import { SpotlightRecentFeed } from './SpotlightRecentFeed';
import { SpotlightZoomControls } from './SpotlightZoomControls';

interface SpotlightBoardProps {
  initialData: SpotlightEntry[];
  initialRecent: RecentSpotlightKudo[];
  totalKudos: number;
}

const ZOOM_STEP = 0.5;
const ZOOM_MIN = 1.0;
const ZOOM_MAX = 5.0;

export function SpotlightBoard({
  initialData,
  initialRecent,
  totalKudos,
}: SpotlightBoardProps): React.ReactElement {
  const t = useTranslations('kudosLiveBoard');
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('q') ?? '');
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const zoomLevelRef = useRef(1.0);
  const dragStartRef = useRef({ clientX: 0, clientY: 0, panX: 0, panY: 0 });

  // Clamp pan within valid bounds whenever zoom changes
  useEffect(() => {
    zoomLevelRef.current = zoomLevel;
    if (zoomLevel === ZOOM_MIN) {
      setPanOffset({ x: 0, y: 0 });
    } else {
      const w = containerRef.current?.offsetWidth ?? 0;
      const h = containerRef.current?.offsetHeight ?? 0;
      const maxX = (w * (zoomLevel - 1)) / 2;
      const maxY = (h * (zoomLevel - 1)) / 2;
      setPanOffset((prev) => ({
        x: Math.max(-maxX, Math.min(maxX, prev.x)),
        y: Math.max(-maxY, Math.min(maxY, prev.y)),
      }));
    }
  }, [zoomLevel]);

  const entries = useMemo(
    () =>
      initialData.map((entry) => ({
        ...entry,
        highlighted:
          searchQuery.length > 0 && entry.name.toLowerCase().includes(searchQuery.toLowerCase()),
      })),
    [initialData, searchQuery],
  );

  const matchCount = useMemo(
    () => (searchQuery.length > 0 ? entries.filter((e) => e.highlighted).length : 0),
    [entries, searchQuery],
  );

  const handleZoomIn = useCallback(() => {
    setZoomLevel((z) => {
      const next = Math.min(+(z + ZOOM_STEP).toFixed(2), ZOOM_MAX);
      zoomLevelRef.current = next;
      return next;
    });
  }, []);
  const handleZoomOut = useCallback(() => {
    setZoomLevel((z) => {
      const next = Math.max(+(z - ZOOM_STEP).toFixed(2), ZOOM_MIN);
      zoomLevelRef.current = next;
      return next;
    });
  }, []);
  const handleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(console.error);
    } else {
      containerRef.current.requestFullscreen().catch(console.error);
    }
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (zoomLevel <= ZOOM_MIN) return;
      isDraggingRef.current = true;
      setIsDragging(true);
      dragStartRef.current = {
        clientX: e.clientX,
        clientY: e.clientY,
        panX: panOffset.x,
        panY: panOffset.y,
      };
    },
    [zoomLevel, panOffset.x, panOffset.y],
  );

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const { clientX, clientY, panX, panY } = dragStartRef.current;
    const zoom = zoomLevelRef.current;
    const w = containerRef.current?.offsetWidth ?? 0;
    const h = containerRef.current?.offsetHeight ?? 0;
    const maxX = (w * (zoom - 1)) / 2;
    const maxY = (h * (zoom - 1)) / 2;
    setPanOffset({
      x: Math.max(-maxX, Math.min(maxX, panX + (e.clientX - clientX))),
      y: Math.max(-maxY, Math.min(maxY, panY + (e.clientY - clientY))),
    });
  }, []);

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
    setIsDragging(false);
  }, []);

  const cursorClass = zoomLevel > ZOOM_MIN ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : '';

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-[47px] border border-[#998C5F] bg-[#00101A] select-none ${cursorClass}`}
      style={{ width: '100%', height: '688px' }}
      aria-label={t('aria.spotlightSection')}
      role="region"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Layer 1: Star background — FIXED, not affected by zoom or pan */}
      <div className="pointer-events-none absolute inset-0 z-11">
        <SpotlightStarBackground />
      </div>

      {/* Layer 2: Zoom+pan layer — background image + word cloud */}
      <div
        className="absolute inset-0 z-10"
        style={{
          transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
          transformOrigin: 'center center',
          transition: isDragging ? 'none' : 'transform 0.2s ease',
        }}
      >
        <Image
          src="/assets/kudos/images/spotlight-bg.png"
          alt=""
          fill
          className="pointer-events-none object-fill opacity-50"
          style={{ mixBlendMode: 'screen' }}
          aria-hidden="true"
          priority
        />
        <SpotlightWordCloud entries={entries} />
      </div>

      {/* Search bar — top-left, fixed (not scaled/panned) */}
      <div className="absolute left-5 top-5 z-20">
        <div className="flex items-center gap-2 rounded-full border border-[#998C5F] bg-[rgba(255,234,158,0.10)] px-3 py-1.5">
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden="true"
            className="shrink-0"
          >
            <circle cx="6" cy="6" r="4.5" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" />
            <path
              d="M10 10l2.5 2.5"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              const value = e.target.value;
              setSearchQuery(value);
              const params = new URLSearchParams(searchParams.toString());
              if (value) {
                params.set('q', value);
              } else {
                params.delete('q');
              }
              router.replace(`${pathname}?${params.toString()}` as never, { scroll: false });
            }}
            placeholder={t('spotlightSearch')}
            maxLength={100}
            className="w-28 bg-transparent font-montserrat text-xs text-white outline-none placeholder:text-[var(--color-text-muted)]"
            onMouseDown={(e) => e.stopPropagation()}
          />
          {searchQuery.length > 0 && (
            <span className="shrink-0 text-xs font-semibold text-white">
              {matchCount} {t('spotlightResultCount')}
            </span>
          )}
        </div>
      </div>

      {/* KUDOS count — top-center, fixed (not scaled/panned) */}
      <div className="absolute left-1/2 top-3 z-20 -translate-x-1/2">
        <span className="font-montserrat text-[36px] font-bold text-white drop-shadow-lg">
          {totalKudos.toLocaleString()} KUDOS
        </span>
      </div>

      {/* Bottom-left: recent kudos live feed */}
      <SpotlightRecentFeed items={initialRecent} />

      {/* Bottom-right: zoom controls */}
      <SpotlightZoomControls
        zoomLevel={zoomLevel}
        canZoomIn={zoomLevel < ZOOM_MAX}
        canZoomOut={zoomLevel > ZOOM_MIN}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onFullscreen={handleFullscreen}
      />
    </div>
  );
}
