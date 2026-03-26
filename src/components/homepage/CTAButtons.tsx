import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { RedirectIcon } from '@/components/ui/icons/RedicrectIcon';

export function CTAButtons(): React.ReactElement {
  const t = useTranslations('homepage.hero');

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:gap-10">
      <Link
        href="/awards-information"
        className={[
          'inline-flex items-center justify-center gap-2',
          'px-8 py-4 min-h-[44px] min-w-[44px]',
          'font-montserrat font-bold text-sm tracking-widest',
          'bg-[var(--color-gold)] text-[#00101a]',
          'rounded-sm hover:brightness-105 hover:shadow-md',
          'transition-all duration-200 active:scale-[0.98]',
        ].join(' ')}
      >
        {t('ctaAboutAwards')}
        <RedirectIcon aria-hidden="true" />
      </Link>
      <Link
        href="/sun-kudos"
        className={[
          'inline-flex items-center justify-center gap-2',
          'px-8 py-4 min-h-[44px] min-w-[44px]',
          'font-montserrat font-bold text-sm tracking-widest',
          'border border-[var(--color-border)] text-white',
          'rounded-sm hover:bg-white/10',
          'transition-all duration-200 active:scale-[0.98]',
        ].join(' ')}
      >
        {t('ctaAboutKudos')}
        <RedirectIcon aria-hidden="true" />
      </Link>
    </div>
  );
}
