'use client';

import { useTranslations } from 'next-intl';

interface OpenSecretBoxButtonProps {
  unopenedCount: number;
}

export function OpenSecretBoxButton({ unopenedCount }: OpenSecretBoxButtonProps): React.ReactElement {
  const t = useTranslations('kudosLiveBoard');

  const handleClick = () => {
    // TODO: Open Secret Box modal when modal spec is integrated
    console.log('Open Secret Box modal');
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={unopenedCount === 0}
      className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#FFEA9E] px-4 py-3 font-montserrat text-sm font-bold text-[var(--color-bg)] transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {t('openSecretBox')}
      <span className="rounded bg-black/10 px-1.5 py-0.5 text-xs font-bold">
        {String(unopenedCount).padStart(2, '0')}
      </span>
    </button>
  );
}
