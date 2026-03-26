'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import type { KudoWithDetails } from '@/types/kudos';
import { HighlightKudoCard } from './HighlightKudoCard';

interface KudosCarouselProps {
  kudos: KudoWithDetails[];
}

const CARD_WIDTH = 540;
const CARD_GAP = 24;
const CARD_SLOT = CARD_WIDTH + CARD_GAP;

/**
 * Seamless infinite carousel using the clone technique:
 * DOM order: [clone_of_last, slide_1, slide_2, …, slide_n, clone_of_first]
 * trackIndex: 0 = clone_of_last | 1..n = real slides | n+1 = clone_of_first
 * After the CSS transition ends at a clone position, we silently jump
 * (no animation) to the corresponding real slide.
 */
export function KudosCarousel({ kudos }: KudosCarouselProps): React.ReactElement {
  const t = useTranslations('kudosLiveBoard');
  const total = kudos.length;

  // Start at trackIndex=1 (first real slide)
  const [trackIndex, setTrackIndex] = useState(1);
  const [animated, setAnimated] = useState(true);
  const isSilentJump = useRef(false);

  // Slide list: clone of last | real slides | clone of first
  const slides = [kudos[total - 1], ...kudos, kudos[0]];

  // Real 1-based slide number for the page indicator
  const realPage = trackIndex === 0 ? total : trackIndex === total + 1 ? 1 : trackIndex;

  const navigate = useCallback((next: number) => {
    setAnimated(true);
    setTrackIndex(next);
  }, []);

  // After the animated transition ends, silently jump from clone to real slide
  const handleTransitionEnd = useCallback(
    (e: React.TransitionEvent<HTMLDivElement>) => {
      // Only react to the transform on the track itself, not child transitions
      if (e.target !== e.currentTarget || e.propertyName !== 'transform') return;

      if (trackIndex === 0) {
        isSilentJump.current = true;
        setAnimated(false);
        setTrackIndex(total);
      } else if (trackIndex === total + 1) {
        isSilentJump.current = true;
        setAnimated(false);
        setTrackIndex(1);
      }
    },
    [trackIndex, total],
  );

  // Re-enable animation on the frame after the silent jump renders
  useEffect(() => {
    if (!animated && isSilentJump.current) {
      const raf = requestAnimationFrame(() => {
        isSilentJump.current = false;
        setAnimated(true);
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [animated]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') navigate(trackIndex - 1);
    else if (e.key === 'ArrowRight') navigate(trackIndex + 1);
  };

  if (total === 0) return <div />;

  return (
    <div
      className="relative outline-none"
      role="region"
      aria-roledescription="carousel"
      aria-label={t('highlightTitle')}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Carousel viewport */}
      <div className="overflow-hidden">
        <div
          onTransitionEnd={handleTransitionEnd}
          className="flex"
          style={{
            marginLeft: `calc(50% - ${CARD_WIDTH / 2}px)`,
            gap: `${CARD_GAP}px`,
            transform: `translateX(-${trackIndex * CARD_SLOT}px)`,
            transition: animated ? 'transform 300ms ease-in-out' : 'none',
          }}
        >
          {slides.map((kudo, idx) => (
            <div
              key={`${kudo.id}-${idx}`}
              className="flex-shrink-0"
              style={{
                opacity: idx === trackIndex ? 1 : 0.4,
                transition: 'opacity 300ms ease-in-out',
              }}
            >
              <HighlightKudoCard kudo={kudo} />
            </div>
          ))}
        </div>
      </div>

      {/* Nav button — prev (absolute left) */}
      <NavButton
        direction="prev"
        onClick={() => navigate(trackIndex - 1)}
        ariaLabel={t('carouselPrev')}
        className="absolute left-4 top-1/2 -translate-y-1/2"
      />

      {/* Nav button — next (absolute right) */}
      <NavButton
        direction="next"
        onClick={() => navigate(trackIndex + 1)}
        ariaLabel={t('carouselNext')}
        className="absolute right-4 top-1/2 -translate-y-1/2"
      />

      {/* Page indicator */}
      <div
        className="mt-6 flex items-baseline justify-center gap-1"
        aria-live="polite"
        aria-atomic="true"
      >
        <span className="font-montserrat text-3xl font-bold text-[#FFEA9E]">{realPage}</span>
        <span className="font-montserrat text-base text-white">/{total}</span>
      </div>
    </div>
  );
}

interface NavButtonProps {
  direction: 'prev' | 'next';
  onClick: () => void;
  ariaLabel: string;
  className?: string;
}

function NavButton({
  direction,
  onClick,
  ariaLabel,
  className,
}: NavButtonProps): React.ReactElement {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] transition-colors bg-black/10 cursor-pointer${className ? ` ${className}` : ''}`}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        stroke="white"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        {direction === 'prev' ? <path d="M10 3L5 8L10 13" /> : <path d="M6 3L11 8L6 13" />}
      </svg>
    </button>
  );
}
