'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useHeart } from '@/hooks/use-heart';
import { LinkIcon } from '@/components/ui/icons/LinkIcon';
import { HeartIcon } from '@/components/ui/icons/HeartIcon';

interface KudoCardActionsProps {
  kudoId: string;
  initialLiked: boolean;
  initialLikeCount: number;
}

export function KudoCardActions({
  kudoId,
  initialLiked,
  initialLikeCount,
}: KudoCardActionsProps): React.ReactElement {
  const t = useTranslations('kudosLiveBoard');
  const { liked, count, toggle, isLoading } = useHeart({
    kudoId,
    initialLiked,
    initialCount: initialLikeCount,
  });
  const [copied, setCopied] = useState(false);

  const handleCopyLink = useCallback(async () => {
    const url = `${window.location.origin}/sun-kudos?kudo=${kudoId}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error('[KudoCardActions] Failed to copy link');
    }
  }, [kudoId]);

  return (
    <div className="flex items-center justify-between">
      {/* Hearts — LEFT */}
      <button
        type="button"
        onClick={toggle}
        disabled={isLoading}
        aria-label={liked ? t('heartAriaLabelActive') : t('heartAriaLabel')}
        className=" cursor-pointer flex min-h-[44px] min-w-[44px] items-center gap-2 rounded-full px-3 py-2 hover:bg-black/5 disabled:opacity-50"
      >
        <span
          className="font-montserrat text-2xl font-bold text-[rgba(0,16,26,1)]"
          aria-live="polite"
        >
          {count.toLocaleString()}
        </span>
        <HeartIcon liked={liked} />
      </button>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Copy Link */}
        <button
          type="button"
          onClick={handleCopyLink}
          aria-label={t('copyLink')}
          className="cursor-pointer relative flex min-h-[44px] min-w-[44px] items-center gap-1 rounded px-4 py-2 hover:bg-black/5"
        >
          <span className="font-montserrat text-base font-bold text-[rgba(0,16,26,1)]">
            {t('copyLink')}
          </span>
          <LinkIcon />
          {copied && (
            <span
              className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black/80 px-2 py-1 font-montserrat text-xs text-white"
              role="status"
            >
              {t('linkCopied')}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
