export const dynamic = 'force-dynamic';

import { createClient } from '@/libs/supabase/server';
import {
  fetchKudosFeed,
  fetchHighlightKudos,
  fetchUserKudoStats,
  fetchRecentBoxOpeners,
  fetchSpotlightData,
  fetchRecentSpotlightKudos,
  fetchTotalKudosCount,
} from '@/services/kudos-service';
import { fetchHashtags } from '@/services/hashtag-service';
import { fetchDepartments } from '@/services/department-service';
import { HeaderServer } from '@/components/ui/HeaderServer';
import { Footer } from '@/components/ui/Footer';
import { KudosKeyvisual } from '@/components/kudos/KudosKeyvisual';
import { AllKudosFeed } from '@/components/kudos/AllKudosFeed';
import { HighlightKudos } from '@/components/kudos/HighlightKudos';
import { KudosSidebar } from '@/components/kudos/KudosSidebar';
import { SpotlightBoard } from '@/components/kudos/SpotlightBoard';

export default async function SunKudosPage(): Promise<React.ReactElement> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userId = user?.id;

  // Fetch initial data in parallel
  const [
    feedResult,
    highlights,
    stats,
    recentOpeners,
    spotlightData,
    recentSpotlight,
    totalKudosCount,
    hashtags,
    departments,
  ] = await Promise.all([
    fetchKudosFeed({ page: 1, limit: 20 }, userId),
    fetchHighlightKudos({}, userId),
    userId ? fetchUserKudoStats(userId) : Promise.resolve(null),
    fetchRecentBoxOpeners(),
    fetchSpotlightData(),
    fetchRecentSpotlightKudos(7),
    fetchTotalKudosCount(),
    fetchHashtags(),
    fetchDepartments(),
  ]);
  console.log('spotlightData', spotlightData);

  return (
    <main className="bg-[var(--color-page-bg)] min-h-screen flex flex-col">
      <HeaderServer />

      {/* A: Keyvisual + Write bar */}
      <KudosKeyvisual />

      {/* B: Highlight Kudos carousel + filters */}
      <HighlightKudos initialData={highlights} hashtags={hashtags} departments={departments} />

      {/* Spotlight Board */}
      {spotlightData.length > 0 && (
        <section className="px-4 md:px-10 lg:px-[var(--spacing-page-x)] py-20 max-w-[1440px] mx-auto w-full">
          {/* B.6 Header — node 2940:13476 */}
          <div className="flex flex-col gap-4 mb-10">
            <p className="font-montserrat text-2xl font-bold leading-8 text-white">
              Sun* Annual Awards 2025
            </p>
            <hr className="border-0 h-px bg-[rgba(46,57,64,1)]" />
            <h2 className="font-montserrat text-[57px] font-bold leading-[64px] tracking-[-0.25px] text-[var(--color-gold)]">
              SPOTLIGHT BOARD
            </h2>
          </div>
          <SpotlightBoard initialData={spotlightData} initialRecent={recentSpotlight} totalKudos={totalKudosCount} />
        </section>
      )}

      {/* C + D: Feed + Sidebar */}
      <section className="px-4 md:px-10 lg:px-[var(--spacing-page-x)] py-20 max-w-[1440px] mx-auto w-full">
        {/* C.1 Header — node 2940:14221 */}
        <div className="flex flex-col gap-4 mb-10">
          <p className="font-montserrat text-2xl font-bold leading-8 text-white">
            Sun* Annual Awards 2025
          </p>
          <hr className="border-0 h-px bg-[rgba(46,57,64,1)]" />
          <h2 className="font-montserrat text-[57px] font-bold leading-[64px] tracking-[-0.25px] text-[var(--color-gold)]">
            ALL KUDOS
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-20">
          {/* Feed */}
          <div className="flex-1 min-w-0">
            <AllKudosFeed initialData={feedResult} />
          </div>

          {/* Sidebar */}
          {stats && <KudosSidebar stats={stats} recentOpeners={recentOpeners} />}
        </div>
      </section>

      <Footer />
    </main>
  );
}
