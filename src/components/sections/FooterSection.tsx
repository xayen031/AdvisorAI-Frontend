import React from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Twitter,
  Github,
} from 'lucide-react';

const FooterSection: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 pt-12 pb-6 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
        {/* Brand & Description */}
        <div>
          <h2 className="text-2xl font-bold text-blue-600 mb-4">AdvisorAI</h2>
          <p className="text-sm leading-relaxed max-w-sm">
            Empowering financial advisors with real-time AI assistance during client meetings. Secure. Seamless. Smart.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#hero" className="hover:text-blue-600 transition-colors">Home</a></li>
            <li><a href="#about" className="hover:text-blue-600 transition-colors">About</a></li>
            <li><a href="#how-it-works" className="hover:text-blue-600 transition-colors">How It Works</a></li>
            <li><a href="#our-team" className="hover:text-blue-600 transition-colors">Team</a></li>
            <li><a href="#contact" className="hover:text-blue-600 transition-colors">Contact</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <MapPin size={16} className="mt-1 text-blue-600" />
              251 Little Falls Dr, Wilmington, DE 19808
            </li>
            <li className="flex items-start gap-2">
              <Mail size={16} className="mt-1 text-blue-600" />
              <a href="mailto:info@advisorai.io" className="hover:text-blue-600 transition-colors">
                info@advisorai.io
              </a>
            </li>
            <li className="flex items-start gap-2">
              <Phone size={16} className="mt-1 text-blue-600" />
              +1 (818) 791-1980
            </li>
          </ul>
        </div>
      </div>

      {/* Divider & Bottom */}
      <div className="border-t border-gray-200 dark:border-gray-700 mt-10 pt-6 text-sm text-center">
        <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto px-4 gap-4">
          <p>© {new Date().getFullYear()} AdvisorAI. All rights reserved.</p>
          <div className="flex space-x-4">
            <a href="https://linkedin.com" className="hover:text-blue-600 transition-colors" aria-label="LinkedIn">
              <Linkedin size={18} />
            </a>
            <a href="https://twitter.com" className="hover:text-blue-600 transition-colors" aria-label="Twitter">
              <Twitter size={18} />
            </a>
            <a href="https://github.com" className="hover:text-blue-600 transition-colors" aria-label="GitHub">
              <Github size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
