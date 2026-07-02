'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AllProjectsButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Observe the first proj-section (not #work) so the button only
    // appears when actual project cards are in view — not during the
    // work section's top padding while the hero is still visible.
    const firstCard = document.querySelector('.proj-section');
    const contact   = document.getElementById('contact');
    const hero      = document.getElementById('home');
    if (!firstCard) return;

    let workVisible    = false;
    let contactVisible = false;
    let heroVisible    = true; // assume visible until first observer fire

    const update = () => setVisible(workVisible && !contactVisible && !heroVisible);

    const workObs    = new IntersectionObserver(([e]) => { workVisible    = e.isIntersecting; update(); }, { threshold: 0 });
    const contactObs = new IntersectionObserver(([e]) => { contactVisible = e.isIntersecting; update(); }, { threshold: 0 });
    const heroObs    = new IntersectionObserver(([e]) => { heroVisible    = e.isIntersecting; update(); }, { threshold: 0 });

    workObs.observe(firstCard);
    if (contact) contactObs.observe(contact);
    if (hero)    heroObs.observe(hero);

    return () => { workObs.disconnect(); contactObs.disconnect(); heroObs.disconnect(); };
  }, []);

  return (
    <div
      className={`all-projects-btn${visible ? ' all-projects-btn--visible' : ''}`}
      aria-hidden={!visible}
    >
      <Link href="/work" tabIndex={visible ? 0 : -1} className="btn btn--out btn--sm">
        All Projects&nbsp;→
      </Link>
    </div>
  );
}
