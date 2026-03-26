'use client';

import { useTranslations } from 'next-intl';

interface AnonymousToggleProps {
  isAnonymous: boolean;
  anonymousName: string;
  onToggle: (val: boolean) => void;
  onNameChange: (name: string) => void;
  error?: string;
}

export function AnonymousToggle({
  isAnonymous,
  anonymousName,
  onToggle,
  onNameChange,
  error,
}: AnonymousToggleProps): React.ReactElement {
  const t = useTranslations('writeKudo');
  return (
    <div className="flex flex-col gap-4">
      <label className="inline-flex cursor-pointer items-center gap-3 self-start">
        <div className="relative h-5 w-5 shrink-0">
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={(e) => onToggle(e.target.checked)}
            className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
          <div
            className={`flex h-5 w-5 items-center justify-center rounded-[3px] border transition-colors ${isAnonymous ? 'border-[var(--color-border)]' : 'border-[var(--color-border)]'}`}
          >
            <div
              className={`h-3 w-3 rounded-[2px] transition-colors ${isAnonymous ? 'bg-[var(--color-border)]' : 'bg-transparent'}`}
            />
          </div>
        </div>
        <span className="font-montserrat text-base font-semibold text-[var(--color-page-bg)]">
          {t('anonymousLabel')}
        </span>
      </label>

      {isAnonymous && (
        <div className="flex flex-col gap-2">
          <label className="font-montserrat text-sm font-bold text-[var(--color-page-bg)]">
            {t('anonymousNameLabel')} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={anonymousName}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder={t('anonymousNamePlaceholder')}
            className={`h-14 w-full rounded-lg border bg-[var(--color-input-bg)] px-6 py-4 font-montserrat text-base text-[var(--color-page-bg)] placeholder:text-[var(--color-hint-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)] ${
              error ? 'border-red-500' : 'border-[var(--color-border)]'
            }`}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      )}
    </div>
  );
}
