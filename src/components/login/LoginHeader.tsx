import Image from 'next/image';
import { LocaleDropdown } from '@/components/ui/LocaleDropdown';

export function LoginHeader() {
  return (
    <header
      className="fixed top-0 z-50 flex w-full items-center justify-between px-[144px] py-3"
      style={{ height: '80px', backgroundColor: 'var(--color-header-bg)' }}
    >
      <Image
        src="/assets/login/logos/saa-logo.png"
        alt="Sun Annual Awards 2025"
        width={52}
        height={56}
        priority
      />
      <LocaleDropdown />
    </header>
  );
}
