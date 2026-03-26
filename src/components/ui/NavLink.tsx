import { Link } from '@/i18n/navigation';

interface NavLinkProps {
  href: string;
  label: string;
  isActive?: boolean;
}

export function NavLink({ href, label, isActive = false }: NavLinkProps): React.ReactElement {
  return (
    <Link
      href={href}
      className={[
        'font-montserrat text-[14px] font-bold leading-5 tracking-[0.1px] transition-colors duration-200',
        'h-[52px] flex items-center px-4',
        'hover:text-white/80',
        isActive
          ? 'text-[var(--color-gold)] border-b border-[var(--color-gold)] [text-shadow:0_4px_4px_rgba(0,0,0,0.25),0_0_6px_#FAE287]'
          : 'text-white',
      ].join(' ')}
    >
      {label}
    </Link>
  );
}
