"use client"
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { auth } from "../../../server/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { format } from 'date-fns';

const LessonPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // If user is logged in, fetch their profile data
        fetchUserProfile(currentUser);
      } else {
        setLoading(false);
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

  const fetchUserProfile = async (currentUser: User) => {
    setIsLoading(true);
    try {
      const username = currentUser.displayName || currentUser.email?.split('@')[0] || 'Guest';
      
      // Fetch user's profile JSON directly
      const response = await fetch(`http://localhost:8000/api/user_profile?username=${encodeURIComponent(username)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      setUserProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
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

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM d, yyyy • h:mm a');
    } catch (error) {
      return dateString || 'Unknown date';
    }
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

      <div className="pt-24 px-4 max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2 text-black">Chat History</h1>
        </div>

        <div className="bg-[#f0f8ff] rounded-xl p-6 shadow-lg">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#20b2aa]"></div>
            </div>
          ) : !userProfile ? (
            <div className="bg-white rounded-lg p-6 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No User Data Found</h3>
              <p className="text-gray-500 mb-4">We couldn't find any user data. Try practicing some conversations first.</p>
              
              <button 
                onClick={() => router.push('/roleplay')}
                className="bg-[#20b2aa] hover:bg-[#008080] px-6 py-2 rounded-lg text-white font-medium transition-colors inline-flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Start Practicing
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Basic Profile Section */}
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-[#20b2aa]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  User Profile
                </h2>
                <div className="bg-white rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Username</p>
                      <p className="font-medium text-gray-800">{userProfile.username || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Language</p>
                      <p className="font-medium text-gray-800">{userProfile.language || 'English'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Created</p>
                      <p className="font-medium text-gray-800">{formatDate(userProfile.created_at)}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Chat History Section */}
              {userProfile.chat_history && userProfile.chat_history.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-[#20b2aa]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    Chat History
                  </h2>
                  <div className="bg-white rounded-lg p-4 max-h-[400px] overflow-y-auto">
                    <div className="space-y-4">
                      {userProfile.chat_history.slice(-10).map((entry: any, index: number) => (
                        <div key={index} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                          <div className="flex justify-between items-center mb-1">
                            <p className="text-sm font-medium text-gray-800">
                              {entry.user ? 'You' : (entry.user === 'AI INITIATED' ? 'Chat Started' : 'AI')}
                            </p>
                            {entry.timestamp && (
                              <p className="text-xs text-gray-400">{formatDate(entry.timestamp)}</p>
                            )}
                          </div>
                          {entry.user && entry.user !== 'AI INITIATED' && (
                            <p className="text-gray-600 bg-blue-50 p-2 rounded-lg mb-2">{entry.user}</p>
                          )}
                          {entry.ai && (
                            <p className="text-gray-600 bg-gray-50 p-2 rounded-lg">{entry.ai}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Lesson Section */}
              {userProfile.lessons && Array.isArray(userProfile.lessons) && userProfile.lessons.length > 0 ? (
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-[#20b2aa]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Lessons
                  </h2>
                  <div className="bg-white rounded-lg p-4">
                    <ul className="list-disc pl-5 space-y-1">
                      {userProfile.lessons.map((lesson: string, index: number) => (
                        <li key={index} className="text-gray-700">{lesson}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : userProfile.lesson && Array.isArray(userProfile.lesson) && userProfile.lesson.length > 0 ? (
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-[#20b2aa]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Lessons
                  </h2>
                  <div className="bg-white rounded-lg p-4">
                    <ul className="list-disc pl-5 space-y-1">
                      {userProfile.lesson.map((lesson: string, index: number) => (
                        <li key={index} className="text-gray-700">{lesson}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonPage;