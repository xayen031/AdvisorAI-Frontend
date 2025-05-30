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
            <video
              className="w-full h-full object-cover"
              controls
              autoPlay
              muted
              playsInline
            >
              <source src="/advisoraidemo.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
