"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useScenarios } from '../../context/scenarioContext';

const CustomScenario = () => {
  const [scenario, setScenario] = useState('');
  const router = useRouter();
  const { addScenario } = useScenarios(); 

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setScenario(event.target.value);
  };

  const handleSubmit = () => {
    if (scenario.trim()) {
      addScenario(scenario); 
      router.push('/scenario-text'); 
    }
  };

  const handleBackClick = () => {
    router.push('/scenario-text');
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
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Describe your scenario
          </h1>
          <input
            type="text"
            value={scenario}
            onChange={handleInputChange}
            placeholder="Enter your scenario here..."
            className="w-full p-4 border border-gray-300 rounded-lg mb-6 text-gray-800"
          />
          <button
            onClick={handleSubmit}
            className="w-full bg-indigo-500 hover:bg-indigo-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Create Scenario
          </button>
        </div>
      </div>
    </div>
  );
}

export default CustomScenario;