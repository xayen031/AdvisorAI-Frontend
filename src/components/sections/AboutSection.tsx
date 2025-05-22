import React from 'react';
import { Users, Award, BarChart3 } from 'lucide-react';

const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2">
            About <span className="text-blue-600">AdvisorAI</span>
          </h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full"></div>
          <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Transforming Client Meetings with AI
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg transform transition hover:scale-105 duration-300">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-6 mx-auto">
              <Users className="text-white" size={28} />
            </div>
            <h3 className="text-xl font-bold text-center text-gray-800 dark:text-white mb-3">
              Our Team
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-center">
              A passionate group of AI scientists and experts dedicated to transforming challenges into opportunities.
            </p>
          </div>
          {/* Card 2 */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg transform transition hover:scale-105 duration-300">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-6 mx-auto">
              <Award className="text-white" size={28} />
            </div>
            <h3 className="text-xl font-bold text-center text-gray-800 dark:text-white mb-3">
              Our Mission
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-center">
              Empower individuals and organizations with AI tools that simplify complex decision-making.
            </p>
          </div>
          {/* Card 3 */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg transform transition hover:scale-105 duration-300">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-6 mx-auto">
              <BarChart3 className="text-white" size={28} />
            </div>
            <h3 className="text-xl font-bold text-center text-gray-800 dark:text-white mb-3">
              Our Technology
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-center">
              Leveraging advanced machine learning models to deliver personalized, actionable insights.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
