import { useTranslations } from 'next-intl';
import { AWARD_CATEGORIES } from '@/config/award-categories';
import { AwardCard } from './AwardCard';

export function AwardsSection(): React.ReactElement {
  const t = useTranslations('homepage.awards');

  return (
    <section
      className="flex flex-col gap-16 px-4 md:px-10 lg:px-[var(--spacing-page-x)] max-w-[1440px] mx-auto py-16 md:py-24"
      aria-labelledby="awards-section-title"
    >
      {/* Section header */}
      <div className="flex flex-col gap-4 max-w-3xl">
        <p className="font-montserrat text-2xl font-bold text-white leading-8">
          {t('caption')}
        </p>
        <div className="h-px bg-[#2E3940] w-full" />
        <h2
          id="awards-section-title"
          className="font-montserrat font-bold text-[#FFEA9E] text-[57px] leading-[64px] tracking-[-0.25px]"
        >
          {t('title')}
        </h2>
      </div>

      {/* Award grid */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {AWARD_CATEGORIES.map((award) => (
          <AwardCard key={award.slug} award={award} />
        ))}
      </div>
    </section>
  );
}
