"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import TypewriterEffect from '../components/TypewriterEffect';
import LanguageDropdown from '../components/LanguageDropdown';
import { auth } from '../../server/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserProfile, setScenario } from '@/services/api';

const MainPage = () => {
  const [firstLineComplete, setFirstLineComplete] = useState(false);
  const [userName, setUserName] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<'English' | 'Chinese' | 'Japanese'>('English');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(false);
  const router = useRouter();

  const languageIcons: Record<'English' | 'Chinese' | 'Japanese', string> = {
    'English': '🇺🇸',
    'Chinese': '🇨🇳',
    'Japanese': '🇯🇵'
  };
  
  const localeMap: Record<string, string> = {
    'English': 'en',
    'Chinese': 'zh-CN',
    'Japanese': 'ja'
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsLoggedIn(true);
        // Use display name if available, otherwise use email
        const displayName = user.displayName || user.email?.split('@')[0] || '';
        setUserName(displayName);
        
        try {
          // Fetch user profile from backend
          const { data, error } = await getUserProfile(displayName);
          
          if (data && !error) {
            // Save user's language preference
            if (data.language) {
              const savedLanguage = Object.keys(localeMap).find(
                key => localeMap[key] === data.language
              ) as 'English' | 'Chinese' | 'Japanese';
              
              if (savedLanguage) {
                setSelectedLanguage(savedLanguage);
              }
            }
          }
        } catch (err) {
          console.error("Error fetching user profile:", err);
        }
        
        // Store the user info
        localStorage.setItem('userName', displayName);
      } else {
        setIsLoggedIn(false);
        localStorage.removeItem('userName');
        localStorage.removeItem('userId');
      }
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  const handleClick = async () => {
    if (userName.trim()) {
      setInitializing(true);
      
      try {
        // Store user preferences
        localStorage.setItem('userName', userName);
        localStorage.setItem('language', selectedLanguage);
        localStorage.setItem('locale', localeMap[selectedLanguage]);
        
        // Create the user profile on the backend if it doesn't exist
        await setScenario(userName, "Default conversation");
      
        router.push('/choose');
      } catch (error) {
        console.error("Error initializing user:", error);
        alert("There was a problem connecting to the service. Please try again.");
      } finally {
        setInitializing(false);
      }
    }
  };

  const navigateToLogin = () => {
    router.push('/login');
  };

  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center" 
        style={{ backgroundImage: "url('/icons/background1.jpg')", backgroundSize: "cover" }}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#48d1cc]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-8" style={{ backgroundImage: "url('/icons/background1.jpg')" }}>
      <div className="mt-24 max-w-2xl mx-auto mb-8 bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 relative flex-shrink-0">
              <Image src="/icons/chatbot.png" alt="Chatbot Icon" fill className="rounded-full" priority />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-gray-800">
                <TypewriterEffect 
                  text={isLoggedIn ? `Welcome back, ${userName}!` : "Hi there! It's me, Chatty! Nice to meet you!"} 
                  delay={30}
                  startTyping={true}
                  onComplete={() => setFirstLineComplete(true)}
                />
              </h1>
              <p className="mt-2 text-l text-gray-600">
                <TypewriterEffect 
                  text={isLoggedIn 
                    ? "Please choose the language to continue practicing." 
                    : "Please enter your user name and choose the language before we start practicing together."}
                  delay={30}
                  startTyping={firstLineComplete}
                />
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto flex flex-col gap-6 mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-10 h-10 relative bg-green-100 rounded-full flex-shrink-0">
                <Image src="/icons/profile.png" alt="Profile Icon" fill className="p-2" />
              </div>
              <h2 className="text-xl font-semibold text-black">Username</h2>
            </div>
            
            <div className="relative">
              <input
                type="text"
                id="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className={`w-full px-6 py-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg text-black ${isLoggedIn ? 'bg-gray-100' : ''}`}
                required
                readOnly={isLoggedIn}
              />
              {userName && (
                <div className="absolute top-0 left-0 bg-[#87cefa] text-white px-2 py-0.5 text-xs rounded-tl-lg rounded-br-lg">
                  Profile Name
                </div>
              )}
              {!isLoggedIn && (
                <div className="mt-2 text-sm text-indigo-600">
                  <a href="/login" className="hover:underline">Login or Sign Up</a>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg overflow-hidden p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-10 h-10 relative bg-blue-100 rounded-full flex-shrink-0">
                <Image src="/icons/language.png" alt="Language Icon" fill className="p-2" />
              </div>
              <h2 className="text-xl font-semibold text-black">Choose Language</h2>
            </div>
            
            <LanguageDropdown 
              value={selectedLanguage}
              onChange={setSelectedLanguage}
              languageIcons={languageIcons}
            />
          </div>
        </div>
        
        <div className="flex justify-end mt-4">
          <button 
            onClick={handleClick}
            disabled={!userName.trim() || initializing}
            className={`transition-all duration-200 rounded-lg px-6 py-3 shadow-md flex items-center ${
              userName.trim() && !initializing
                ? 'bg-[#48d1cc] text-white hover:bg-[#008080]' 
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            {initializing ? (
              <>
                <span className="animate-spin mr-2 h-5 w-5 border-t-2 border-b-2 border-white rounded-full"></span>
                <span className="font-medium">Initializing...</span>
              </>
            ) : (
              <>
                <span className="font-medium mr-2">Continue</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MainPage;