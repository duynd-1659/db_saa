'use client';

import Image from 'next/image';
import { Link, usePathname } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export function Footer(): React.ReactElement {
  const t = useTranslations('homepage.footer');
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: t('aboutSaa') },
    { href: '/awards-information', label: t('awardsInfo') },
    { href: '/sun-kudos', label: t('sunKudos') },
    { href: '/general-standards', label: t('generalStandards') },
  ];

  return (
    <footer className="w-full border-t border-[#2E3940]">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between px-4 md:px-10 lg:px-20 py-10 max-w-[1440px] mx-auto">
        {/* Logo + Nav group */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-20">
          <Link href="/" aria-label="SAA 2025 Home" className="flex-shrink-0">
            <Image
              src="/assets/homepage/logos/saa-logo.png"
              alt="Sun Annual Awards 2025"
              width={52}
              height={48}
              className="object-contain"
            />
          </Link>

          <nav className="flex flex-wrap gap-x-10 gap-y-2" aria-label="Footer navigation">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={[
                    'font-montserrat text-[16px] font-bold leading-6 tracking-[0.15px] transition-colors duration-200',
                    'h-14 flex items-center px-4',
                    isActive
                      ? 'text-[var(--color-gold)] [text-shadow:0_4px_4px_rgba(0,0,0,0.25),0_0_6px_#FAE287]'
                      : 'text-white hover:bg-[rgba(255,234,158,0.10)] hover:[text-shadow:0_4px_4px_rgba(0,0,0,0.25),0_0_6px_#FAE287]',
                  ].join(' ')}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Copyright */}
        <p className="font-montserrat-alt font-bold text-[16px] leading-6 text-white whitespace-nowrap self-center md:self-auto">
          {t('copyright')}
        </p>
      </div>
    </footer>
  );
}
