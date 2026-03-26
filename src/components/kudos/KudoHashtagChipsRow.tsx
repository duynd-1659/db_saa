'use client';

import { useRef, useState, useLayoutEffect } from 'react';
import { KudoHashtagChip } from './KudoHashtagChip';

interface Tag {
  hashtag_id: string;
  name: string;
}

interface KudoHashtagChipsRowProps {
  hashtags: Tag[];
}

export function KudoHashtagChipsRow({ hashtags }: KudoHashtagChipsRowProps): React.ReactElement {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(hashtags.length);

  // Reset when hashtags change
  useLayoutEffect(() => {
    setVisibleCount(hashtags.length);
  }, [hashtags]);

  // After each render: if still overflowing, drop one more chip
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (el.scrollWidth > el.clientWidth && visibleCount > 0) {
      setVisibleCount((c) => c - 1);
    }
  });

  const truncated = visibleCount < hashtags.length;

  return (
    <div ref={containerRef} className="flex flex-nowrap items-center gap-2 overflow-hidden">
      {hashtags.slice(0, visibleCount).map((tag) => (
        <KudoHashtagChip key={tag.hashtag_id} name={tag.name} />
      ))}
      {truncated && (
        <span className="flex-shrink-0 font-montserrat text-[13px] font-medium text-[#d4271d]">
          ...
        </span>
      )}
    </div>
  );
}
