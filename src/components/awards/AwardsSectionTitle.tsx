import { useTranslations } from 'next-intl';

export function AwardsSectionTitle(): React.ReactElement {
  const t = useTranslations('awardsInformation');

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <p className="font-montserrat text-sm font-bold text-white uppercase tracking-widest">
        {t('caption')}
      </p>
      <div className="h-px w-full" style={{ backgroundColor: 'var(--color-section-divider)' }} />
      <h1 className="font-montserrat font-bold text-3xl md:text-[40px] md:leading-tight text-[var(--color-gold)]">
        {t('title')}
      </h1>
    </div>
  );
}
