'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useWriteKudoContext } from '@/components/kudos/write-kudo/WriteKudoProvider';
import { useRulesPanelContext } from '@/components/rules/RulesPanelProvider';

export function FabWidget(): React.ReactElement {
  const [isExpanded, setIsExpanded] = useState(false);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const clickOnceRef = useRef(false);
  const t = useTranslations('common.fab');
  const { openWriteKudo } = useWriteKudoContext();
  const { openPanel } = useRulesPanelContext();

  // Escape key collapses the FAB (US1 AC2)
  useEffect(() => {
    if (!isExpanded) return;
    function handleKey(e: KeyboardEvent): void {
      if (e.key === 'Escape') setIsExpanded(false);
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isExpanded]);

  // Move focus to cancel button when expanded (accessibility)
  useEffect(() => {
    if (isExpanded) {
      cancelButtonRef.current?.focus();
    }
  }, [isExpanded]);

  function handleDebounced(action: () => void): void {
    if (clickOnceRef.current) return;
    clickOnceRef.current = true;
    action();
    setTimeout(() => {
      clickOnceRef.current = false;
    }, 300);
  }

  function handleVietKudos(): void {
    handleDebounced(() => {
      openWriteKudo();
      setIsExpanded(false);
    });
  }

  function handleRules(): void {
    handleDebounced(() => {
      openPanel();
      setIsExpanded(false);
    });
  }

  return (
    <>
      {/* Collapsed trigger button */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          aria-label={t('ariaLabel')}
          className={[
            'fixed bottom-4 right-4 lg:bottom-8 lg:right-8 z-40',
            'w-[105px] h-[64px] rounded-full',
            'bg-[var(--color-gold)]',
            'flex items-center justify-center gap-1',
            'cursor-pointer',
            'hover:brightness-105 hover:shadow-lg',
            'transition-all duration-200 active:scale-[0.97]',
            'shadow-[0_4px_16px_rgba(255,234,158,0.3)]',
          ].join(' ')}
        >
          <Image
            src="/assets/icons/pencil.svg"
            alt=""
            width={20}
            height={20}
            aria-hidden="true"
            className="flex-shrink-0 brightness-0"
          />
          <span
            className="text-[#00101a] font-montserrat font-bold text-base leading-none"
            aria-hidden="true"
          >
            /
          </span>
          <Image
            src="/assets/icons/saa-widget.svg"
            alt=""
            width={20}
            height={20}
            aria-hidden="true"
            className="flex-shrink-0"
          />
        </button>
      )}

      {/* Expanded FAB panel */}
      {isExpanded && (
        <div
          role="region"
          aria-label={t('expandedRegionLabel')}
          className={[
            'fixed z-40',
            'bottom-4 right-4',
            'md:bottom-6 md:right-6',
            'lg:bottom-8 lg:right-8',
            'flex flex-col items-end gap-5',
          ].join(' ')}
        >
          {/* Button A — Thể lệ */}
          <button
            type="button"
            onClick={handleRules}
            aria-label={t('rulesLabel')}
            className={[
              'flex items-center gap-2 px-4',
              'w-[149px] h-16',
              'bg-[var(--color-fab-action-bg)]',
              'rounded-[var(--radius-fab-action)]',
              'cursor-pointer',
              'hover:shadow-[var(--shadow-fab-hover)] hover:brightness-105',
              'active:brightness-95',
              'focus-visible:outline-2 focus-visible:outline-[var(--color-fab-action-bg)] focus-visible:outline-offset-2',
              'transition-all duration-150',
              'animate-fab-in [animation-delay:100ms]',
            ].join(' ')}
          >
            <Image
              src="/assets/fab/icons/fab-logo.svg"
              alt=""
              width={24}
              height={24}
              aria-hidden="true"
              className="flex-shrink-0"
            />
            <span className="font-montserrat font-bold text-lg lg:text-2xl leading-8 text-[var(--color-fab-label)] whitespace-nowrap">
              {t('rulesLabel')}
            </span>
          </button>

          {/* Button B — Viết KUDOS */}
          <button
            onClick={handleVietKudos}
            aria-label={t('vietKudosLabel')}
            className={[
              'flex items-center gap-2 px-4',
              'min-w-[214px] h-16',
              'bg-[var(--color-fab-action-bg)]',
              'rounded-[var(--radius-fab-action)]',
              'cursor-pointer',
              'hover:shadow-[var(--shadow-fab-hover)] hover:brightness-105',
              'active:brightness-95',
              'focus-visible:outline-2 focus-visible:outline-[var(--color-fab-action-bg)] focus-visible:outline-offset-2',
              'transition-all duration-150',
              'animate-fab-in [animation-delay:50ms]',
            ].join(' ')}
          >
            <Image
              src="/assets/fab/icons/fab-pen.svg"
              alt=""
              width={24}
              height={24}
              aria-hidden="true"
              className="flex-shrink-0"
            />
            <span className="font-montserrat font-bold text-lg lg:text-2xl leading-8 text-[var(--color-fab-label)] whitespace-nowrap">
              {t('vietKudosLabel')}
            </span>
          </button>

          {/* Button C — Huỷ */}
          <button
            ref={cancelButtonRef}
            onClick={() => setIsExpanded(false)}
            aria-label={t('huyLabel')}
            className={[
              'flex items-center justify-center',
              'w-14 h-14',
              'bg-[var(--color-fab-cancel-bg)]',
              'rounded-full',
              'cursor-pointer',
              'hover:bg-[#b91c1c]',
              'active:bg-[#991b1b]',
              'focus-visible:outline-2 focus-visible:outline-[var(--color-fab-cancel-bg)] focus-visible:outline-offset-2',
              'transition-all duration-150',
              'animate-fab-in [animation-delay:0ms]',
            ].join(' ')}
          >
            <Image
              src="/assets/fab/icons/fab-close.svg"
              alt=""
              width={24}
              height={24}
              aria-hidden="true"
            />
          </button>
        </div>
      )}
    </>
  );
}
