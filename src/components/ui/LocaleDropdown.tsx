'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useRouter, usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

const FLAG_ICONS: Record<string, string> = {
  vi: '/assets/login/icons/vn-flag.svg',
  en: '/assets/login/icons/en-flag.svg',
};

export function LocaleDropdown() {
  const t = useTranslations('locales');
  const tCommon = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false);
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  function handleSelect(newLocale: string) {
    const qs = searchParams.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { locale: newLocale });
    setIsOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={tCommon('languageSelector.ariaLabel')}
        className="flex h-14 w-[108px] cursor-pointer items-center justify-between gap-2 rounded-[4px] px-4 text-base font-bold text-white transition-colors hover:bg-white/10"
      >
        <Image src={FLAG_ICONS[locale] ?? FLAG_ICONS.vi} alt="" width={24} height={24} />
        <span>{t(locale as 'vi' | 'en')}</span>
        <Image
          src="/assets/login/icons/chevron-down.svg"
          alt=""
          width={24}
          height={24}
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <ul
          role="listbox"
          aria-label="Language options"
          className="absolute right-0 top-full mt-1 min-w-[108px] overflow-hidden rounded-[4px] bg-[#0B0F12] shadow-lg z-[60]"
        >
          {routing.locales.map((l) => (
            <li
              key={l}
              role="option"
              aria-selected={l === locale}
              onClick={() => handleSelect(l)}
              className={[
                'flex cursor-pointer items-center gap-2 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10',
                l === locale ? 'bg-[rgba(255,234,158,0.2)]' : '',
              ].join(' ')}
            >
              <Image src={FLAG_ICONS[l] ?? FLAG_ICONS.vi} alt="" width={24} height={24} />
              <span>{t(l as 'vi' | 'en')}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
