'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { TargetIcon } from './TargetIcon';
import type { AwardCategory } from '@/types/homepage';

interface AwardsNavMenuProps {
  awards: AwardCategory[];
}

export function AwardsNavMenu({ awards }: AwardsNavMenuProps): React.ReactElement {
  const t = useTranslations('awardsInformation');
  const [activeSlug, setActiveSlug] = useState(awards[0]?.slug ?? '');
  const observerRef = useRef<IntersectionObserver | null>(null);
  const isClickScrolling = useRef(false);

  useEffect(() => {
    const sections = awards
      .map((a) => document.getElementById(a.slug))
      .filter(Boolean) as HTMLElement[];

    if (sections.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (isClickScrolling.current) return;

        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSlug(entry.target.id);
            break;
          }
        }
      },
      {
        rootMargin: '-100px 0px -60% 0px',
        threshold: 0,
      },
    );

    for (const section of sections) {
      observerRef.current.observe(section);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [awards]);

  // Deep-link: scroll to hash on mount (Phase 5 / T014)
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;

    const validSlugs = awards.map((a) => a.slug);
    if (!validSlugs.includes(hash)) return;

    // Small delay to allow DOM to render
    const timer = setTimeout(() => {
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        setActiveSlug(hash);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [awards]);

  function handleClick(slug: string): void {
    const el = document.getElementById(slug);
    if (!el) return;

    isClickScrolling.current = true;
    setActiveSlug(slug);

    el.scrollIntoView({ behavior: 'smooth' });

    // Update URL hash without page jump
    window.history.replaceState(null, '', `#${slug}`);

    // Re-enable observer after scroll completes
    setTimeout(() => {
      isClickScrolling.current = false;
    }, 800);
  }

  return (
    <nav
      className="sticky top-24 flex flex-col gap-4 w-[178px]"
      role="navigation"
      aria-label={t('nav.ariaLabel')}
    >
      {awards.map((award) => {
        const isActive = activeSlug === award.slug;
        return (
          <button
            key={award.slug}
            onClick={() => handleClick(award.slug)}
            aria-current={isActive ? 'true' : undefined}
            className={[
              'flex items-center gap-1 text-left p-4 font-montserrat text-sm font-bold transition-colors border-b',
              'min-h-[44px]',
              isActive
                ? 'text-[var(--color-gold)] border-b-[var(--color-gold)] [text-shadow:0_4px_4px_rgba(0,0,0,0.25),0_0_6px_#FAE287]'
                : 'text-white border-b-transparent hover:text-[var(--color-gold)] hover:border-b-[var(--color-gold)] cursor-pointer',
            ].join(' ')}
          >
            <TargetIcon active={isActive} />
            {award.name}
          </button>
        );
      })}
    </nav>
  );
}
