"use client"
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import TypewriterEffect from '../../components/TypewriterEffect';
import { auth } from "../../../server/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { getUserProfile } from '@/services/api';

const ChoosePage = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const [userLanguage, setUserLanguage] = useState<string>('en');
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Get username
        const username = currentUser.displayName || currentUser.email?.split('@')[0] || 'Guest';
        
        try {
          // Retrieve user profile
          const { data, error } = await getUserProfile(username);
          
          if (data && !error) {
            if (data.language) {
              setUserLanguage(data.language);
              localStorage.setItem('locale', data.language);
            } else {
              // Set default language to English
              const savedLocale = localStorage.getItem('locale') || 'en';
              setUserLanguage(savedLocale);
            }
          }
        } catch (err) {
          console.error("Error fetching user profile:", err);
          const savedLocale = localStorage.getItem('locale') || 'en';
          setUserLanguage(savedLocale);
        }
      } else {
        const savedLocale = localStorage.getItem('locale') || 'en';
        setUserLanguage(savedLocale);
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

  const handleBackClick = () => {
    router.push('/');
  };
  
  const handleTypingClick = () => {
    saveUserState();
    router.push('/scenario');
  };
  
  const handleTypingClick2 = () => {
    saveUserState();
    router.push('/conversation');
  };

  const navigateToDashboard = () => {
    router.push('/dashboard');
    setShowProfileMenu(false);
  };
  
  const saveUserState = () => {
    if (user) {
      const username = user.displayName || user.email?.split('@')[0] || 'Guest';
      localStorage.setItem('userName', username);
      localStorage.setItem('locale', userLanguage);
    }
  };

  const getDisplayLanguage = (locale: string): string => {
    const localeMap: Record<string, string> = {
      'en': 'English',
      'zh-CN': 'Chinese',
      'ja': 'Japanese'
    };
    return localeMap[locale] || 'English';
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
    <div 
      className="min-h-screen relative bg-cover bg-center p-8" 
      style={{ backgroundImage: "url('/icons/background1.jpg')" }}
    >
      <div className="absolute top-8 left-8 z-10" ref={profileMenuRef}>
        <button 
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200 flex items-center justify-center overflow-hidden"
          aria-label="Profile Menu"
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
              <p className="text-xs text-gray-500">Language: {getDisplayLanguage(userLanguage)}</p>
            </div>
            {user ? (
              <div>
                <button 
                  onClick={navigateToDashboard}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile Dashboard
                </button>
              </div>
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
                  text={user?.displayName 
                    ? `Welcome, ${user.displayName}! How do you want to practice ${getDisplayLanguage(userLanguage)}?` 
                    : `Welcome! How do you want to practice ${getDisplayLanguage(userLanguage)}?`}
                  delay={30}
                  startTyping={true}
                />
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto flex flex-col gap-6 mt-16">
        <button 
          onClick={handleTypingClick2}
          className="w-full bg-green-200 hover:bg-green-300 transition-colors duration-200 rounded-lg p-6 shadow-md flex items-center justify-center"
        >
          <span className="text-lg font-semibold text-gray-800">Conversation Practice</span>
        </button>
        
        <button 
          onClick={handleTypingClick}
          className="w-full bg-indigo-200 hover:bg-indigo-300 transition-colors duration-200 rounded-lg p-6 shadow-md flex items-center justify-center"
        >
          <span className="text-lg font-semibold text-gray-800">Scenario Roleplay</span>
        </button>
      </div>
    </div>
  );
}

export default ChoosePage;