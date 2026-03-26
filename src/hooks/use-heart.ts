'use client';

import { useState, useCallback } from 'react';

interface UseHeartOptions {
  kudoId: string;
  initialLiked: boolean;
  initialCount: number;
}

interface UseHeartReturn {
  liked: boolean;
  count: number;
  toggle: () => void;
  isLoading: boolean;
}

export function useHeart({ kudoId, initialLiked, initialCount }: UseHeartOptions): UseHeartReturn {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [isLoading, setIsLoading] = useState(false);

  const toggle = useCallback(async () => {
    if (isLoading) return;

    // Optimistic update
    const prevLiked = liked;
    const prevCount = count;
    setLiked(!liked);
    setCount(liked ? count - 1 : count + 1);
    setIsLoading(true);

    try {
      const res = await fetch(`/api/kudos/${kudoId}/heart`, { method: 'POST' });

      if (!res.ok) throw new Error('Failed to toggle heart');

      const data: { liked: boolean; like_count: number } = await res.json();
      setLiked(data.liked);
      setCount(data.like_count);
    } catch {
      // Rollback on failure
      setLiked(prevLiked);
      setCount(prevCount);
      // TODO: Show error toast when toast system is integrated
      console.error('[useHeart] Failed to toggle heart');
    } finally {
      setIsLoading(false);
    }
  }, [kudoId, liked, count, isLoading]);

  return { liked, count, toggle, isLoading };
}
