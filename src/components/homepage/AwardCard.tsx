'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import type { AwardCategory } from '@/types/homepage';
import { RedirectIcon } from '@/components/ui/icons/RedicrectIcon';

interface AwardCardProps {
  award: AwardCategory;
}

export function AwardCard({ award }: AwardCardProps): React.ReactElement {
  const [imgError, setImgError] = useState(false);
  const t = useTranslations('homepage.awards');

  return (
    <Link href={`/awards-information#${award.slug}`}>
      <article className="group flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1">
      {/* Image */}
      <div
        className={[
          'relative aspect-square w-full overflow-hidden rounded-[24px]',
          'border border-[#FFEA9E]',
          'shadow-[0_4px_4px_0_rgba(0,0,0,0.25),0_0_6px_0_#FAE287]',
          'transition-shadow duration-300',
          'group-hover:shadow-[0_0_16px_rgba(255,234,158,0.3)]',
        ].join(' ')}
      >
        {imgError ? (
          <div
            className="w-full h-full bg-gradient-to-br from-[#001422] to-[#002a44] flex items-center justify-center"
            aria-hidden="true"
          >
            <span className="text-[var(--color-gold)] font-montserrat-alt font-bold text-2xl">
              {award.name[0]}
            </span>
          </div>
        ) : (
          <>
            <Image
              src={award.image_url}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              onError={() => setImgError(true)}
            />
            <Image
              src={award.name_image_url}
              alt={award.name}
              width={award.name_image_width}
              height={award.name_image_height}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-contain"
            />
          </>
        )}
      </div>

      {/* Card body */}
      <div className="flex flex-col gap-2">
        <h3 className="font-montserrat font-normal text-[#FFEA9E] text-2xl leading-8">{award.name}</h3>
        <p className="font-montserrat text-base text-white leading-6 tracking-[0.5px] line-clamp-2">
          {award.card_description}
        </p>
      </div>

      {/* Detail link */}
      <div className="inline-flex items-center gap-1 py-4 font-montserrat font-medium text-base text-white">
        {t('detailLink')}
        <RedirectIcon aria-hidden="true" />
      </div>
      </article>
    </Link>
  );
}
