'use client';

import { useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import type { KudoFilters } from '@/types/kudos';

interface UseKudosFiltersReturn {
  filters: Pick<KudoFilters, 'hashtag_key' | 'department_name'>;
  setHashtag: (key: string | undefined) => void;
  setDepartment: (name: string | undefined) => void;
  clearFilters: () => void;
}

export function useKudosFilters(): UseKudosFiltersReturn {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const filters: Pick<KudoFilters, 'hashtag_key' | 'department_name'> = {
    hashtag_key: searchParams.get('hashtag') ?? undefined,
    department_name: searchParams.get('dept') ?? undefined,
  };

  const updateParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(updates)) {
        if (value === undefined) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }

      const query = params.toString();
      router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [searchParams, router, pathname],
  );

  const setHashtag = useCallback(
    (key: string | undefined) => updateParams({ hashtag: key }),
    [updateParams],
  );

  const setDepartment = useCallback(
    (name: string | undefined) => updateParams({ dept: name }),
    [updateParams],
  );

  const clearFilters = useCallback(
    () => updateParams({ hashtag: undefined, dept: undefined }),
    [updateParams],
  );

  return { filters, setHashtag, setDepartment, clearFilters };
}
