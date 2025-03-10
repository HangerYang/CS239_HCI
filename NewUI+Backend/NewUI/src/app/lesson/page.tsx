"use client"
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { auth } from "../../../server/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

interface LessonResponse {
  critique: string;
  lessons: string[];
}

const LessonPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [lessons, setLessons] = useState<string[]>([]);
  const [critique, setCritique] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      
      if (currentUser) {
        // If user is logged in, fetch their lessons
        fetchLessons();
      }
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

  const fetchLessons = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const username = user.displayName || user.email?.split('@')[0] || 'Guest';
      
      // Fetch lessons from your backend API
      const response = await fetch('http://localhost:8000/api/get_lessons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data: LessonResponse = await response.json();
      
      setLessons(data.lessons);
      setCritique(data.critique);
    } catch (error) {
      console.error('Error fetching lessons:', error);
      setLessons(['Practice basic conversation starters', 'Work on your pronunciation', 'Try to expand your vocabulary']);
      setCritique('Based on your recent conversations, you should focus on building confidence in everyday conversations.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackClick = () => {
    router.back();
  };
  
  const navigateToDashboard = () => {
    router.push('/dashboard');
    setShowProfileMenu(false);
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
    <div className="min-h-screen bg-gray-900 text-white relative"
    style={{ backgroundImage: "url('/icons/background1.jpg')" }}>
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

      {/* Back button */}
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

      <div className="pt-24 px-4 max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2 text-black">Lessons</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Critique section */}
          <div className="bg-[#f0f8ff] rounded-xl p-6 shadow-lg">
            <div className="flex items-center mb-4">
              <div className="bg-[#20b2aa] rounded-full p-2 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Conversation Analysis</h2>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#20b2aa]"></div>
              </div>
            ) : (
              <div className="bg-white rounded-lg p-4 text-gray-700">
                <p className="italic text-lg">{critique || 'No analysis available yet. Continue practicing conversations to receive personalized feedback.'}</p>
              </div>
            )}
          </div>

          {/* Lessons section */}
          <div className="bg-[#f0f8ff] rounded-xl p-6 shadow-lg">
            <div className="flex items-center mb-4">
              <div className="bg-[#20b2aa] rounded-full p-2 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 19 7.5 19s3.332-.523 4.5-1.299m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 19 16.5 19c-1.746 0-3.332-.523-4.5-1.299" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Recommended Lessons</h2>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#20b2aa]"></div>
              </div>
            ) : lessons.length > 0 ? (
              <div className="space-y-3">
                {lessons.map((lesson, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 bg-[#20b2aa] rounded-full flex items-center justify-center text-white text-xs mr-3 mt-1">
                        {index + 1}
                      </span>
                      <p className="text-gray-700">{lesson}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg p-4 text-center">
                <p className="text-gray-500">No lessons available yet. Continue practicing conversations to receive personalized lessons.</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Practice button */}
        <div className="mt-8 text-center">
          <button 
            onClick={() => router.back()}
            className="bg-[#20b2aa] hover:bg-[#008080] px-8 py-3 rounded-lg text-white font-medium transition-colors inline-flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Continue Practicing
          </button>
        </div>
      </div>
    </div>
  );
};

export default LessonPage;