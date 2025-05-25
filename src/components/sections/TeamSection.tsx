import React from 'react';

const TeamSection: React.FC = () => {
  return (
    <section id="our-team" className="py-20 bg-blue-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Meet <span className="text-blue-600">Our Team</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Our skilled experts are passionate about building innovative AI solutions to empower your success.
          </p>
        </div>

        <div className="space-y-10">
          {/* Team Member 1 */}
          <div className="flex flex-col md:flex-row items-center gap-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg transform transition hover:shadow-2xl hover:scale-105 duration-300">
            <img
              src="/images/alfred.jpeg"
              alt="Team member"
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-600"
            />
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                Alfred Williamson
              </h3>
              <p className="text-sm text-blue-600 mb-2">Chief Executive Officer</p>
              <p className="text-gray-600 dark:text-gray-300">
                Alfred Williamson is a dedicated leader with expertise spanning Physics, Government, and innovative business strategy.
              </p>
            </div>
          </div>

          {/* Team Member 2 */}
          <div className="flex flex-col md:flex-row items-center gap-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg transform transition hover:shadow-2xl hover:scale-105 duration-300">
            <img
              src="/images/emre.jpeg"
              alt="Team member"
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-600"
            />
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                Suleyman Emre Isik
              </h3>
              <p className="text-sm text-blue-600 mb-2">Chief Technology Officer</p>
              <p className="text-gray-600 dark:text-gray-300">
                Emre Isik is a Cambridge Engineering student and AI safety researcher dedicated to developing sustainable technology solutions.
              </p>
            </div>
          </div>

          {/* Team Member 3 */}
          <div className="flex flex-col md:flex-row items-center gap-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg transform transition hover:shadow-2xl hover:scale-105 duration-300">
            <img
              src="/images/usman.jpeg"
              alt="Team member"
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-600"
            />
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                Usman Ali
              </h3>
              <p className="text-sm text-blue-600 mb-2">Chief Financial Officer</p>
              <p className="text-gray-600 dark:text-gray-300">
                Usman Ali founded AdvisorAI after a successful career as a financial advisor, with a vision to revolutionize workflow automation using AI.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
