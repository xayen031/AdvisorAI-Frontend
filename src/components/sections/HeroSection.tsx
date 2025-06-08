import React from 'react';
import { BrainCircuit } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '@/assets/logo.png'; // Adjust the path as necessary
const HeroSection: React.FC = () => {
  return (
    <section
      className="min-h-screen flex flex-col justify-center bg-gradient-to-br from-purple-600 via-blue-600 to-blue-500 text-white relative overflow-hidden"
      id="hero"
    >
      <div className="container mx-auto px-4 pt-24 pb-16 md:pt-32 md:pb-32 flex flex-col md:flex-row items-center gap-10">

        {/* Text Area */}
        <div className="w-full md:w-1/2 space-y-6">
          <h1 className="text-4xl md:text-6xl font-extrabold">
            Your Real-Time AI Assistant for Financial Advisors
          </h1>
          <p className="text-lg md:text-xl leading-relaxed">
            AdvisorAI empowers financial advisors with real-time assistance during client meetings, enhancing trust and professionalism. Our AI-driven platform seamlessly provides suggestions and securely logs conversations into our CRM, ensuring every interaction is impactful.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link
              to="/signup"
              className="px-8 py-3 font-medium bg-white text-blue-600 rounded-lg transform transition hover:scale-105 hover:bg-gray-200 duration-300 text-center"
            >
              Get Started
            </Link>
            <a 
              href="#about"
              className="px-8 py-3 font-medium border-solid text-white border-white border-2 rounded-lg transform transition hover:scale-105 duration-300 text-center"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Visual Area */}
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-10 w-full flex justify-center">
        <div className="animate-bounce">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
