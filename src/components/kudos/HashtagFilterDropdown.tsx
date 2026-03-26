'use client';

import { useEffect, useRef } from 'react';
import type { KudoHashtag } from '@/types/kudos';
import { HashtagFilterItem } from './HashtagFilterItem';

interface HashtagFilterDropdownProps {
  hashtags: KudoHashtag[];
  selectedHashtagKey?: string;
  onSelect: (key: string | undefined) => void;
  onClose: () => void;
}

export function HashtagFilterDropdown({
  hashtags,
  selectedHashtagKey,
  onSelect,
  onClose,
}: HashtagFilterDropdownProps): React.ReactElement {
  const ref = useRef<HTMLUListElement>(null);

  // Click-outside and Escape handlers (T009, T010)
  useEffect(() => {
    function handleClickOutside(e: MouseEvent): void {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    function handleKeyDown(e: KeyboardEvent): void {
      if (e.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  function handleItemClick(key: string): void {
    if (key === selectedHashtagKey) {
      onSelect(undefined);
    } else {
      onSelect(key);
    }
  }

  return (
    <ul
      ref={ref}
      role="listbox"
      className={[
        'absolute top-full z-10 mt-1 flex flex-col overflow-y-auto p-1.5',
        'rounded-lg border border-[var(--color-hashtag-dropdown-border)]',
        'bg-[var(--color-hashtag-dropdown-bg)]',
        'min-w-[200px] max-h-[348px]',
        'animate-in fade-in slide-in-from-top-1 duration-150 ease-out',
      ].join(' ')}
    >
      {hashtags.map((hashtag) => (
        <HashtagFilterItem
          key={hashtag.key}
          name={hashtag.name}
          isSelected={hashtag.key === selectedHashtagKey}
          onClick={() => handleItemClick(hashtag.key)}
        />
      ))}
    </ul>
  );
}
