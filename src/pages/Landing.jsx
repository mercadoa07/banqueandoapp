import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HeroSection from '../components/landing/HeroSection.jsx';
import StatsSection from '../components/landing/StatsSection.jsx';
import ProblemSection from '../components/landing/ProblemSection.jsx';
import HowItWorksSection from '../components/landing/HowItWorksSection.jsx';
import BenefitsSection from '../components/landing/BenefitsSection.jsx';
import FaqSection from '../components/landing/FaqSection.jsx';
import FinalCtaSection from '../components/landing/FinalCtaSection.jsx';

const Landing = () => (
  <div className="min-h-screen bg-white">
    <Navbar />
    <HeroSection />
    <StatsSection />
    <ProblemSection />
    <HowItWorksSection />
    <BenefitsSection />
    <FaqSection />
    <FinalCtaSection />
    <Footer />
  </div>
);

export default Landing;
