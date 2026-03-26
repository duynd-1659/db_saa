'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { PlusIcon } from '@/components/ui/icons/PlusIcon';

interface HashtagItem {
  hashtag_id: string;
  name: string;
}

interface HashtagPickerProps {
  selected: HashtagItem[];
  onChange: (hashtags: HashtagItem[]) => void;
  error?: string;
}

interface FetchedHashtag {
  hashtag_id: string;
  name: string;
  key: string;
}

export function HashtagPicker({
  selected,
  onChange,
  error,
}: HashtagPickerProps): React.ReactElement {
  const t = useTranslations('writeKudo');
  const [allHashtags, setAllHashtags] = useState<FetchedHashtag[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch all hashtags on mount
  useEffect(() => {
    async function load(): Promise<void> {
      try {
        const res = await fetch('/api/hashtags');
        if (res.ok) {
          const data: FetchedHashtag[] = await res.json();
          setAllHashtags(data);
        }
      } catch {
        // Ignore — hashtags list will be empty
      }
    }
    load();
  }, []);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent): void {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isSelected = useCallback(
    (id: string) => selected.some((h) => h.hashtag_id === id),
    [selected],
  );

  function toggleHashtag(hashtag: FetchedHashtag): void {
    if (isSelected(hashtag.hashtag_id)) {
      onChange(selected.filter((h) => h.hashtag_id !== hashtag.hashtag_id));
    } else if (selected.length < 5) {
      onChange([...selected, { hashtag_id: hashtag.hashtag_id, name: hashtag.name }]);
    }
  }

  function removeHashtag(id: string): void {
    onChange(selected.filter((h) => h.hashtag_id !== id));
  }

  const atLimit = selected.length >= 5;

  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4" ref={containerRef}>
      <label className="shrink-0 font-montserrat text-[22px] font-bold leading-[28px] text-[var(--color-page-bg)] md:w-[152px] md:pt-1">
        {t('labelHashtag')} <span className="text-red-500">*</span>
      </label>

      <div className="relative flex-1">
        {/* Selected chips + add button */}
        <div className="flex flex-wrap items-center gap-2">
          {selected.map((h) => (
            <span
              key={h.hashtag_id}
              className="flex items-center gap-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-btn-secondary-bg)] px-3 py-1.5 font-montserrat text-sm font-semibold text-[var(--color-page-bg)]"
            >
              #{h.name}
              <button
                type="button"
                onClick={() => removeHashtag(h.hashtag_id)}
                aria-label={`Remove ${h.name}`}
                className="ml-1 text-[var(--color-hint-text)] hover:text-[var(--color-page-bg)] cursor-pointer"
              >
                ×
              </button>
            </span>
          ))}
          {!atLimit && (
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className={`flex cursor-pointer items-center gap-2 rounded-lg border bg-white px-2 py-1 transition-colors hover:bg-[var(--color-btn-secondary-bg)] ${
                error
                  ? 'border-red-500 text-red-500'
                  : 'border-[var(--color-border)] text-[var(--color-hint-text)]'
              }`}
            >
              <PlusIcon size={24} />
              <span className="font-montserrat text-[11px] font-bold leading-4 tracking-[0.5px]">
                {t('addHashtag')}
                <br />
                {t('maxHashtags')}
              </span>
            </button>
          )}
        </div>

        {/* Dropdown */}
        {isOpen && (
          <ul className="absolute z-20 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-hashtag-dropdown-bg)] shadow-lg">
            {allHashtags.map((tag) => {
              const sel = isSelected(tag.hashtag_id);
              const disabled = atLimit && !sel;
              return (
                <li key={tag.hashtag_id}>
                  <button
                    type="button"
                    onClick={() => toggleHashtag(tag)}
                    disabled={disabled}
                    className={`flex w-full items-center justify-between px-4 py-3 text-left font-montserrat text-sm transition-colors ${
                      disabled
                        ? 'cursor-not-allowed opacity-50'
                        : 'hover:bg-[var(--color-hashtag-item-selected-bg)]'
                    } ${sel ? 'bg-[var(--color-hashtag-item-selected-bg)] font-semibold text-[var(--color-gold)]' : 'text-white'}`}
                  >
                    <span>#{tag.name}</span>
                    {sel && <span>✓</span>}
                  </button>
                </li>
              );
            })}
            {allHashtags.length === 0 && (
              <li className="px-4 py-3 text-sm text-[var(--color-hint-text)]">
                {t('noHashtagsFound')}
              </li>
            )}
          </ul>
        )}

        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    </div>
  );
}
