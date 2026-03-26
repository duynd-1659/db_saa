'use client';

import { useState, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import type { KudoWithDetails, PaginatedKudos } from '@/types/kudos';
import { KudoCard } from './KudoCard';

interface AllKudosFeedProps {
  initialData: PaginatedKudos;
}

export function AllKudosFeed({ initialData }: AllKudosFeedProps): React.ReactElement {
  const t = useTranslations('kudosLiveBoard');
  const [kudos, setKudos] = useState<KudoWithDetails[]>(initialData.data);
  const [page, setPage] = useState(initialData.page);
  const [hasMore, setHasMore] = useState(initialData.has_more);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  // Sync state when server re-renders with fresh data (e.g. after router.refresh())
  useEffect(() => {
    setKudos(initialData.data);
    setPage(initialData.page);
    setHasMore(initialData.has_more);
  }, [initialData]);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    setError(false);
    try {
      const nextPage = page + 1;
      const res = await fetch(`/api/kudos?page=${nextPage}&limit=20`);
      if (!res.ok) throw new Error('Failed to fetch');

      const data: PaginatedKudos = await res.json();
      setKudos((prev) => [...prev, ...data.data]);
      setPage(data.page);
      setHasMore(data.has_more);
    } catch (err) {
      console.error('[AllKudosFeed] loadMore error:', err);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, page]);

  if (kudos.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-20">
        <p className="font-montserrat text-base text-[var(--color-text-muted)]">{t('emptyFeed')}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {kudos.map((kudo) => (
        <KudoCard key={kudo.id} kudo={kudo} />
      ))}

      {error && (
        <div className="flex flex-col items-center gap-2 py-4">
          <p className="font-montserrat text-sm text-red-400">{t('errorFeed')}</p>
          <button
            type="button"
            onClick={loadMore}
            className="rounded-full border border-[var(--color-border)] px-6 py-2 font-montserrat text-sm font-medium text-white transition-colors hover:bg-white/10"
          >
            {t('retry')}
          </button>
        </div>
      )}

      {hasMore && !error && (
        <button
          type="button"
          onClick={loadMore}
          disabled={isLoading}
          className="mx-auto rounded-full border border-[var(--color-border)] px-8 py-3 font-montserrat text-sm font-medium text-white transition-colors hover:bg-white/10 disabled:opacity-50"
        >
          {isLoading ? t('loading') : t('loadMore')}
        </button>
      )}
    </div>
  );
}
