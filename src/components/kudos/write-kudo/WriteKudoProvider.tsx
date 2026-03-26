'use client';

import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from '@/i18n/navigation';
import type { RecipientProfile } from '@/types/kudo-write';
import { WriteKudoModal } from './WriteKudoModal';

interface WriteKudoContextValue {
  openWriteKudo: (recipient?: RecipientProfile) => void;
  closeWriteKudo: () => void;
}

const WriteKudoContext = createContext<WriteKudoContextValue | null>(null);

export function useWriteKudoContext(): WriteKudoContextValue {
  const ctx = useContext(WriteKudoContext);
  if (!ctx) {
    throw new Error('useWriteKudoContext must be used within WriteKudoProvider');
  }
  return ctx;
}

export function WriteKudoProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const pendingRecipientRef = useRef<RecipientProfile | undefined>(undefined);
  const [defaultRecipient, setDefaultRecipient] = useState<RecipientProfile | undefined>(undefined);
  const router = useRouter();

  const openWriteKudo = useCallback((recipient?: RecipientProfile) => {
    pendingRecipientRef.current = recipient;
    setDefaultRecipient(recipient);
    setIsOpen(true);
  }, []);

  const closeWriteKudo = useCallback(() => {
    setIsOpen(false);
    pendingRecipientRef.current = undefined;
    setDefaultRecipient(undefined);
  }, []);

  const handleSuccess = useCallback(() => {
    setIsOpen(false);
    pendingRecipientRef.current = undefined;
    setDefaultRecipient(undefined);
    router.refresh();
  }, [router]);

  return (
    <WriteKudoContext.Provider value={{ openWriteKudo, closeWriteKudo }}>
      {children}
      {isOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <WriteKudoModal onClose={handleSuccess} defaultRecipient={defaultRecipient} />,
          document.body,
        )}
    </WriteKudoContext.Provider>
  );
}
