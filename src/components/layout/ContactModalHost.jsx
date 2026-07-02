'use client';

import { useState, useEffect } from 'react';
import ContactModal from '../narrative/ContactModal';

// Listens for the 'open-contact-modal' custom event fired by Nav and
// ContactSection, then mounts the shared modal once at the layout level
// (outside any transformed ancestor, so position:fixed resolves to viewport).
export default function ContactModalHost() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener('open-contact-modal', onOpen);
    return () => window.removeEventListener('open-contact-modal', onOpen);
  }, []);

  return <ContactModal open={open} onClose={() => setOpen(false)} />;
}
