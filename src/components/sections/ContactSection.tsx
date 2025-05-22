import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const ContactSection: React.FC = () => {
  return (
    <section id="contact" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Contact Us
          </h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </div>
        <div className="md:flex md:space-x-8">
          {/* Left Column: Contact Details */}
          <div className="md:w-1/2 mb-8 md:mb-0 flex flex-col justify-center h-full">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Get in Touch
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Reach us directly using the information below or send us a message.
            </p>
            <ul className="space-y-5 text-gray-700 dark:text-gray-300 text-sm">
              <li className="flex items-start gap-3">
                <Phone size={20} className="text-blue-600 dark:text-blue-400 mt-1" />
                <div>
                  <p className="font-semibold">Phone</p>
                  <p>(123) 456-7890</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={20} className="text-blue-600 dark:text-blue-400 mt-1" />
                <div>
                  <p className="font-semibold">Email</p>
                  <a
                    href="mailto:info@example.com"
                    className="hover:text-blue-600 dark:hover:text-blue-300 transition"
                  >
                    info@example.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-blue-600 dark:text-blue-400 mt-1" />
                <div>
                  <p className="font-semibold">Location</p>
                  <p>123 Main Street, City, Country</p>
                </div>
              </li>
            </ul>
          </div>
          {/* Right Column: Contact Form */}
          <div className="md:w-1/2">
            <form className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* First Name */}
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-gray-800 dark:text-white mb-2 font-medium"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    placeholder="First Name"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                  />
                </div>
                {/* Last Name */}
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-gray-800 dark:text-white mb-2 font-medium"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    placeholder="Last Name"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                  />
                </div>
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-gray-800 dark:text-white mb-2 font-medium"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Email Address"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                  />
                </div>
                {/* Phone Number */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-gray-800 dark:text-white mb-2 font-medium"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    placeholder="Phone Number"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                  />
                </div>
                {/* Address (optional) */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="address"
                    className="block text-gray-800 dark:text-white mb-2 font-medium"
                  >
                    Address (Optional)
                  </label>
                  <input
                    type="text"
                    id="address"
                    placeholder="Your Address"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                  />
                </div>
                {/* Message */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="message"
                    className="block text-gray-800 dark:text-white mb-2 font-medium"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    placeholder="Your Message"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                  ></textarea>
                </div>
              </div>
              <button
                type="submit"
                className="mt-6 w-full py-3 bg-blue-600 text-white font-bold rounded-md shadow-lg transform transition hover:scale-105 hover:bg-blue-700 duration-300"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
