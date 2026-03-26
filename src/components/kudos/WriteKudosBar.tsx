'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useWriteKudoContext } from '@/components/kudos/write-kudo/WriteKudoProvider';

export function WriteKudosBar(): React.ReactElement {
  const t = useTranslations('kudosLiveBoard');
  const { openWriteKudo } = useWriteKudoContext();

  return (
    <button
      type="button"
      onClick={() => openWriteKudo()}
      className="flex w-full max-w-[738px] cursor-pointer items-center gap-3 rounded-full border border-[var(--color-border)] bg-white/5 px-6 py-4 text-left transition-colors hover:bg-white/10"
    >
      <Image
        src="/assets/icons/pencil.svg"
        alt=""
        width={20}
        height={20}
        aria-hidden="true"
        className="flex-shrink-0 opacity-60"
      />
      <span className="font-montserrat text-sm text-[var(--color-text-muted)]">
        {t('writeBarPlaceholder')}
      </span>
    </button>
  );
}
