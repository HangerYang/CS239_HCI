"use client"
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const HelpPage = () => {
  const router = useRouter();

  const handleBackClick = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 relative"
    style={{ backgroundImage: "url('/icons/background1.jpeg')" }}>
    <button 
      onClick={handleBackClick}
      className="absolute top-8 left-8 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200 flex items-center justify-center"
    >
      <Image
        src="/icons/back.png"
        alt="Back"
        width={24}
        height={24}
        className="text-white"
      />
    </button>

    <div className="mt-16 max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-8 text-gray-800">
        <h1 className="text-2xl font-bold mb-6 text-center">Help & Tips</h1>
          
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Conversation Practice</h2>
              <p className="text-gray-600">
                Practice your language skills in realistic scenarios. Type or speak your responses.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Using the App</h2>
              <ul className="list-disc pl-5 text-gray-600 space-y-2">
                <li>Click "Send" or press Enter to submit your response</li>
                <li>Use "End Convo" to finish the current practice session</li>
                <li>Create custom scenarios to practice specific situations</li>
                <li>Review your conversations to track your progress</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Need More Help?</h2>
              <p className="text-gray-600">
                Contact us at support@langapp.com for additional assistance or to provide feedback.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;