'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { createClient } from '@/libs/supabase/client';
import type { RecipientProfile } from '@/types/kudo-write';

interface RecipientSearchProps {
  value: RecipientProfile | null;
  onChange: (profile: RecipientProfile | null) => void;
  error?: string;
}

export function RecipientSearch({
  value,
  onChange,
  error,
}: RecipientSearchProps): React.ReactElement {
  const t = useTranslations('writeKudo');
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<RecipientProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data }) => setCurrentUserId(data.user?.id ?? null));
  }, []);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const searchProfiles = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`/api/profiles/search?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const data: RecipientProfile[] = await res.json();
        setResults(data);
      }
    } catch {
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  function handleOpen(): void {
    setIsOpen(true);
    setQuery('');
    setResults([]);
    // Focus search input after paint
    setTimeout(() => searchInputRef.current?.focus(), 0);
  }

  function handleClose(): void {
    setIsOpen(false);
    setQuery('');
    setResults([]);
    if (debounceRef.current) clearTimeout(debounceRef.current);
  }

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const val = e.target.value;
    setQuery(val);
    setIsLoading(val.length >= 2);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchProfiles(val), 300);
  }

  function handleSelect(profile: RecipientProfile): void {
    onChange(profile);
    handleClose();
  }

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent): void {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        handleClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4" ref={containerRef}>
      <label className="shrink-0 font-montserrat text-[22px] font-bold leading-[28px] text-[var(--color-page-bg)] md:w-[152px]">
        {t('labelRecipient')} <span className="text-red-500">*</span>
      </label>

      <div className="relative flex-1">
        {/* Trigger button */}
        <button
          type="button"
          onClick={isOpen ? handleClose : handleOpen}
          className={`flex h-14 w-full items-center justify-between rounded-lg border bg-[var(--color-input-bg)] px-6 py-4 font-montserrat text-base transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)] ${
            error ? 'border-red-500' : 'border-[var(--color-border)]'
          }`}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className={value ? 'text-[var(--color-page-bg)]' : 'text-[var(--color-hint-text)]'}>
            {value ? value.full_name : t('recipientPlaceholder')}
          </span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
            className={`shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          >
            <path
              d="M4 6l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Dropdown panel */}
        {isOpen && (
          <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-lg border border-[var(--color-border)] bg-white shadow-lg">
            {/* Search input */}
            <div className="border-b border-[var(--color-border)] p-2">
              <div className="relative">
                <Image
                  src="/assets/kudos/icons/search.svg"
                  alt=""
                  width={16}
                  height={16}
                  aria-hidden="true"
                  className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50"
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={query}
                  onChange={handleSearchChange}
                  placeholder={t('searchPlaceholder')}
                  className="h-9 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-input-bg)] py-2 pl-8 pr-3 font-montserrat text-sm text-[var(--color-page-bg)] placeholder:text-[var(--color-hint-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-gold)]"
                />
              </div>
            </div>

            {/* Results */}
            <ul className="max-h-56 overflow-y-auto" role="listbox">
              {/* Loading */}
              {isLoading && (
                <li className="flex items-center gap-2 px-4 py-3 text-sm text-[var(--color-hint-text)]">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-gold)]" />
                  {t('searching')}
                </li>
              )}

              {/* No results */}
              {!isLoading && query.length >= 2 && results.length === 0 && (
                <li className="px-4 py-3 text-sm text-[var(--color-hint-text)]">
                  {t('noRecipientFound')}
                </li>
              )}

              {/* Empty state before search */}
              {!isLoading && query.length < 2 && (
                <li className="px-4 py-3 text-sm text-[var(--color-hint-text)]">
                  {t('searchMinChars')}
                </li>
              )}

              {/* Options */}
              {!isLoading &&
                results.map((profile) => {
                  const isSelf = profile.id === currentUserId;
                  return (
                    <li
                      key={profile.id}
                      role="option"
                      aria-selected={value?.id === profile.id}
                      aria-disabled={isSelf}
                    >
                      <button
                        type="button"
                        onClick={() => !isSelf && handleSelect(profile)}
                        disabled={isSelf}
                        className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${
                          isSelf
                            ? 'cursor-not-allowed opacity-40'
                            : `hover:bg-[var(--color-btn-secondary-bg)] ${value?.id === profile.id ? 'bg-[var(--color-btn-secondary-bg)]' : ''}`
                        }`}
                      >
                        {/* Avatar */}
                        <Image
                          src={profile.avatar_url || '/assets/icons/avatar.svg'}
                          alt=""
                          width={36}
                          height={36}
                          className={`shrink-0 rounded-full object-cover ${!profile.avatar_url ? 'bg-gray-200' : ''}`}
                          unoptimized
                        />
                        {/* Name + Department */}
                        <div className="flex min-w-0 flex-col">
                          <span className="truncate font-montserrat text-sm font-bold text-[var(--color-page-bg)]">
                            {profile.full_name}
                          </span>
                          {profile.department_name && (
                            <span className="truncate text-xs text-[var(--color-hint-text)]">
                              {profile.department_name}
                            </span>
                          )}
                        </div>
                      </button>
                    </li>
                  );
                })}
            </ul>
          </div>
        )}

        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    </div>
  );
}
