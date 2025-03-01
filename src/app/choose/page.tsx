"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import TypewriterEffect from '../../components/TypewriterEffect';

const LanguagePractice = () => {
  const [firstLineComplete, setFirstLineComplete] = useState(false);
  const router = useRouter();

  const handleSpeakingClick = () => {
    localStorage.setItem('practiceMode', 'Speaking');
    router.push('/text');
  };
  
  const handleTypingClick = () => {
    localStorage.setItem('practiceMode', 'Typing');
    router.push('/text');
  };

  return (
    <div className="min-h-screen bg-black p-8"
    style={{ backgroundImage: "url('/icons/background1.jpeg')" }}>
      <div className="mt-24 max-w-2xl mx-auto mb-8 bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 relative flex-shrink-0">
              <Image
                src="/icons/chatbot.png"
                alt="Chatbot Icon"
                fill
                className="rounded-full"
                priority
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-gray-800">
                <TypewriterEffect 
                  text="Hi there! It's me, Chatty McChatFace!" 
                  delay={30}
                  startTyping={true}
                  onComplete={() => setFirstLineComplete(true)}
                />
              </h1>
              <p className="mt-2 text-xl text-gray-600">
                <TypewriterEffect 
                  text="How are we practicing today?"
                  delay={30}
                  startTyping={firstLineComplete}
                />
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto flex flex-col gap-6 mt-16">
        <div className="grid grid-cols-2 gap-6">
          <button 
            onClick={handleSpeakingClick}
            className="bg-green-200 hover:bg-green-300 transition-colors duration-200 rounded-lg p-8 shadow-md h-24"> {/* Increased height with h-24 and p-8 */}
            <span className="text-lg font-semibold text-gray-800">Speaking</span>
          </button>
          <button 
            onClick={handleTypingClick}
            className="bg-blue-200 hover:bg-blue-300 transition-colors duration-200 rounded-lg p-8 shadow-md h-24"> {/* Increased height with h-24 and p-8 */}
            <span className="text-lg font-semibold text-gray-800">Typing</span>
          </button>
        </div>
        <button className="w-full bg-indigo-200 hover:bg-indigo-300 transition-colors duration-200 rounded-lg p-6 shadow-md">
          <span className="text-lg font-semibold text-gray-800">Profile and Review</span>
        </button>
      </div>
    </div>
  );
}

export default LanguagePractice;