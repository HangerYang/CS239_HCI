"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import TypewriterEffect from '../../components/TypewriterEffect';
import { useScenarios } from '../../context/scenarioContext';

const ScenarioRoleplay = () => {
  const [firstLineComplete, setFirstLineComplete] = useState(false);
  const router = useRouter();
  const { scenarios } = useScenarios();

  const handleBackClick = () => {
    router.push('/text');
  };
  
  const handleClick = () => {
    router.push('/custom');
  };

  const handleClickJobInterview = () => {
    router.push('/scenario-text/interview');
  };
  
  const handleClickOrderFood = () => {
    router.push('/scenario-text/orderFood');
  };

  return (
    <div className="min-h-screen bg-black p-8 relative"
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
              <h1 className="text-lg font-bold text-gray-800">
                <TypewriterEffect 
                  text="You chose the Scenario Roleplay, which topic would you like to practice?" 
                  delay={30}
                  startTyping={true}
                  onComplete={() => setFirstLineComplete(true)}
                />
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto flex flex-col gap-6 mt-24">
        <button
          onClick={handleClickOrderFood} 
          className="w-full bg-green-200 hover:bg-green-300 transition-colors duration-200 rounded-lg p-6 shadow-md">
          <span className="text-lg font-semibold text-gray-800">Ordering Food</span>
        </button>
        <button
          onClick={handleClickJobInterview}
          className="w-full bg-green-200 hover:bg-green-300 transition-colors duration-200 rounded-lg p-6 shadow-md">
          <span className="text-lg font-semibold text-gray-800">Job Interview</span>
        </button>
        {scenarios.map((scenario) => (
          <button 
            key={scenario.id}
            className="w-full bg-blue-200 hover:bg-blue-300 transition-colors duration-200 rounded-lg p-6 shadow-md"
          >
            <span className="text-lg font-semibold text-gray-800">{scenario.title}</span>
          </button>
        ))}
        <button 
          onClick={handleClick}
          className="w-full bg-indigo-300 hover:bg-indigo-200 transition-colors duration-200 rounded-lg p-6 shadow-md"
        >
          <span className="text-lg font-semibold text-gray-800">Custom Topic</span>
        </button>
      </div>
    </div>
  );
}

export default ScenarioRoleplay;