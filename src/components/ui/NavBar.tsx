import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  return (
    <nav className="bg-white dark:bg-gray-900 fixed w-full z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="#hero" className="text-2xl font-bold text-blue-600">
              AdvisorAI
            </a>
          </div>
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center">
            <div className="ml-10 flex items-baseline space-x-4">
              <a
                href="#hero"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-800 dark:text-white hover:text-blue-600"
              >
                Home
              </a>
              <a
                href="#about"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-800 dark:text-white hover:text-blue-600"
              >
                About
              </a>
              <a
                href="#how-it-works"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-800 dark:text-white hover:text-blue-600"
              >
                How It Works
              </a>
              <a
                href="#video-section"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-800 dark:text-white hover:text-blue-600"
              >
                Video
              </a>
              <a
                href="#our-team"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-800 dark:text-white hover:text-blue-600"
              >
                Team
              </a>
              <a
                href="#contact"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-800 dark:text-white hover:text-blue-600"
              >
                Contact
              </a>
            </div>
            <Link
              to="/signin"
              className="ml-6 px-4 py-2 rounded bg-blue-600 text-white font-semibold text-sm shadow hover:bg-blue-700 transition-colors duration-200"
            >
              Sign In
            </Link>
          </div>
          {/* Mobile Menu Button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="bg-gray-100 dark:bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-800 dark:text-white hover:text-blue-600 focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded={isOpen ? 'true' : 'false'}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a
              href="#hero"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 dark:text-white hover:text-blue-600"
            >
              Home
            </a>
            <a
              href="#about"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 dark:text-white hover:text-blue-600"
            >
              About
            </a>
            <a
              href="#how-it-works"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 dark:text-white hover:text-blue-600"
            >
              How It Works
            </a>
            <a
              href="#video-section"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 dark:text-white hover:text-blue-600"
            >
              Video
            </a>
            <a
              href="#our-team"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 dark:text-white hover:text-blue-600"
            >
              Team
            </a>
            <a
              href="#contact"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 dark:text-white hover:text-blue-600"
            >
              Contact
            </a>
            <Link
              to="/signin"
              className="block w-full mt-3 px-4 py-2 rounded bg-blue-600 text-white font-semibold text-base shadow hover:bg-blue-700 text-center transition-colors duration-200"
            >
              Sign In
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
