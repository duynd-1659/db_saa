'use client';

import { useEffect, useRef } from 'react';
import type { Department } from '@/types/department';

interface DepartmentFilterDropdownProps {
  departments: Department[];
  selectedDepartmentName?: string;
  onSelect: (name: string | undefined) => void;
  onClose: () => void;
}

export function DepartmentFilterDropdown({
  departments,
  selectedDepartmentName,
  onSelect,
  onClose,
}: DepartmentFilterDropdownProps): React.ReactElement {
  const ref = useRef<HTMLUListElement>(null);

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

  function handleItemClick(name: string): void {
    if (name === selectedDepartmentName) {
      onSelect(undefined);
    } else {
      onSelect(name);
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
        'min-w-[120px] max-h-[348px]',
        'animate-in fade-in slide-in-from-top-1 duration-150 ease-out',
      ].join(' ')}
    >
      {departments.map((dept) => {
        const isSelected = dept.name === selectedDepartmentName;
        return (
          <li
            key={dept.name}
            role="option"
            aria-selected={isSelected}
            onClick={() => handleItemClick(dept.name)}
            className={[
              'cursor-pointer flex h-14 cursor-pointer items-center rounded px-4',
              'font-montserrat text-base font-bold tracking-[0.5px] text-white',
              'transition-[background-color] duration-100 ease-in-out',
              isSelected
                ? 'bg-[var(--color-hashtag-item-selected-bg)] [text-shadow:var(--text-shadow-hashtag-glow)]'
                : 'hover:bg-[var(--color-hashtag-item-selected-bg)]',
            ].join(' ')}
          >
            {dept.name}
          </li>
        );
      })}
    </ul>
  );
}
