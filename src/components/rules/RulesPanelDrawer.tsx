'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useWriteKudoContext } from '@/components/kudos/write-kudo/WriteKudoProvider';

interface HeroTier {
  id: string;
  icon: string;
  iconWidth: number;
  iconHeight: number;
  conditionKey: string;
  descriptionKey: string;
}

interface CollectibleBadge {
  id: string;
  icon: string;
  nameKey: string;
}

const HERO_TIERS: HeroTier[] = [
  {
    id: 'new',
    icon: '/assets/rules/icons/hero-new.png',
    iconWidth: 109,
    iconHeight: 19,
    conditionKey: 'heroNew.condition',
    descriptionKey: 'heroNew.description',
  },
  {
    id: 'rising',
    icon: '/assets/rules/icons/hero-rising.png',
    iconWidth: 109,
    iconHeight: 19,
    conditionKey: 'heroRising.condition',
    descriptionKey: 'heroRising.description',
  },
  {
    id: 'super',
    icon: '/assets/rules/icons/hero-super.png',
    iconWidth: 109,
    iconHeight: 19,
    conditionKey: 'heroSuper.condition',
    descriptionKey: 'heroSuper.description',
  },
  {
    id: 'legend',
    icon: '/assets/rules/icons/hero-legend.png',
    iconWidth: 109,
    iconHeight: 19,
    conditionKey: 'heroLegend.condition',
    descriptionKey: 'heroLegend.description',
  },
];

const COLLECTIBLE_BADGES: CollectibleBadge[] = [
  { id: 'revival', icon: '/assets/rules/icons/badge-revival.svg', nameKey: 'badgeRevival' },
  {
    id: 'touch-of-light',
    icon: '/assets/rules/icons/badge-touch-of-light.svg',
    nameKey: 'badgeTouchOfLight',
  },
  { id: 'stay-gold', icon: '/assets/rules/icons/badge-stay-gold.svg', nameKey: 'badgeStayGold' },
  {
    id: 'flow-to-horizon',
    icon: '/assets/rules/icons/badge-flow-to-horizon.svg',
    nameKey: 'badgeFlowToHorizon',
  },
  {
    id: 'beyond-the-boundary',
    icon: '/assets/rules/icons/badge-beyond-the-boundary.svg',
    nameKey: 'badgeBeyondTheBoundary',
  },
  {
    id: 'root-further',
    icon: '/assets/rules/icons/badge-root-further.svg',
    nameKey: 'badgeRootFurther',
  },
];

const BADGE_ROW_1 = COLLECTIBLE_BADGES.slice(0, 3);
const BADGE_ROW_2 = COLLECTIBLE_BADGES.slice(3, 6);

