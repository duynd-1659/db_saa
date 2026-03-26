import { redirect } from 'next/navigation';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { createClient } from '@/libs/supabase/server';
import { LoginHeader } from '@/components/login/LoginHeader';
import { LoginFooter } from '@/components/login/LoginFooter';
import { LoginButton } from '@/components/login/LoginButton';

interface LoginPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect('/');
  }

  const t = await getTranslations('login');
  const { error: errorParam } = await searchParams;

  const initialError = errorParam === 'auth_failed' ? t('errors.auth_failed') : null;

  const taglineLines = t('heroTagline').split('\n');

  return (
    <main
      className="relative flex min-h-screen items-center overflow-hidden"
      style={{ backgroundColor: 'var(--color-page-bg)' }}
    >
      {/* C_Keyvisual — full-screen background artwork */}
      <Image
        src="/assets/login/images/keyvisual.png"
        alt={t('aria.keyvisual')}
        fill
        priority
        quality={85}
        sizes="100vw"
        className="object-cover object-right"
      />

      {/* Left-fade gradient overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background: 'linear-gradient(90deg, #00101A 40%, rgba(0,16,26,0) 100%)',
        }}
      />

      {/* Bottom-fade gradient overlay */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-48"
        style={{
          background: 'linear-gradient(180deg, rgba(0,16,26,0) 0%, #00101A 100%)',
        }}
      />

      {/* Header */}
      <LoginHeader />

      {/* Hero section */}
      <section className="relative z-20 flex flex-col gap-[120px]" style={{ paddingLeft: '144px' }}>
        <div className="flex flex-col gap-[80px]">
          {/* B.1_Key Visual — ROOT FURTHER title image */}
          <div className="h-[200px] w-full">
            <Image
              src="/assets/login/images/root-further-logo.png"
              alt="ROOT FURTHER – Sun Annual Awards 2025"
              width={451}
              height={200}
              priority
            />
          </div>

          {/* B.2_content + B.3_Login */}
          <div className="flex flex-col gap-6 pl-4">
            {/* Hero tagline */}
            <p
              className="w-[480px] font-bold text-white"
              style={{
                fontSize: '20px',
                lineHeight: '40px',
                letterSpacing: '0.5px',
                fontFamily: 'var(--font-montserrat)',
              }}
            >
              {taglineLines.map((line, i) => (
                <span key={i}>
                  {line}
                  {i < taglineLines.length - 1 && <br />}
                </span>
              ))}
            </p>

            {/* Login button */}
            <LoginButton initialError={initialError} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <LoginFooter />
    </main>
  );
}
