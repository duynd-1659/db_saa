import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import type { SecretBoxOpener } from '@/types/kudos';

interface RecentBoxOpenersProps {
  openers: SecretBoxOpener[];
}

export async function RecentBoxOpeners({ openers }: RecentBoxOpenersProps): Promise<React.ReactElement> {
  const t = await getTranslations('kudosLiveBoard');

  if (openers.length === 0) return <div />;

  return (
    <div className="flex flex-col gap-3">
      <h3 className="font-montserrat-alternates text-sm font-bold uppercase text-[#FFEA9E]">
        {t('recentOpeners')}
      </h3>

      <ul className="flex flex-col gap-2">
        {openers.map((opener) => (
          <li key={`${opener.user_id}-${opener.opened_at}`}>
            <Link
              href={`/profile/${opener.user_id}`}
              className="flex items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-white/5"
            >
              <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-full border border-[var(--color-border)]">
                {opener.avatar_url ? (
                  <Image src={opener.avatar_url} alt={opener.name} fill className="object-cover" />
                ) : (
                  <Image
                    src="/assets/icons/avatar.svg"
                    alt={opener.name}
                    width={32}
                    height={32}
                    className="p-1.5 opacity-60"
                  />
                )}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-montserrat text-sm font-bold text-white truncate">
                  {opener.name}
                </span>
                <span className="font-montserrat text-xs text-[var(--color-text-muted)] truncate">
                  {opener.prize_description}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
