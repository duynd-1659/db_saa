'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { RulesPanelDrawer } from './RulesPanelDrawer';

interface RulesPanelContextValue {
  openPanel: () => void;
  closePanel: () => void;
}

const RulesPanelContext = createContext<RulesPanelContextValue | null>(null);

export function useRulesPanelContext(): RulesPanelContextValue {
  const ctx = useContext(RulesPanelContext);
  if (!ctx) {
    throw new Error('useRulesPanelContext must be used within RulesPanelProvider');
  }
  return ctx;
}

export function RulesPanelProvider({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Guard against SSR hydration mismatch — portal only renders client-side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const openPanel = useCallback(() => setIsOpen(true), []);
  const closePanel = useCallback(() => setIsOpen(false), []);

  return (
    <RulesPanelContext.Provider value={{ openPanel, closePanel }}>
      {children}
      {isMounted &&
        createPortal(<RulesPanelDrawer isOpen={isOpen} onClose={closePanel} />, document.body)}
    </RulesPanelContext.Provider>
  );
}
