import { getTranslations } from 'next-intl/server';
import type { KudoStats } from '@/types/kudos';

interface KudosSidebarStatsProps {
  stats: KudoStats;
}

export async function KudosSidebarStats({ stats }: KudosSidebarStatsProps): Promise<React.ReactElement> {
  const t = await getTranslations('kudosLiveBoard.stats');

  const rows: { label: string; value: number }[] = [
    { label: t('kudosReceived'), value: stats.kudos_received },
    { label: t('kudosSent'), value: stats.kudos_sent },
    { label: t('heartsReceived'), value: stats.likes_received },
    { label: t('boxesOpened'), value: stats.boxes_opened },
    { label: t('boxesRemaining'), value: stats.boxes_remaining },
  ];

  return (
    <div className="flex flex-col gap-3">
      {rows.map((row) => (
        <div key={row.label} className="flex items-center justify-between">
          <span className="font-montserrat text-sm font-normal text-[var(--color-text-muted)]">
            {row.label}
          </span>
          <span className="font-montserrat text-2xl font-bold text-[#FFEA9E]">
            {row.value}
          </span>
        </div>
      ))}
    </div>
  );
}
