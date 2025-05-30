import React from 'react';

const VideoSection: React.FC = () => {
  return (
    <section id="video-section" className="py-20 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2">
            See <span className="text-blue-600">AdvisorAI</span> in Action
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Watch this quick video to see how AdvisorAI transforms your data into actionable insights.
          </p>
        </div>
        <div className="flex justify-center">
          <div className="relative w-full max-w-4xl aspect-video rounded-3xl overflow-hidden shadow-2xl">
            <iframe
              className="w-full h-full"
              src="https://youtu.be/o2Bax--rnd4?si=H__Oar0u4dh_EUx3"
              title="How AdvisorAI Works"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
