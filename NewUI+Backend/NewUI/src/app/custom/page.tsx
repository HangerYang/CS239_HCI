"use client"
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ScenarioProvider, useScenarios } from '../../context/scenarioContext';
import { auth } from "../../../server/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

const CustomScenarioWrapper = () => {
  return (
    <ScenarioProvider>
      <CustomScenario />
    </ScenarioProvider>
  );
};

const CustomScenario = () => {
  const [scenario, setScenario] = useState('');
  const router = useRouter();
  const { addScenario } = useScenarios();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Check for authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setScenario(event.target.value);
  };

  const handleSubmit = () => {
    if (scenario.trim()) {
      addScenario(scenario);
      //locally store the new topic
      const savedScenarios = JSON.parse(localStorage.getItem('userScenarios') || '[]');
      const updatedScenarios = [...savedScenarios, {
        id: Date.now().toString(),
        title: scenario
      }];
      localStorage.setItem('userScenarios', JSON.stringify(updatedScenarios));
      
      router.push('/scenario');
    }
  };

  const handleBackClick = () => {
    router.push('/scenario');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ backgroundImage: "url('/icons/background1.jpg')", backgroundSize: "cover" }}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#48d1cc]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-8 relative"
    style={{ backgroundImage: "url('/icons/background1.jpg')" }}>
      <button 
        onClick={handleBackClick}
        className="absolute top-8 left-24 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200 flex items-center justify-center"
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
          <div className="flex items-center space-x-6 mb-6">
            <div className="w-16 h-16 relative flex-shrink-0">
              <Image
                src="/icons/idea.png" 
                alt="Custom Scenario Icon"
                fill
                className="rounded-full"
                priority
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              Create Your Custom Scenario
            </h1>
          </div>
          
          {/* <input
            type="text"
            value={scenario}
            onChange={handleInputChange}
            className="w-full p-4 border border-gray-300 rounded-lg mb-6 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#48d1cc] focus:border-transparent"
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          /> */}
          <textarea
          value={scenario}
          onChange={handleInputChange}
          className="w-full p-4 border border-gray-300 rounded-lg mb-6 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#48d1cc] focus:border-transparent resize-none"
          rows={4}  // Allows multiple lines of input
          maxLength={1000}  // Increase the character limit
          placeholder="Describe your custom scenario..."
          onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSubmit()} // Allows enter key to submit without shift
          />
          <button
            onClick={handleSubmit}
            className="w-full bg-[#48d1cc] hover:bg-[#20b2aa] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create Scenario
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomScenarioWrapper;