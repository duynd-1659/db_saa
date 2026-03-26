import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { WriteKudosBar } from './WriteKudosBar';

export async function KudosKeyvisual(): Promise<React.ReactElement> {
  const t = await getTranslations('kudosLiveBoard');

  return (
    <section className="relative h-[512px] w-full overflow-hidden pt-[var(--header-height)]">
      {/* Background image */}
      <Image
        src="/assets/kudos/images/keyvisual-bg.png"
        alt=""
        fill
        className="object-cover"
        priority
        aria-hidden="true"
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{ background: 'var(--color-kudos-cover-gradient)' }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-start justify-end px-4 md:px-10 lg:px-[var(--spacing-page-x)] pb-16 gap-8 max-w-[1440px] mx-auto w-full">
        {/* A_KV Kudos: title top, logo bottom — Figma 2940:13437 1152×160px flex-col gap-[10px] */}
        <div className="flex flex-col gap-[10px]">
          <h1 className="font-montserrat text-[36px] font-bold leading-[44px] text-[#FFEA9E]">
            {t('keyvisualHeading')}
          </h1>
          <Image
            src="/assets/kudos/logos/saa-kudos-logo.svg"
            alt="SAA Kudos"
            width={593}
            height={104}
            className="object-contain object-left"
          />
        </div>

        {/* Write bar */}
        <WriteKudosBar />
      </div>
    </section>
  );
}
