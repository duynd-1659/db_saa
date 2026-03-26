import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import type { AwardCategory } from '@/types/homepage';

interface AwardCardProps {
  award: AwardCategory;
  reversed?: boolean;
}

export function AwardCard({ award, reversed = false }: AwardCardProps): React.ReactElement {
  const t = useTranslations('awardsInformation');
  const locale = useLocale();
  const description = locale === 'en' ? (award.description_en ?? award.description) : award.description;
  const unitType = locale === 'en' ? (award.unit_type_en ?? award.unit_type) : award.unit_type;
  const isSignature = award.slug === 'signature-2025-creator';

  return (
    <article
      id={award.slug}
      className={`flex flex-col gap-8 md:gap-10 scroll-mt-24 ${reversed ? 'md:flex-row-reverse' : 'md:flex-row'}`}
    >
      {/* Award image */}
      <div className="flex-shrink-0 w-full md:w-[336px]">
        <div className="relative aspect-square">
          <Image
            src={award.image_url}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 336px"
          />
          <Image
            src={award.name_image_url}
            alt={award.name}
            width={award.name_image_width}
            height={award.name_image_height}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-contain"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-6 flex-1">
        {/* Title + description */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Image
              src="/assets/icons/target.png"
              alt=""
              width={20}
              height={20}
              aria-hidden="true"
              className="flex-shrink-0"
            />
            <h2 className="font-montserrat font-bold text-xl md:text-2xl text-[var(--color-gold)]">
              {award.name}
            </h2>
          </div>
          <p className="font-montserrat text-base font-normal text-white leading-relaxed">
            {description}
          </p>
        </div>

        {/* Divider */}
        <div className="h-px w-full" style={{ backgroundColor: 'var(--color-section-divider)' }} />

        {/* Award count */}
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <div className="flex items-center gap-2">
            <Image
              src="/assets/icons/diamond.png"
              alt=""
              width={20}
              height={20}
              aria-hidden="true"
              className="flex-shrink-0"
            />
            <span className="font-montserrat text-sm font-bold text-[var(--color-gold)]">
              {t('awardCountLabel')}
            </span>
          </div>
          <span className="font-montserrat font-bold text-2xl text-white">
            {String(award.award_count).padStart(2, '0')}
          </span>
          <span className="font-montserrat text-sm font-bold text-white">
            {unitType}
          </span>
        </div>

        {/* Divider */}
        <div className="h-px w-full" style={{ backgroundColor: 'var(--color-section-divider)' }} />

        {/* Award value */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Image
              src="/assets/icons/license.svg"
              alt=""
              width={20}
              height={20}
              aria-hidden="true"
              className="flex-shrink-0"
            />
            <span className="font-montserrat text-sm font-bold text-[var(--color-gold)]">
              {t('awardValueLabel')}
            </span>
          </div>
          <div className="flex items-baseline gap-3 ml-7">
            <span className="font-montserrat font-bold text-2xl text-white">
              {award.award_value_vnd}
            </span>
            <span className="font-montserrat text-sm font-bold text-white">
              {isSignature ? t('perIndividual') : t('perAward')}
            </span>
          </div>
        </div>

        {/* Signature special: second prize value */}
        {isSignature && award.special_note && (
          <>
            <div className="flex items-center gap-3">
              <span className="font-montserrat text-sm font-medium text-[var(--color-text-muted)]">
                {t('or')}
              </span>
              <div
                className="h-px flex-1"
                style={{ backgroundColor: 'var(--color-section-divider)' }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Image
                  src="/assets/icons/license.svg"
                  alt=""
                  width={20}
                  height={20}
                  aria-hidden="true"
                  className="flex-shrink-0"
                />
                <span className="font-montserrat text-sm font-bold text-[var(--color-gold)]">
                  {t('awardValueLabel')}
                </span>
              </div>
              <div className="flex items-baseline gap-3 ml-7">
                <span className="font-montserrat font-bold text-2xl text-white">
                  {award.special_note}
                </span>
                <span className="font-montserrat text-sm font-bold text-white">
                  {t('perTeam')}
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </article>
  );
}
