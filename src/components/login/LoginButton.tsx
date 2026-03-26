'use client';

import Image from 'next/image';
import { useState } from 'react';
import { createClient } from '@/libs/supabase/client';
import { Button } from '@/components/ui/Button';
import { useLocale, useTranslations } from 'next-intl';

interface LoginButtonProps {
  initialError?: string | null;
}

export function LoginButton({ initialError = null }: LoginButtonProps) {
  const t = useTranslations('login');
  const locale = useLocale();
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>(
    initialError ? 'error' : 'idle',
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(initialError);

  async function handleLogin() {
    setStatus('loading');
    setErrorMessage(null);

    const supabase = createClient();
    const { error, data } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}${process.env.NEXT_PUBLIC_AUTH_REDIRECT_URL ?? '/api/auth/callback'}?next=/${locale}`,
      },
    });

    if (error) {
      setStatus('error');
      setErrorMessage(t('errors.auth_failed'));
    } else {
      console.log('OAuth sign-in initiated, response data:', data);
    }
    // On success, the browser will redirect to Google — no state update needed
  }

  return (
    <div className="flex flex-col gap-2">
      <Button
        variant="primary"
        isLoading={status === 'loading'}
        onClick={handleLogin}
        aria-label={t('aria.loginButton')}
        className="h-[60px] w-[305px] px-6 py-4 text-[22px] leading-7"
        style={{ fontFamily: 'var(--font-montserrat)' }}
      >
        {status !== 'loading' && (
          <Image src="/assets/login/icons/google-icon.svg" alt="" width={24} height={24} />
        )}
        {t('loginButton')}
      </Button>

      {status === 'error' && errorMessage && (
        <p className="pl-1 text-sm text-red-400" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
