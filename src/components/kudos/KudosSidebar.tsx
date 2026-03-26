import type { KudoStats, SecretBoxOpener } from '@/types/kudos';
import { KudosSidebarStats } from './KudosSidebarStats';
import { OpenSecretBoxButton } from './OpenSecretBoxButton';
import { RecentBoxOpeners } from './RecentBoxOpeners';

interface KudosSidebarProps {
  stats: KudoStats;
  recentOpeners: SecretBoxOpener[];
}

export function KudosSidebar({ stats, recentOpeners }: KudosSidebarProps): React.ReactElement {
  return (
    <aside className="flex w-full lg:w-[280px] flex-shrink-0 flex-col gap-6">
      <KudosSidebarStats stats={stats} />
      <OpenSecretBoxButton unopenedCount={stats.boxes_remaining} />
      <RecentBoxOpeners openers={recentOpeners} />
    </aside>
  );
}
