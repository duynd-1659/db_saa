'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useTranslations } from 'next-intl';
import type { KudoWithDetails, KudoHashtag } from '@/types/kudos';
import type { Department } from '@/types/department';
import { useKudosFilters } from '@/hooks/use-kudos-filters';
import { FilterChips } from './FilterChips';
import { KudosCarousel } from './KudosCarousel';

interface HighlightKudosProps {
  initialData: KudoWithDetails[];
  hashtags: KudoHashtag[];
  departments: Department[];
}

function HighlightKudosInner({
  initialData,
  hashtags,
  departments,
}: HighlightKudosProps): React.ReactElement {
  const t = useTranslations('kudosLiveBoard');
  const { filters } = useKudosFilters();
  const [kudos, setKudos] = useState<KudoWithDetails[]>(initialData);
  const [isLoading, setIsLoading] = useState(false);

  const fetchHighlights = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.hashtag_key) params.set('hashtag', filters.hashtag_key);
      if (filters.department_name) params.set('dept', filters.department_name);

      const query = params.toString();
      const res = await fetch(`/api/kudos/highlights${query ? `?${query}` : ''}`);
      if (!res.ok) throw new Error('Failed to fetch highlights');

      const data: KudoWithDetails[] = await res.json();
      setKudos(data);
    } catch (err) {
      console.error('[HighlightKudos] fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [filters.hashtag_key, filters.department_name]);

  // Re-fetch when filters change (skip initial render)
  useEffect(() => {
    if (filters.hashtag_key || filters.department_name) {
      fetchHighlights();
    } else {
      setKudos(initialData);
    }
  }, [filters.hashtag_key, filters.department_name, fetchHighlights, initialData]);

  return (
    <section
      className="py-20 max-w-[1440px] mx-auto w-full overflow-hidden"
      role="region"
      aria-label={t('aria.highlightSection')}
    >
      {/* B.1 Header — node 2940:13452 */}
      <div className="px-4 md:px-10 lg:px-[var(--spacing-page-x)] flex flex-col gap-4 mb-10">
        <p className="font-montserrat text-2xl font-bold leading-8 text-white">
          {t('sectionSubtitle')}
        </p>
        <hr className="border-0 h-px bg-[rgba(46,57,64,1)]" />
        <div className="flex flex-row items-center justify-between">
          <h2 className="font-montserrat text-[57px] font-bold leading-[64px] tracking-[-0.25px] text-[var(--color-gold)]">
            {t('highlightTitle')}
          </h2>
          <FilterChips hashtags={hashtags} departments={departments} />
        </div>
      </div>

      {/* Carousel — always rendered to preserve height; dimmed while loading */}
      <div
        className={`transition-opacity duration-200 ${isLoading ? 'pointer-events-none opacity-50' : 'opacity-100'}`}
        aria-busy={isLoading}
      >
        <KudosCarousel kudos={kudos} />
      </div>
    </section>
  );
}

export function HighlightKudos({
  initialData,
  hashtags,
  departments,
}: HighlightKudosProps): React.ReactElement {
  return (
    <Suspense>
      <HighlightKudosInner
        initialData={initialData}
        hashtags={hashtags}
        departments={departments}
      />
    </Suspense>
  );
}
