import type { AwardCategory } from '@/types/homepage';
import { AwardCard } from './AwardCard';
import { AwardsNavMenu } from './AwardsNavMenu';
import React from 'react';

interface AwardsLayoutProps {
  awards: AwardCategory[];
}

export function AwardsLayout({ awards }: AwardsLayoutProps): React.ReactElement {
  return (
    <div className="flex flex-col lg:flex-row gap-10 lg:gap-[var(--spacing-content-gap)]">
      {/* Left nav — hidden on mobile, sticky on desktop */}
      <aside className="hidden lg:block lg:w-[220px] flex-shrink-0">
        <AwardsNavMenu awards={awards} />
      </aside>

      {/* Award cards */}
      <div className="flex flex-col gap-[80px] flex-1">
        {awards.map((award, index) => (
          <React.Fragment key={award.slug}>
            {index > 0 && <div className="h-px bg-[#2E3940]" />}
            <AwardCard award={award} reversed={index % 2 !== 0} />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
