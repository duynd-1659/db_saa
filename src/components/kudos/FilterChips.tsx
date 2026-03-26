'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useKudosFilters } from '@/hooks/use-kudos-filters';
import type { KudoHashtag } from '@/types/kudos';
import type { Department } from '@/types/department';
import { HashtagFilterDropdown } from './HashtagFilterDropdown';
import { DepartmentFilterDropdown } from './DepartmentFilterDropdown';

interface FilterChipsProps {
  hashtags?: KudoHashtag[];
  departments?: Department[];
}

export function FilterChips({
  hashtags = [],
  departments = [],
}: FilterChipsProps): React.ReactElement {
  const t = useTranslations('kudosLiveBoard');
  const { filters, setHashtag, setDepartment, clearFilters } = useKudosFilters();
  const [hashtagDropdownOpen, setHashtagDropdownOpen] = useState(false);
  const [deptDropdownOpen, setDeptDropdownOpen] = useState(false);

  const hasActiveFilter = !!filters.hashtag_key || !!filters.department_name;

  // Derive button labels from selected values
  const selectedHashtag = hashtags.find((h) => h.key === filters.hashtag_key);
  const hashtagLabel = selectedHashtag ? selectedHashtag.name : t('filterHashtag');
  const deptLabel = filters.department_name ?? t('filterDepartment');

  function handleHashtagSelect(key: string | undefined): void {
    setHashtag(key);
    setHashtagDropdownOpen(false);
  }

  return (
    <div className="flex items-center gap-3">
      {/* Hashtag filter */}
      {hashtags.length > 0 && (
        <div className="relative">
          <FilterButton
            label={hashtagLabel}
            isActive={!!filters.hashtag_key}
            isExpanded={hashtagDropdownOpen}
            onClick={() => setHashtagDropdownOpen((prev) => !prev)}
          />
          {hashtagDropdownOpen && (
            <HashtagFilterDropdown
              hashtags={hashtags}
              selectedHashtagKey={filters.hashtag_key}
              onSelect={handleHashtagSelect}
              onClose={() => setHashtagDropdownOpen(false)}
            />
          )}
        </div>
      )}

      {/* Department filter */}
      {departments.length > 0 && (
        <div className="relative">
          <FilterButton
            label={deptLabel}
            isActive={!!filters.department_name}
            isExpanded={deptDropdownOpen}
            onClick={() => setDeptDropdownOpen((prev) => !prev)}
          />
          {deptDropdownOpen && (
            <DepartmentFilterDropdown
              departments={departments}
              selectedDepartmentName={filters.department_name}
              onSelect={(name) => {
                setDepartment(name);
                setDeptDropdownOpen(false);
              }}
              onClose={() => setDeptDropdownOpen(false)}
            />
          )}
        </div>
      )}

      {/* Clear filters — only visible when ≥1 filter is active */}
      {hasActiveFilter && (
        <button
          type="button"
          onClick={clearFilters}
          className=" cursor-pointer min-h-[44px] px-2 font-montserrat text-sm font-medium text-white/50 transition-colors hover:text-white/80"
        >
          {t('clearFilters')}
        </button>
      )}
    </div>
  );
}

interface FilterButtonProps {
  label: string;
  isActive: boolean;
  isExpanded?: boolean;
  onClick: () => void;
}

function FilterButton({
  label,
  isActive,
  isExpanded,
  onClick,
}: FilterButtonProps): React.ReactElement {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-haspopup="listbox"
      aria-expanded={isExpanded ?? false}
      className={[
        ' cursor-pointer flex items-center gap-2 rounded-full border px-4 py-2 font-montserrat text-sm font-medium transition-colors min-h-[44px]',
        isActive
          ? 'border-[var(--color-gold)] text-[var(--color-gold)] bg-[var(--color-gold)]/10'
          : 'border-[var(--color-border)] text-white/60 hover:text-white/80',
      ].join(' ')}
    >
      {label}
      <ChevronDownIcon />
    </button>
  );
}

function ChevronDownIcon(): React.ReactElement {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M3 4.5L6 7.5L9 4.5" />
    </svg>
  );
}
