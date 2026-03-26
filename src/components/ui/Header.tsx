'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Link, usePathname } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { NavLink } from './NavLink';
import { DropdownProfile } from './DropdownProfile';
import { LocaleDropdown } from '@/components/ui/LocaleDropdown';

interface HeaderProps {
  isAdmin?: boolean;
  avatarUrl?: string | null;
  fullName?: string | null;
}

export function Header({ isAdmin = false, avatarUrl, fullName }: HeaderProps): React.ReactElement {
  const [profileOpen, setProfileOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations('homepage');

  const navLinks = [
    { href: '/', label: t('nav.aboutSaa') },
    { href: '/awards-information', label: t('nav.awardsInfo') },
    { href: '/sun-kudos', label: t('nav.sunKudos') },
  ];

  return (
    <header
      className="fixed top-0 z-50 w-full backdrop-blur-md h-[var(--header-height)]"
      style={{ backgroundColor: 'var(--color-homepage-header-bg)' }}
    >
      <div className="flex items-center justify-between px-4 md:px-10 lg:px-[var(--spacing-page-x)] py-3 max-w-[1440px] mx-auto">
        {/* Logo */}
        <Link href="/" aria-label={t('aria.logo')} className="flex-shrink-0">
          <Image
            src="/assets/homepage/logos/saa-logo.png"
            alt={t('aria.logo')}
            width={52}
            height={48}
            className="object-contain"
            priority
          />
        </Link>

        {/* Nav links — hidden on mobile */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-16" aria-label="Main navigation">
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              label={link.label}
              isActive={pathname === link.href}
            />
          ))}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Bell button */}
          <button
            aria-label={t('aria.bell')}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-transparent hover:bg-white/10 transition-colors"
          >
            <Image src="/assets/icons/bell.svg" alt="" width={20} height={20} aria-hidden="true" />
          </button>

          {/* Language selector */}
          <LocaleDropdown />

          {/* Avatar / Profile */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen((prev) => !prev)}
              aria-label={fullName ?? t('aria.avatar')}
              aria-expanded={profileOpen}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-[var(--color-border)] bg-transparent hover:bg-white/10 transition-colors overflow-hidden cursor-pointer"
            >
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={fullName ?? t('aria.avatar')}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <Image
                  src="/assets/icons/avatar.svg"
                  alt=""
                  width={20}
                  height={20}
                  aria-hidden="true"
                />
              )}
            </button>
            <DropdownProfile
              isOpen={profileOpen}
              isAdmin={isAdmin}
              onClose={() => setProfileOpen(false)}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
