import Image from 'next/image';
import { EventInfo } from './EventInfo';
import { CTAButtons } from './CTAButtons';
import { CountdownTimer } from './CountdownTimer';
import { RootFurtherSection } from './RootFurtherSection';

interface HeroSectionProps {
  targetDate: string;
}

export function HeroSection({ targetDate }: HeroSectionProps): React.ReactElement {
  return (
    <section className="relative w-full overflow-hidden bg-no-repeat bg-cover bg-top-right bg-[linear-gradient(12.34deg,#00101A_23.7%,rgba(0,18,29,0.461538)_38.34%,rgba(0,19,32,0)_48.92%),url(/assets/homepage/images/keyvisual-bg.png)]">
      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end h-full px-4 md:px-10 lg:px-[var(--spacing-page-x)] max-w-[1440px] mx-auto pb-12 md:pb-16 gap-8 pt-32">
        <div className="flex flex-col items-start gap-10">
          {/* Hero title — rendered as image asset per design spec */}
          <h1>
            <Image
              src="/assets/login/images/root-further-logo.png"
              alt="ROOT FURTHER"
              width={451}
              height={200}
              className="w-auto"
              priority
            />
          </h1>

          {/* Frame 523: countdown + event info block */}
          <div className="flex flex-col items-start gap-4">
            <CountdownTimer targetDate={targetDate} />
            <EventInfo />
          </div>

          <CTAButtons />
        </div>
      </div>

      <RootFurtherSection />
    </section>
  );
}
