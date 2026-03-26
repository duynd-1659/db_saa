import { HeaderServer } from '@/components/ui/HeaderServer';
import { Footer } from '@/components/ui/Footer';
import { KudosPromo } from '@/components/ui/KudosPromo';
import { AWARD_CATEGORIES } from '@/config/award-categories';
import { AwardsKeyvisual } from '@/components/awards/AwardsKeyvisual';
import { AwardsLayout } from '@/components/awards/AwardsLayout';

export default function AwardsInformationPage(): React.ReactElement {
  return (
    <main className="bg-[var(--color-page-bg)] min-h-screen flex flex-col">
      <HeaderServer />
      <AwardsKeyvisual />

      <section className="flex flex-col px-4 md:px-10 lg:px-[var(--spacing-page-x)] py-[var(--spacing-page-y)] gap-[var(--spacing-section-gap)] max-w-[1440px] mx-auto w-full">
        <AwardsLayout awards={AWARD_CATEGORIES} />
      </section>

      <KudosPromo />
      <Footer />
    </main>
  );
}
