'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { CountdownDigit } from './CountdownDigit';
import { Link } from '@/i18n/navigation';

interface CountdownState {
  days: string;
  hours: string;
  minutes: string;
  isExpired: boolean;
}

interface CountdownTimerProps {
  targetDate: string;
}

function computeCountdown(targetDate: string): CountdownState {
  const target = new Date(targetDate).getTime();
  const now = Date.now();
  const remaining = Math.max(0, target - now);

  if (remaining === 0) {
    return { days: '00', hours: '00', minutes: '00', isExpired: true };
  }

  const totalMinutes = Math.floor(remaining / 60_000);
  const totalHours = Math.floor(totalMinutes / 60);
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;
  const minutes = totalMinutes % 60;

  return {
    days: String(days).padStart(2, '0'),
    hours: String(hours).padStart(2, '0'),
    minutes: String(minutes).padStart(2, '0'),
    isExpired: false,
  };
}

export function CountdownTimer({ targetDate }: CountdownTimerProps): React.ReactElement {
  // Start with "00" server-side to avoid hydration mismatch
  const [countdown, setCountdown] = useState<CountdownState>({
    days: '00',
    hours: '00',
    minutes: '00',
    isExpired: false,
  });

  const t = useTranslations('homepage.hero');
  const tHomepage = useTranslations('homepage');

  useEffect(() => {
    // Immediately update on mount with real values
    setCountdown(computeCountdown(targetDate));

    const interval = setInterval(() => {
      setCountdown(computeCountdown(targetDate));
    }, 60_000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (countdown.isExpired) {
    return (
      <Link
        href="/ticket"
        className="inline-block px-8 py-4 bg-[var(--color-gold)] text-[#00101A] font-montserrat font-bold text-sm rounded hover:opacity-90 transition-opacity text-center"
      >
        {tHomepage('qrButton')}
      </Link>
    );
  }

  return (
    <div
      className="flex items-center gap-4"
      role="timer"
      aria-live="polite"
      aria-label="Event countdown"
    >
      <CountdownDigit value={countdown.days} unit="DAYS" unitLabel={t('countdownDays')} />
      <CountdownDigit value={countdown.hours} unit="HOURS" unitLabel={t('countdownHours')} />
      <CountdownDigit
        value={countdown.minutes}
        unit="MINUTES"
        unitLabel={t('countdownMinutes')}
      />
    </div>
  );
}
