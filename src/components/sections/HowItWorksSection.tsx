import React from 'react';
import {
  UserPlus,
  FileText,
  Mic,
  MessageCircleQuestion,
  Video,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const HowItWorksSection: React.FC = () => {
  return (
    <section id="how-it-works" className="py-20 bg-blue-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
            How <span className="text-blue-600">AdvisorAI</span> Works
          </h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
          <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Seamless Integration in Five Steps
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mt-12">
          {/* Step 1 */}
          <Card className="bg-[#F2FCE2] dark:bg-gray-700 border-none shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mb-4 mx-auto">
                <UserPlus className="text-green-600 dark:text-green-300" size={24} />
              </div>
              <div className="text-center">
                <div className="inline-block bg-green-200 dark:bg-green-700 text-green-800 dark:text-green-200 text-sm font-medium rounded-full px-3 py-1 mb-3">
                  Step 1
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
                  Create an Account
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Sign up and open your meeting window in Google Chrome using Google Meet, Microsoft Teams, or Zoom (Google Meet recommended).
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Step 2 */}
          <Card className="bg-[#FEF7CD] dark:bg-gray-700 border-none shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-800 rounded-full flex items-center justify-center mb-4 mx-auto">
                <FileText className="text-yellow-600 dark:text-yellow-300" size={24} />
              </div>
              <div className="text-center">
                <div className="inline-block bg-yellow-200 dark:bg-yellow-700 text-yellow-800 dark:text-yellow-200 text-sm font-medium rounded-full px-3 py-1 mb-3">
                  Step 2
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
                  Set Up Client Profile
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Click the button at the top of the sidebar to create a new client profile by entering their first and last name.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Step 3 */}
          <Card className="bg-[#D3E4FD] dark:bg-gray-700 border-none shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Mic className="text-blue-600 dark:text-blue-300" size={24} />
              </div>
              <div className="text-center">
                <div className="inline-block bg-blue-200 dark:bg-blue-700 text-blue-800 dark:text-blue-200 text-sm font-medium rounded-full px-3 py-1 mb-3">
                  Step 3
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
                  Initiate Transcription
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Press the start button in the top right corner to inform your client that the meeting will be transcribed and stored in our CRM.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Step 4 */}
          <Card className="bg-[#FDE1D3] dark:bg-gray-700 border-none shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-800 rounded-full flex items-center justify-center mb-4 mx-auto">
                <MessageCircleQuestion className="text-orange-600 dark:text-orange-300" size={24} />
              </div>
              <div className="text-center">
                <div className="inline-block bg-orange-200 dark:bg-orange-700 text-orange-800 dark:text-orange-200 text-sm font-medium rounded-full px-3 py-1 mb-3">
                  Step 4
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
                  Start Chat Session
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Select the client's name, click on the meeting window, and ensure audio is toggled on.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Step 5 */}
          <Card className="bg-[#E5DEFF] dark:bg-gray-700 border-none shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Video className="text-purple-600 dark:text-purple-300" size={24} />
              </div>
              <div className="text-center">
                <div className="inline-block bg-purple-200 dark:bg-purple-700 text-purple-800 dark:text-purple-200 text-sm font-medium rounded-full px-3 py-1 mb-3">
                  Step 5
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
                  Conduct Your Meeting
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Begin your session on Google Meet, Zoom, or Microsoft Teams with AdvisorAI providing real-time assistance and responses to client inquiries.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <a
            href="#"
            className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try It Now
          </a>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
