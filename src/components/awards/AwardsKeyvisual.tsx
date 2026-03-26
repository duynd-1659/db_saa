import Image from 'next/image';
import { AwardsSectionTitle } from './AwardsSectionTitle';

export function AwardsKeyvisual(): React.ReactElement {
  return (
    <section
      className="relative w-full bg-cover bg-center bg-no-repeat mt-[var(--header-height)]"
      style={{
        background: `var(--color-awards-cover-gradient), url(/assets/homepage/images/keyvisual-bg.png) center/cover no-repeat`,
      }}
    >
      {/* Title Section — absolute bottom, horizontally centered */}
      <div className="flex flex-col gap-10 md:gap-20 pt-10 md:pt-20 justify-center px-4 md:px-10 lg:px-[var(--spacing-page-x)] pb-6 md:pb-10">
        {/* ROOT FURTHER logo */}
        <Image
          src="/assets/login/images/root-further-logo.png"
          alt="ROOT FURTHER"
          width={400}
          height={200}
          className="object-contain w-[200px] md:w-[300px] lg:w-[400px] h-auto"
          priority
        />

        <AwardsSectionTitle />
      </div>
    </section>
  );
}
