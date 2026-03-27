'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type { HeroBadgeTier, KudoWithDetails } from '@/types/kudos';
import type { SunnerHoverTarget } from '@/types/sunner-hover';
import { HERO_BADGE_IMAGE } from '@/config/hero-badge';
import { SunnerHoverCardTrigger } from './SunnerHoverCardTrigger';
import { KudoHashtagChipsRow } from './KudoHashtagChipsRow';
import { KudoCardActions } from './KudoCardActions';
import { KudoImageGallery } from './KudoImageGallery';
import { KudoRichContent } from './KudoRichContent';

interface KudoCardProps {
  kudo: KudoWithDetails;
  contentLineClamp?: 3 | 5;
}

export function KudoCard({ kudo, contentLineClamp = 5 }: KudoCardProps): React.ReactElement {
  const timestamp = formatTimestamp(kudo.created_at);

  const senderName = kudo.is_anonymous ? (kudo.anonymous_name ?? 'Anonymous') : kudo.sender.name;
  const senderAvatar = kudo.is_anonymous ? null : kudo.sender.avatar_url;

  return (
    <article className="flex flex-col gap-4 rounded-[24px] bg-[rgba(255,248,225,1)] px-10 pb-4 pt-10">
      {/* Info row: sender ↔ arrow ↔ recipient */}
      <div className="flex flex-row items-start justify-between">
        <UserInfoColumn
          name={senderName}
          avatarUrl={senderAvatar}
          department={kudo.is_anonymous ? null : kudo.sender.department}
          heroBadge={kudo.is_anonymous ? null : kudo.sender.hero_badge}
          isAnonymous={kudo.is_anonymous}
          hoverTarget={
            kudo.is_anonymous
              ? undefined
              : {
                  userId: kudo.sender.id,
                  name: kudo.sender.name,
                  department: kudo.sender.department,
                  heroBadge: kudo.sender.hero_badge,
                  avatarUrl: kudo.sender.avatar_url,
                }
          }
        />

        {/* Sent arrow icon */}
        <div className="flex flex-1 items-center justify-center pt-5">
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3.87109 27.306V5.97266L29.2044 16.6393M6.53776 23.306L22.3378 16.6393L6.53776 9.97266V14.6393L14.5378 16.6393L6.53776 18.6393M6.53776 23.306V9.97266V18.6393V23.306Z"
              fill="#00101A"
            />
          </svg>
        </div>

        <UserInfoColumn
          name={kudo.recipient.name}
          avatarUrl={kudo.recipient.avatar_url}
          department={kudo.recipient.department}
          heroBadge={kudo.recipient.hero_badge}
          isAnonymous={false}
          hoverTarget={{
            userId: kudo.recipient.id,
            name: kudo.recipient.name,
            department: kudo.recipient.department,
            heroBadge: kudo.recipient.hero_badge,
            avatarUrl: kudo.recipient.avatar_url,
          }}
        />
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-[rgba(0,16,26,0.1)]" />

      {/* Content area */}
      <div className="flex flex-col gap-4">
        {/* Timestamp */}
        <span className="font-montserrat text-base font-bold tracking-[0.5px] text-[rgba(153,153,153,1)]">
          {timestamp}
        </span>

        {/* Title badge (D.4) */}
        <div className="flex flex-row items-center justify-between">
          <span className="font-montserrat text-base font-bold text-[rgba(0,16,26,1)]">
            {kudo.title}
          </span>
          <Image
            src="/assets/icons/pencil.svg"
            alt=""
            width={32}
            height={32}
            aria-hidden="true"
            className="flex-shrink-0 opacity-40"
          />
        </div>

        {/* Content box */}
        <div className="rounded-[12px] border border-[#FFEA9E] bg-[rgba(255,234,158,0.40)] px-6 py-4">
          <KudoRichContent
            html={kudo.content}
            className={`font-montserrat text-[20px] leading-[28px] text-[rgba(0,16,26,1)] ${contentLineClamp === 3 ? 'line-clamp-3 h-[84px]' : 'line-clamp-5 h-[140px]'} prose prose-sm prose-p:my-0 prose-blockquote:my-0 prose-ol:my-0 prose-li:my-0 max-w-none [&_p]:m-0 [&_a]:text-blue-600 [&_a]:underline [&_.mention]:font-semibold [&_.mention]:text-blue-600`}
          />
        </div>

        {/* Image gallery */}
        <KudoImageGallery images={kudo.images} />

        {/* Hashtags */}
        {kudo.hashtags.length > 0 && <KudoHashtagChipsRow hashtags={kudo.hashtags} />}
      </div>

      {/* Gold divider */}
      <div className="h-px w-full bg-[rgba(255,234,158,1)]" />

      {/* Action bar */}
      <KudoCardActions
        kudoId={kudo.id}
        initialLiked={kudo.liked_by_me}
        initialLikeCount={kudo.like_count}
      />
    </article>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface UserInfoColumnProps {
  name: string;
  avatarUrl: string | null;
  department: string | null;
  heroBadge: HeroBadgeTier | null;
  isAnonymous: boolean;
  hoverTarget?: SunnerHoverTarget;
}

function UserInfoColumn({
  name,
  avatarUrl,
  department,
  heroBadge,
  isAnonymous,
  hoverTarget,
}: UserInfoColumnProps): React.ReactElement {
  const t = useTranslations('kudosLiveBoard');
  const avatarEl = (
    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full border-[1.869px] border-white transition-colors group-hover:border-[#FFEA9E] group-data-[hovered=true]:border-[#FFEA9E]">
      {avatarUrl ? (
        <Image src={avatarUrl} alt={name} fill className="object-cover" />
      ) : (
        <Image
          src="/assets/icons/avatar.svg"
          alt={name}
          width={64}
          height={64}
          className="bg-[#d3d3d3] p-3"
        />
      )}
    </div>
  );

  return (
    <div className="flex w-[235px] flex-col items-center gap-[13px]">
      {/* Row 1 — Avatar */}
      {hoverTarget ? (
        <SunnerHoverCardTrigger target={hoverTarget} wrapperClassName="inline-block group">
          {avatarEl}
        </SunnerHoverCardTrigger>
      ) : (
        avatarEl
      )}

      {/* Row 2 — Name */}
      <span className="text-center font-montserrat text-base font-bold tracking-[0.15px] text-[rgba(0,16,26,1)]">
        {name}
      </span>

      {/* Row 3 — dept + dot + hero badge OR anonymous label */}
      {isAnonymous ? (
        <span className="text-center text-sm text-[rgba(153,153,153,1)]">{t('anonymousUser')}</span>
      ) : (
        (department ?? heroBadge) && (
          <div className="flex items-center gap-1">
            {department && (
              <span className="font-montserrat text-sm font-normal text-[rgba(153,153,153,1)]">
                {department}
              </span>
            )}
            {department && heroBadge && (
              <span className="text-sm text-[rgba(153,153,153,1)]">·</span>
            )}
            {heroBadge && (
              <Image
                src={HERO_BADGE_IMAGE[heroBadge]}
                alt={heroBadge}
                width={109}
                height={19}
                className="object-contain"
              />
            )}
          </div>
        )
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatTimestamp(dateStr: string): string {
  const date = new Date(dateStr);
  const vnDate = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));
  const hours = vnDate.getHours().toString().padStart(2, '0');
  const minutes = vnDate.getMinutes().toString().padStart(2, '0');
  const month = (vnDate.getMonth() + 1).toString().padStart(2, '0');
  const day = vnDate.getDate().toString().padStart(2, '0');
  const year = vnDate.getFullYear();
  return `${hours}:${minutes} - ${month}/${day}/${year}`;
}
