"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import TypewriterEffect from '../../components/TypewriterEffect';

const TypingPractice = () => {
  const [firstLineComplete, setFirstLineComplete] = useState(false);
  const [selectedMode, setSelectedMode] = useState('');
  const router = useRouter();

  useEffect(() => {
    const mode = localStorage.getItem('practiceMode');
    if (mode) {
      setSelectedMode(mode);
    }
  }, []);

  const handleBackClick = () => {
    router.push('/choose');
  };
  
  const handleTypingClick = () => {
    router.push('/scenario-text');
  };
  
  const handleTypingClick2 = () => {
    router.push('/conversation-type');
  };

  return (
    <div 
      className="min-h-screen relative bg-cover bg-center p-8" 
      style={{ backgroundImage: "url('/icons/background1.jpeg')" }}
    >
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
              <h1 className="text-xl font-bold text-gray-800">
                <TypewriterEffect 
                  text={`You've selected ${selectedMode} Mode. Now, how do you want to practice?`}
                  delay={30}
                  startTyping={true}
                  onComplete={() => setFirstLineComplete(true)}
                />
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto flex flex-col gap-6 mt-16">
        <button 
          onClick={handleTypingClick2}
          className="w-full bg-green-200 hover:bg-green-300 transition-colors duration-200 rounded-lg p-6 shadow-md">
          <span className="text-lg font-semibold text-gray-800">Conversation Practice</span>
        </button>
        <button 
          onClick={handleTypingClick}
          className="w-full bg-indigo-200 hover:bg-indigo-300 transition-colors duration-200 rounded-lg p-6 shadow-md">
          <span className="text-lg font-semibold text-gray-800">Scenario Roleplay</span>
        </button>
      </div>
    </div>
  );
}

export default TypingPractice;