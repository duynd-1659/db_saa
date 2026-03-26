import { getTranslations } from 'next-intl/server';

export async function LoginFooter() {
  const t = await getTranslations('login');

  return (
    <footer
      className="absolute bottom-0 z-20 flex w-full items-center justify-center px-[90px] py-10"
      style={{
        borderTop: '1px solid var(--color-divider)',
        fontFamily: 'var(--font-montserrat-alt)',
      }}
    >
      <span className="text-base font-bold leading-6 text-white">{t('footer')}</span>
    </footer>
  );
}
