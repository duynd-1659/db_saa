import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { RedirectIcon } from './icons/RedicrectIcon';

export function KudosPromo(): React.ReactElement {
  const t = useTranslations('homepage.kudos');

  return (
    <section
      className="px-4 md:px-10 lg:px-[var(--spacing-page-x)] max-w-[1440px] mx-auto w-full pb-10 md:pb-20"
      aria-labelledby="kudos-section-title"
    >
      <div
        className="relative w-full min-h-[500px] bg-[#0F0F0F] rounded-2xl overflow-hidden flex items-center"
        style={{
          backgroundImage: 'url(/assets/homepage/images/kudos-illustration.png)',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right center',
          backgroundSize: 'auto 100%',
        }}
      >
        {/* Left content */}
        <div className="relative z-10 flex flex-col gap-8 mx-5 md:mr-0 md:ml-[65px] w-[470px]">
          <div className="flex flex-col gap-4">
            <p className="text-[24px] font-bold text-white leading-8">{t('label')}</p>
            <h2
              id="kudos-section-title"
              className="font-montserrat-alt font-bold text-[var(--color-gold)] text-[57px] leading-[64px] tracking-[-0.25px]"
            >
              {t('title')}
            </h2>
            <p className="font-montserrat text-[16px] font-bold text-white leading-6 tracking-[0.5px] text-justify whitespace-pre-wrap">
              {t('description')}
            </p>
          </div>

          <Link
            href="/sun-kudos"
            className="inline-flex items-center gap-2 self-start bg-[var(--color-gold)] text-[#00101A] font-bold text-base px-4 h-[56px] rounded-[4px] hover:opacity-90 transition-opacity"
          >
            {t('detailLink')}
            <RedirectIcon />
          </Link>
        </div>

        {/* Right: KUDOS logo (icon + wordmark) */}
        <div className="hidden lg:block absolute right-[65px] top-1/2 -translate-y-1/2">
          <Image
            src="/assets/kudos/logos/saa-kudos-logo.svg"
            alt="Sun* Kudos"
            width={374}
            height={72}
          />
        </div>
      </div>
    </section>
  );
}
