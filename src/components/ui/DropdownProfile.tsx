'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from '@/i18n/navigation';
import { createClient } from '@/libs/supabase/client';

interface DropdownProfileProps {
  isOpen: boolean;
  isAdmin?: boolean;
  onClose: () => void;
}

export function DropdownProfile({
  isOpen,
  isAdmin = false,
  onClose,
}: DropdownProfileProps): React.ReactElement | null {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent): void {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    }

    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape') onClose();
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  async function handleSignOut(): Promise<void> {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-[var(--color-border)] bg-[rgba(16,20,23,0.95)] shadow-lg z-[60]"
      role="menu"
    >
      <ul className="py-1">
        <li>
          <button
            onClick={onClose}
            className="w-full px-4 py-3 text-left text-sm text-white hover:bg-white/10 transition-colors min-h-[44px]"
            role="menuitem"
          >
            Hồ sơ cá nhân
          </button>
        </li>
        {isAdmin && (
          <li>
            <button
              onClick={onClose}
              className="w-full px-4 py-3 text-left text-sm text-white hover:bg-white/10 transition-colors min-h-[44px]"
              role="menuitem"
            >
              Dashboard
            </button>
          </li>
        )}
        <li>
          <button
            onClick={handleSignOut}
            className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-white/10 transition-colors min-h-[44px]"
            role="menuitem"
          >
            Đăng xuất
          </button>
        </li>
      </ul>
    </div>
  );
}
