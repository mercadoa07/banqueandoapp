import React from 'react';
import { FEATURED_ENTITIES } from '../../constants/landing.js';

// Con quién comparamos: nombres en texto (sin logos de terceros).
export default function EntitiesStrip() {
  return (
    <section className="bg-white border-y border-line">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-7 flex flex-wrap items-center gap-x-8 gap-y-3">
        <span className="text-sm text-muted shrink-0">Comparamos productos de</span>
        <ul className="flex flex-wrap gap-x-6 gap-y-2 font-display font-bold text-[17px] tracking-tight text-[#39464B]">
          {FEATURED_ENTITIES.map(e => <li key={e}>{e}</li>)}
        </ul>
      </div>
    </section>
  );
}
