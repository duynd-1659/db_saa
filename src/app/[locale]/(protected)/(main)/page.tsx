export const dynamic = 'force-dynamic';

import { fetchEventConfig } from '@/services/homepage-service';
import { HeaderServer } from '@/components/ui/HeaderServer';
import { HeroSection } from '@/components/homepage/HeroSection';
import { AwardsSection } from '@/components/homepage/AwardsSection';
import { KudosPromo } from '@/components/ui/KudosPromo';
import { Footer } from '@/components/ui/Footer';

export default async function HomePage(): Promise<React.ReactElement> {
  const eventConfig = await fetchEventConfig().catch(() => ({
    event_start_datetime:
      process.env.NEXT_PUBLIC_EVENT_START_DATETIME ?? '2026-12-31T18:30:00+07:00',
    venue: 'Nhà hát nghệ thuật quân đội',
    time_display: '18h30',
  }));

  return (
    <main className="bg-[var(--color-page-bg)] min-h-screen flex flex-col pt-[var(--header-height)]">
      <HeaderServer />
      <HeroSection
        targetDate={
          eventConfig.event_start_datetime
        }
      />

      <div className="flex flex-col gap-0">
        <AwardsSection />
        <KudosPromo />
      </div>

      <Footer />
    </main>
  );
}
