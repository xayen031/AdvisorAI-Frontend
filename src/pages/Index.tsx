import React from 'react';

// Import your newly created sections:
import NavBar from '@/components/ui/NavBar';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import HowItWorksSection from '@/components/sections/HowItWorksSection';
import VideoSection from '@/components/sections/VideoSection';
import TeamSection from '@/components/sections/TeamSection';
import PricingSection from '@/components/sections/PricingSection';
import ContactSection from '@/components/sections/ContactSection';
import FooterSection from '@/components/sections/FooterSection';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <NavBar />
      <HeroSection />
      <AboutSection />
      <HowItWorksSection />
      <VideoSection />
      <TeamSection />
      <PricingSection />
      <ContactSection />
      <FooterSection />
    </div>
  );
};

export default Index;
