import { useTranslations } from 'next-intl';

export function EventInfo(): React.ReactElement {
  const t = useTranslations('homepage.hero');

  return (
    <div className="flex flex-col gap-2 md:flex-row md:gap-8">
      <p className="text-white/80 font-montserrat text-base font-medium">{t('eventTime')}</p>
      <p className="text-white/80 font-montserrat text-base font-medium">{t('eventVenue')}</p>
    </div>
  );
}
