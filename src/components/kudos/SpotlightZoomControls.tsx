'use client';

import { useTranslations } from 'next-intl';

interface SpotlightZoomControlsProps {
  zoomLevel: number;
  canZoomIn: boolean;
  canZoomOut: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFullscreen: () => void;
}

export function SpotlightZoomControls({
  zoomLevel,
  canZoomIn,
  canZoomOut,
  onZoomIn,
  onZoomOut,
  onFullscreen,
}: SpotlightZoomControlsProps): React.ReactElement {
  const t = useTranslations('kudosLiveBoard');
  const zoomPercent = `${Math.round(zoomLevel * 100)}%`;

  return (
    <div className="absolute bottom-3 right-3 z-20 flex flex-col items-center gap-1">
      {/* Zoom in */}
      <button
        onClick={onZoomIn}
        disabled={!canZoomIn}
        aria-label={t('spotlightZoomIn')}
        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-[rgba(0,16,26,0.8)] text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-30 hover:enabled:border-[var(--color-gold)]"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {/* Zoom out */}
      <button
        onClick={onZoomOut}
        disabled={!canZoomOut}
        aria-label={t('spotlightZoomOut')}
        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-[rgba(0,16,26,0.8)] text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-30 hover:enabled:border-[var(--color-gold)]"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {/* Zoom ratio */}
      <span className="font-montserrat text-[10px] text-[var(--color-text-muted)] tabular-nums">
        {zoomPercent}
      </span>

      {/* Fullscreen */}
      <button
        onClick={onFullscreen}
        aria-label={t('spotlightFullscreen')}
        className="cursor-pointer mt-1 flex h-7 w-7 items-center justify-center rounded-full bg-[rgba(0,16,26,0.8)] text-white transition-opacity hover:border-[var(--color-gold)]"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path
            d="M1 4.5V1h3.5M7.5 1H11v3.5M11 7.5V11H7.5M4.5 11H1V7.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
