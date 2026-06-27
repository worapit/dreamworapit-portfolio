'use client';

import { createContext, useCallback, useContext, useRef, useState } from 'react';

const ContactDialogContext = createContext(null);

/**
 * Site-wide contact dialog state. Any "Get in Touch" trigger (navbar,
 * mobile menu, future buttons) calls `open()` from this context instead
 * of navigating — the dialog itself is rendered once near the root.
 *
 * Tracks the element that had focus at open-time so it can be restored
 * when the dialog closes, regardless of which trigger opened it.
 */
export function ContactDialogProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerElRef = useRef(null);

  const open = useCallback(() => {
    triggerElRef.current = document.activeElement;
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <ContactDialogContext.Provider value={{ isOpen, open, close, triggerElRef }}>
      {children}
    </ContactDialogContext.Provider>
  );
}

export function useContactDialog() {
  const ctx = useContext(ContactDialogContext);
  if (!ctx) throw new Error('useContactDialog must be used within ContactDialogProvider');
  return ctx;
}
