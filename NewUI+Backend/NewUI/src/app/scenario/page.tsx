"use client"
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { auth } from "../../../server/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { getUserProfile, setScenario } from '@/services/api';

interface Scenario {
  id: string;
  title: string;
  description: string;
  created_at: string;
  custom: boolean;
}

const ScenarioPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [userLanguage, setUserLanguage] = useState<string>('en');
  const [searchQuery, setSearchQuery] = useState('');
  
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Predefined scenarios
  const defaultScenarios: Scenario[] = [
    {
      id: 'restaurant',
      title: 'Restaurant Order',
      description: 'Practice ordering food at a restaurant',
      created_at: new Date().toISOString(),
      custom: false
    },
    {
      id: 'job_interview',
      title: 'Job Interview',
      description: 'Practice for a job interview',
      created_at: new Date().toISOString(),
      custom: false
    },
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      const savedLocale = localStorage.getItem('locale') || 'en';
      setUserLanguage(savedLocale);
      
      setScenarios(defaultScenarios);
      
      if (currentUser) {
        try {
          const username = currentUser.displayName || currentUser.email?.split('@')[0] || 'Guest';
          
          const response = await getUserProfile(username);
          
          if (response && response.data && !response.error) {
            // If user has custom scenarios, add them to the list
            if (response.data.custom_scenarios && Array.isArray(response.data.custom_scenarios)) {
              const customScenarios = response.data.custom_scenarios.map((scenario: any, index: number) => ({
                id: `custom-${index}`,
                title: scenario.title || `Custom Scenario ${index + 1}`,
                description: scenario.description || "",
                created_at: scenario.created_at || new Date().toISOString(),
                custom: true
              }));
              
              // Combine default scenarios with custom scenarios
              setScenarios([...defaultScenarios, ...customScenarios]);
            }
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }
      
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update the scenario list with latest custom scenarios
  const refreshCustomScenarios = async () => {
    if (!user) return;
    
    const username = user.displayName || user.email?.split('@')[0] || 'Guest';
    
    try {
      const response = await getUserProfile(username);
      
      if (response && response.data && !response.error) {
        if (response.data.custom_scenarios && Array.isArray(response.data.custom_scenarios)) {
          const customScenarios = response.data.custom_scenarios.map((scenario: any, index: number) => ({
            id: `custom-${index}`,
            title: scenario.title || `Custom Scenario ${index + 1}`,
            description: scenario.description || "",
            created_at: scenario.created_at || new Date().toISOString(),
            custom: true
          }));
          
          // Combine default scenarios with updated custom scenarios
          setScenarios([...defaultScenarios, ...customScenarios]);
        } else {
          setScenarios(defaultScenarios);
        }
      }
    } catch (error) {
      console.error("Error refreshing custom scenarios:", error);
    }
  };

  const handleBackClick = () => {
    router.push('/choose');
  };
  
  const navigateToDashboard = () => {
    router.push('/dashboard');
    setShowProfileMenu(false);
  };

  const handleAddCustomScenario = () => {
    router.push('/scenario/custom');
  };

  const handleScenarioClick = async (scenario: Scenario) => {
    if (!user) {
      alert("Please log in to start a scenario");
      return;
    }

    try {
      const username = user.displayName || user.email?.split('@')[0] || 'Guest';
      
      const response = await setScenario(
        username,
        scenario.id,       
        userLanguage,        
        scenario.description
      );
      
      // Navigate to the customed scenario page
      if (scenario.custom) {
        const scenarioIndex = scenario.id.split('-')[1];
        router.push(`/scenario/custom/${scenarioIndex}`);
      } else {
        localStorage.setItem('currentScenario', JSON.stringify(scenario));
        router.push('/roleplay');
      }
    } catch (error) {
      console.error("Error setting scenario:", error);
      alert("There was a problem starting the scenario. Please try again.");
    }
  };

  const filteredScenarios = scenarios.filter(scenario => 
    scenario.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    scenario.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ backgroundImage: "url('/icons/background1.jpg')", backgroundSize: "cover" }}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#48d1cc]"></div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen relative bg-cover bg-center"
      style={{ backgroundImage: "url('/icons/background1.jpg')" }}
    >
      <div className="absolute top-8 left-8 z-10" ref={profileMenuRef}>
        <button 
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200 flex items-center justify-center overflow-hidden"
        >
          {user?.photoURL ? (
            <Image
              src={user.photoURL}
              alt="Profile"
              width={40}
              height={40}
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-[#48d1cc] flex items-center justify-center text-white font-semibold text-sm">
              {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 
               user?.email ? user.email.charAt(0).toUpperCase() : "G"}
            </div>
          )}
        </button>
        
        {showProfileMenu && (
          <div className="absolute top-12 left-0 bg-white rounded-lg shadow-lg py-2 min-w-[180px] text-gray-800 z-20">
            <div className="px-4 py-2 border-b border-gray-200">
              <p className="font-medium">{user?.displayName || "Guest"}</p>
              {user?.email && (
                <p className="text-xs text-gray-500">{user.email}</p>
              )}
            </div>
            <div className="px-4 py-2 border-b border-gray-200">
              <p className="text-xs text-gray-500">Language: {userLanguage === 'en' ? 'English' : userLanguage === 'zh-CN' ? 'Chinese' : 'Japanese'}</p>
            </div>
            {user ? (
              <button 
                onClick={navigateToDashboard}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profile Dashboard
              </button>
            ) : (
              <button 
                onClick={() => router.push('/login')}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Sign In
              </button>
            )}
          </div>
        )}
      </div>
      
      <button 
        onClick={handleBackClick}
        className="absolute top-8 left-24 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200 flex items-center justify-center"
      >
        <Image
          src="/icons/back.png"
          alt="Back"
          width={24}
          height={24}
        />
      </button>
      
      <div className="container mx-auto pt-24 px-4">
        <div className="bg-white bg-opacity-90 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 relative flex-shrink-0">
              <Image
                src="/icons/chatbot.png"
                alt="Chatbot Icon"
                fill
                className="rounded-full object-cover"
                priority
              />
            </div>
            
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Choose a Scenario</h1>
            </div>
          </div>
          
          <div className="mt-6 flex items-center justify-between">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search scenarios..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            <button 
              onClick={handleAddCustomScenario}
              className="ml-4 bg-[#20b2aa] hover:bg-[#008080] text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Custom
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScenarios.map(scenario => (
            <div
              key={scenario.id}
              onClick={() => handleScenarioClick(scenario)}
              className={`bg-white bg-opacity-90 rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-xl ${
                scenario.custom ? 'border-2 border-[#20b2aa]' : ''
              }`}
            >
              <div className={`p-5 ${scenario.custom ? 'border-t-4 border-[#20b2aa]' : 'border-t-4 border-blue-500'}`}>
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-xl font-bold text-gray-800">{scenario.title}</h2>
                  {scenario.custom && (
                    <span className="bg-[#20b2aa] text-white text-xs px-2 py-1 rounded-full">
                      Custom
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mb-4">{scenario.description}</p>
                <div className="flex justify-end">
                  <button className="text-sm text-blue-600 hover:text-blue-800 transition-colors font-medium flex items-center">
                    Start Practice
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScenarioPage;