import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HeroSection from '../components/landing/HeroSection.jsx';
import EntitiesStrip from '../components/landing/EntitiesStrip.jsx';
import TrustBand from '../components/landing/TrustBand.jsx';
import ChoicesSection from '../components/landing/ChoicesSection.jsx';
import FaqSection from '../components/landing/FaqSection.jsx';
import { usePageMeta } from '../hooks/usePageMeta.js';

// Página de inicio (rediseño 2026-10-20): portada con un resultado real de ejemplo,
// entidades, franja oscura de confianza, entrada al quiz y preguntas frecuentes.
const Landing = () => {
  usePageMeta('Banqueando | Compara tarjetas y créditos en Colombia', 'Compara tarjetas de crédito y créditos en Colombia con tarifas oficiales verificadas. Mira cuánto ganas o pagas al año con cada opción. Gratis.');
  return (
  <div className="min-h-screen bg-paper text-ink">
    <Navbar />
    <main>
      <HeroSection />
      <EntitiesStrip />
      <TrustBand />
      <ChoicesSection />
      <FaqSection />
    </main>
    <Footer />
  </div>
  );
};

export default Landing;