interface RulesPanelDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RulesPanelDrawer({
  isOpen,
  onClose,
}: RulesPanelDrawerProps): React.ReactElement | null {
  const t = useTranslations('common.rules');
  const { openWriteKudo } = useWriteKudoContext();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<Element | null>(null);
  const clickOnceRef = useRef(false);
  const [isClosing, setIsClosing] = useState(false);

  // Capture trigger element and move focus to close button on open
  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement;
      closeButtonRef.current?.focus();
    }
  }, [isOpen]);

  // Return focus to trigger on close
  useEffect(() => {
    if (!isOpen && triggerRef.current) {
      (triggerRef.current as HTMLElement).focus?.();
    }
  }, [isOpen]);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e: KeyboardEvent): void {
      if (e.key === 'Escape') handleClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  function handleClose(): void {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 250);
  }

  function handleVietKudos(): void {
    if (clickOnceRef.current) return;
    clickOnceRef.current = true;
    openWriteKudo();
    handleClose();
    setTimeout(() => {
      clickOnceRef.current = false;
    }, 300);
  }

  if (!isOpen && !isClosing) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[rgba(0,16,26,0.8)] z-[59]"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t('ariaLabel')}
        className={[
          'fixed top-0 right-0 z-[60]',
          'w-full md:w-[480px] lg:w-[553px]',
          'h-screen bg-[#00070C]',
          'flex flex-col justify-between',
          'shadow-[0_0_40px_rgba(0,0,0,0.5)]',
          'overflow-hidden',
          isClosing ? 'animate-rules-slide-out' : 'animate-rules-slide-in',
        ].join(' ')}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Scrollable content area */}
        <div className="flex flex-col gap-6 flex-1 overflow-y-auto px-5 pt-6 pb-0 md:px-8 lg:px-10">
          {/* Title */}
          <h2 className="font-montserrat font-bold text-[32px] leading-10 lg:text-[45px] lg:leading-[52px] text-[#FFEA9E]">
            {t('title')}
          </h2>

          {/* Section: Người nhận KUDOS */}
          <section className="flex flex-col gap-4">
            <h3 className="font-montserrat font-bold text-[18px] leading-6 lg:text-[22px] lg:leading-7 text-[#FFEA9E]">
              {t('nguoiNhanHeading')}
            </h3>
            <p className="font-montserrat font-bold text-base leading-6 text-white tracking-[0.5px] text-justify">
              {t('nguoiNhanBody')}
            </p>

            {/* Hero badge rows */}
            <div className="flex flex-col gap-4">
              {HERO_TIERS.map((tier) => (
                <div key={tier.id} className="flex flex-col gap-1 w-full">
                  {/* Row 1: Badge pill + Condition */}
                  <div className="flex flex-row items-center gap-4">
                    <div className="flex-shrink-0">
                      <Image
                        src={tier.icon}
                        alt={t(tier.conditionKey)}
                        width={tier.iconWidth}
                        height={tier.iconHeight}
                        className="h-auto"
                      />
                    </div>
                    <span className="font-montserrat font-bold text-base leading-6 text-white tracking-[0.5px]">
                      {t(tier.conditionKey)}
                    </span>
                  </div>
                  {/* Row 2: Description */}
                  <span className="font-montserrat font-bold text-sm leading-5 text-white tracking-[0.1px]">
                    {t(tier.descriptionKey)}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Người gửi KUDOS */}
          <section className="flex flex-col gap-4">
            <h3 className="font-montserrat font-bold text-[18px] leading-6 lg:text-[22px] lg:leading-7 text-[#FFEA9E]">
              {t('nguoiGuiHeading')}
            </h3>
            <p className="font-montserrat font-bold text-base leading-6 text-white tracking-[0.5px] text-justify">
              {t('nguoiGuiBody')}
            </p>

            {/* Collectible badge grid */}
            <div className="flex flex-col gap-4 px-2 md:px-4 lg:px-6">
              {[BADGE_ROW_1, BADGE_ROW_2].map((row, rowIdx) => (
                <div key={rowIdx} className="flex flex-row justify-between w-full max-w-[377px]">
                  {row.map((badge) => (
                    <div key={badge.id} className="flex flex-col items-center gap-2 w-20">
                      <div className="w-16 h-16 rounded-full border-2 border-white overflow-hidden flex-shrink-0">
                        <Image
                          src={badge.icon}
                          alt={t(badge.nameKey)}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="font-montserrat font-bold text-[12px] leading-4 text-white text-center tracking-[0.5px] w-full">
                        {t(badge.nameKey)}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <p className="font-montserrat font-bold text-base leading-6 text-white tracking-[0.5px] text-justify">
              {t('nguoiGuiSummary')}
            </p>
          </section>

          {/* Section: Kudos Quốc Dân */}
          <section className="flex flex-col gap-4 pb-6">
            <h3 className="font-montserrat font-bold text-2xl leading-8 text-[#FFEA9E]">
              {t('kudosQuocDanHeading')}
            </h3>
            <p className="font-montserrat font-bold text-base leading-6 text-white tracking-[0.5px] text-justify">
              {t('kudosQuocDanBody')}
            </p>
          </section>
        </div>

        {/* Footer buttons */}
        <div className="flex flex-row gap-4 items-center pb-8 px-5 pt-8 lg:pt-10 md:px-8 lg:px-10 lg:pb-10 flex-shrink-0 bg-[#00070C]">
          {/* Button B.1 — Đóng */}
          <button
            ref={closeButtonRef}
            onClick={handleClose}
            aria-label={t('btnClose')}
            className={[
              'flex items-center gap-2 p-4',
              'border border-[#998C5F]',
              'bg-[rgba(255,234,158,0.10)]',
              'rounded-[4px] cursor-pointer',
              'hover:bg-[rgba(255,234,158,0.15)]',
              'active:bg-[rgba(255,234,158,0.20)]',
              'focus-visible:outline-2 focus-visible:outline-[#998C5F] focus-visible:outline-offset-2',
              'transition-colors duration-150',
              'whitespace-nowrap',
            ].join(' ')}
          >
            <Image
              src="/assets/fab/icons/fab-close.svg"
              alt=""
              width={24}
              height={24}
              aria-hidden="true"
            />
            <span className="font-montserrat font-bold text-base leading-6 text-white tracking-[0.5px]">
              {t('btnCloseLabel')}
            </span>
          </button>

          {/* Button B.2 — Viết KUDOS */}
          <button
            onClick={handleVietKudos}
            aria-label={t('btnVietKudos')}
            className={[
              'flex items-center justify-center gap-2',
              'flex-1 h-14',
              'p-4 bg-[#FFEA9E]',
              'rounded-[4px] cursor-pointer',
              'hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:brightness-105',
              'active:brightness-95',
              'focus-visible:outline-2 focus-visible:outline-[#FFEA9E] focus-visible:outline-offset-2',
              'transition-all duration-150',
              'whitespace-nowrap',
            ].join(' ')}
          >
            <Image
              src="/assets/fab/icons/fab-pen.svg"
              alt=""
              width={24}
              height={24}
              aria-hidden="true"
            />
            <span className="font-montserrat font-bold text-base leading-6 text-[#00101A] tracking-[0.5px]">
              {t('btnVietKudosLabel')}
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
