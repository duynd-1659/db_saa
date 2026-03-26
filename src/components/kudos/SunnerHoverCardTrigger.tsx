'use client';

import { useCallback, useRef, useState } from 'react';
import type { SunnerHoverTarget } from '@/types/sunner-hover';
import type { RecipientProfile } from '@/types/kudo-write';
import { useWriteKudoContext } from './write-kudo/WriteKudoProvider';
import { SunnerHoverCard } from './SunnerHoverCard';

interface SunnerHoverCardTriggerProps {
  target: SunnerHoverTarget;
  children: React.ReactNode;
  /** Extra classes for the trigger wrapper element */
  wrapperClassName?: string;
  /** Extra inline styles for the trigger wrapper element */
  wrapperStyle?: React.CSSProperties;
}

export function SunnerHoverCardTrigger({
  target,
  children,
  wrapperClassName,
  wrapperStyle,
}: SunnerHoverCardTriggerProps): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const [anchorStyle, setAnchorStyle] = useState<React.CSSProperties>({});
  const triggerRef = useRef<HTMLSpanElement | null>(null);
  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { openWriteKudo } = useWriteKudoContext();

  const clearTimers = useCallback(() => {
    if (openTimerRef.current) clearTimeout(openTimerRef.current);
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
  }, []);

  const computeAnchor = useCallback((el: HTMLElement): React.CSSProperties => {
    const rect = el.getBoundingClientRect();
    const CARD_HEIGHT = 220;

    const centerX = rect.left + rect.width / 2;
    let top = rect.bottom + 8;

    if (top + CARD_HEIGHT > window.innerHeight - 16) {
      top = rect.top - CARD_HEIGHT - 8;
    }

    // Use translateX(-50%) to center the card on the anchor point
    return { position: 'fixed', top, left: centerX, transform: 'translateX(-50%)' };
  }, []);

  const handleMouseEnter = useCallback(() => {
    clearTimers();
    openTimerRef.current = setTimeout(() => {
      if (triggerRef.current) {
        setAnchorStyle(computeAnchor(triggerRef.current));
      }
      setIsOpen(true);
    }, 150);
  }, [clearTimers, computeAnchor]);

  const handleMouseLeave = useCallback(() => {
    clearTimers();
    closeTimerRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 100);
  }, [clearTimers]);

  const handleCardMouseEnter = useCallback(() => {
    clearTimers();
  }, [clearTimers]);

  const handleCardMouseLeave = useCallback(() => {
    clearTimers();
    closeTimerRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 100);
  }, [clearTimers]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (triggerRef.current) {
          setAnchorStyle(computeAnchor(triggerRef.current));
        }
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    },
    [computeAnchor],
  );

  const handleSendKudo = useCallback(() => {
    setIsOpen(false);
    const recipient: RecipientProfile = {
      id: target.userId,
      full_name: target.name,
      avatar_url: target.avatarUrl,
      department_name: target.department,
    };
    openWriteKudo(recipient);
  }, [target, openWriteKudo]);

  return (
    <>
      <span
        ref={triggerRef}
        className={wrapperClassName}
        style={wrapperStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        data-hovered={isOpen ? 'true' : undefined}
      >
        {children}
      </span>
      {isOpen && (
        <SunnerHoverCard
          target={target}
          anchorStyle={anchorStyle}
          onMouseEnter={handleCardMouseEnter}
          onMouseLeave={handleCardMouseLeave}
          onSendKudo={handleSendKudo}
        />
      )}
    </>
  );
}
