"use client"
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { auth } from "../../../server/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { sendChatMessage, getSuggestions, setScenario } from '@/services/api';
import Dictionary from '@/components/Dictionary';

interface Scenario {
  id: string;
  title: string;
  description: string;
  created_at: string;
  custom: boolean;
}

interface Message {
  text: string;
  sender: 'user' | 'bot';
  audio_url?: string;
}

const RoleplayPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [userLanguage, setUserLanguage] = useState<string>('en');
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [suggestionList, setSuggestionList] = useState<string[]>([]);
  
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const initializeConversation = async (username: string) => {
    try {
      // Call backend to set scenario & get response
      // const scenarioResponse = await setScenario(username);
      
      // Fetch initial response from backend
      const response = await fetch("http://localhost:8000/api/get_scenario_response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
  
      const data = await response.json();
      console.log("LLM Response:", data.response);
  
      // Set initial message from backend
      setMessages([{ text: data.response, sender: "bot" }]);
  
      // Fetch initial suggestions
      fetchSuggestions(username);
    } catch (error) {
      console.error("Error initializing conversation:", error);
    }
  };
  
  useEffect(() => {
    setLoading(true);
  
    const fetchUserAndScenario = async () => {
      try {
        // Load scenario from localStorage
        const savedScenario = localStorage.getItem("currentScenario");
  
        if (!savedScenario) {
          alert("No scenario selected. Please select a scenario first.");
          router.push("/scenario");
          return;
        }
  
        const parsedScenario = JSON.parse(savedScenario);
        setScenario(parsedScenario);
  
        // Authenticate user
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
          setUser(currentUser);
  
          // Get language preference (from localStorage or backend)
          const savedLocale = localStorage.getItem("locale") || "en";
          setUserLanguage(savedLocale);
  
          if (currentUser) {
            const username =
              currentUser.displayName ||
              currentUser.email?.split("@")[0] ||
              "Guest";
  
            console.log("👤 User authenticated:", username);
  
            // Initialize conversation (calls backend for scenario & LLM response)
            await initializeConversation(username);
          }
  
          setLoading(false);
        });
  
        return () => unsubscribe();
      } catch (error) {
        console.error("Error loading user scenario:", error);
        alert("There was a problem loading the scenario. Please try again.");
        router.push("/scenario");
      }
    };
  
    fetchUserAndScenario();
  }, []);
  
  // // Initialize scenario conversation with backend
  // const initializeConversation = async (username: string, scenarioTitle: string) => {
  //   try {
  //     const scenarioResponse = await setScenario(username, scenarioTitle);
  //     fetchSuggestions(username); // Initial suggestions
  //   } catch (error) {
  //     console.error("Error initializing conversation:", error);
  //   }
  // };

  // useEffect(() => {
  //   // Load the scenario from localStorage
  //   const savedScenario = localStorage.getItem('currentScenario');
    
  //   if (!savedScenario) {
  //     // If no scenario is found, redirect back to scenario selection
  //     alert("No scenario selected. Please select a scenario first.");
  //     router.push('/scenario');
  //     return;
  //   }
    
  //   try {
  //     const parsedScenario = JSON.parse(savedScenario);
  //     setScenario(parsedScenario);
      
  //     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
  //       setUser(currentUser);
        
  //       const savedLocale = localStorage.getItem('locale') || 'en';
  //       setUserLanguage(savedLocale);
        
  //       if (currentUser) {
  //         const username = currentUser.displayName || currentUser.email?.split('@')[0] || 'Guest';
          
  //         await initializeConversation(username, parsedScenario.title);
  //         setMessages([
  //           { 
  //             text: `Hello${currentUser.displayName ? ', ' + currentUser.displayName : ''}! I'll be your conversation partner for this ${parsedScenario.title} scenario. How can I help you today?`, 
  //             sender: 'bot' 
  //           }
  //         ]);
  //       } else {
  //         setMessages([
  //           { 
  //             text: `Welcome to the ${parsedScenario.title} scenario! I'll be your conversation partner. How would you like to start?`, 
  //             sender: 'bot' 
  //           }
  //         ]);
  //       }
        
  //       setLoading(false);
  //     });
      
  //     return () => unsubscribe();
  //   } catch (error) {
  //     console.error("Error parsing scenario:", error);
  //     alert("There was a problem loading the scenario. Please try again.");
  //     router.push('/scenario');
  //   }
  // }, []);

  // Fetch updated conversation suggestions from backend
  const fetchSuggestions = async (username: string) => {
    try {
      const response = await getSuggestions(username);
      
      if (response && response.data && !response.error) {
        setSuggestionList(response.data.suggestions);
      } else if (response && response.error) {
        console.error("Error fetching suggestions:", response.error);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };
  const generateLessons = async () => {
    if (!user) {
      alert("Please log in to generate lessons.");
      return;
    }
  
    try {
      setIsLoading(true);
      const username = user.displayName || user.email?.split('@')[0] || 'Guest';
      
      console.log("Generating lessons for:", username);
      
      const response = await fetch('http://localhost:8000/api/get_lessons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Lessons generated:", data);
      
      // Navigate to the lessons page
      router.push('/lesson');
      
    } catch (error) {
      console.error("Error generating lessons:", error);
      alert("Failed to generate lessons. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
    router.push('/scenario');
  };
  
  const navigateToDashboard = () => {
    router.push('/dashboard');
    setShowProfileMenu(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Play audio when speaker button is clicked
  const playMessageAudio = (messageId: number, audioUrl?: string) => {
    if (!audioUrl) return;
    
    // Stop any currently playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(null);
    }
    
    // If clicking on the currently playing audio, just stop it
    if (isPlaying === `message-${messageId}`) {
      setIsPlaying(null);
      return;
    }
    
    // Create and play new audio
    const audio = new Audio(`http://localhost:8000${audioUrl}`);
    audioRef.current = audio;
    
    // Set the currently playing message ID
    setIsPlaying(`message-${messageId}`);
    
    // When audio ends, reset the playing state
    audio.addEventListener('ended', () => {
      setIsPlaying(null);
    });
    
    audio.play().catch(e => {
      console.error("Audio playback error:", e);
      setIsPlaying(null);
    });
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || !scenario) return;
    
    const userMessage = inputText.trim();
    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
    setInputText('');
    setIsLoading(true);

    try {
      const username = user ? (user.displayName || user.email?.split('@')[0] || 'Guest') : 'Guest';
      
      const response = await sendChatMessage(
        username,
        userMessage,
        scenario.title, // Using the scenario title
        undefined,
        userLanguage
      );

      if (response && response.error) {
        throw new Error(response.error);
      }

      if (response && response.data) {
        setMessages(prev => [...prev, { 
          text: response.data.response, 
          sender: 'bot',
          audio_url: response.data.audio_url
        }]);
      }
      
      // Fetch updated suggestions after message
      await fetchSuggestions(username);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [
        ...prev,
        { text: "Sorry, I'm having trouble connecting. Please try again.", sender: 'bot' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndScenario = () => {
    setShowModal(true);
  };

  const handleSaveConversation = async () => {
    try {
      if (!scenario) return;
      
      const scenarioType = scenario.title.toLowerCase().replace(/\s+/g, '_');
      const savedConversations = JSON.parse(localStorage.getItem(scenarioType) || '[]');
      
      savedConversations.push({
        id: Date.now(),
        date: new Date().toISOString(),
        scenario: scenario.title,
        messages: messages,
        userName: user ? (user.displayName || user.email?.split('@')[0] || 'Guest') : 'Guest',
        language: userLanguage
      });
      
      localStorage.setItem(scenarioType, JSON.stringify(savedConversations));
      router.push('/scenario');
    } catch (error) {
      console.error("Error saving conversation:", error);
      router.push('/scenario');
    }
  };

  const handleDiscardConversation = () => {
    router.push('/scenario');
  };

  // Apply suggestion to input
  const handleSuggestionClick = (suggestion: string) => {
    setInputText(suggestion);
  };

  // Toggle voice recording (placeholder)
  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Add actual recording logic here
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
          className="text-white"
        />
      </button>
      
      <button 
        onClick={handleEndScenario}
        className="absolute top-8 right-8 bg-[#20b2aa] hover:bg-[#008080] px-6 py-2 rounded-lg transition-colors duration-200"
      >
        End Scenario
      </button>
      
      <div className="pt-24 px-4 max-w-6xl mx-auto">
        <div className="flex gap-4">
          {/* Conversation area - left side */}
          <div className="w-[65%]">
            <div className="h-[70vh] bg-[#f0f8ff] rounded-xl p-6 overflow-y-auto mb-4">
              <div className="flex flex-col space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.sender === 'bot' && (
                      <div className="w-8 h-8 mr-2 flex-shrink-0 rounded-full overflow-hidden">
                        <Image
                          src="/icons/robot.jpg"
                          alt="Robot"
                          width={32}
                          height={32}
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div
                      className={`max-w-sm rounded-lg px-4 py-2 ${
                        message.sender === 'user' 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-200 text-gray-800'
                      } group relative`}
                    >
                      {message.text}
                      
                      {/* Speaker button for bot messages */}
                      {message.sender === 'bot' && message.audio_url && (
                        <button
                          onClick={() => playMessageAudio(index, message.audio_url)}
                          className="absolute -right-10 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                          aria-label="Play message audio"
                        >
                          {isPlaying === `message-${index}` ? (
                            <div className="animate-pulse">
                              <Image src="/icons/speaker.png" alt="Speaker" width={24} height={24} />
                            </div>
                          ) : (
                            <Image src="/icons/speaker.png" alt="Speaker" width={24} height={24} />
                          )}
                        </button>
                      )}
                    </div>
                    {message.sender === 'user' && (
                      <div className="w-8 h-8 ml-2 flex-shrink-0 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center">
                        {user?.photoURL ? (
                          <Image
                            src={user.photoURL}
                            alt="User"
                            width={32}
                            height={32}
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-[#48d1cc] flex items-center justify-center text-white font-semibold text-xs">
                            {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 
                            user?.email ? user.email.charAt(0).toUpperCase() : "U"}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={toggleRecording}
                className={`${
                  isRecording 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-gray-200 hover:bg-gray-300'
                } px-3 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center relative`}
                aria-label="Start voice recording"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke={isRecording ? "white" : "black"}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                {isRecording && (
                  <span className="absolute top-0 right-0 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                )}
              </button>

              <input
                type="text"
                value={inputText}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder={isRecording ? "Listening..." : "Type your message..."}
                className={`flex-1 bg-white text-black px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isRecording ? 'animate-pulse border-2 border-red-400' : ''
                }`}
                disabled={isRecording || isLoading}
              />
              
              <button 
                onClick={handleSendMessage}
                disabled={isRecording || isLoading || !inputText.trim()}
                className="bg-[#20b2aa] hover:bg-[#008080] px-4 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                ) : (
                  <Image src="/icons/send.png" alt="Send" width={24} height={24} />
                )}
              </button>
            </div>
          </div>
          
          {/* Right side panel with suggestions and dictionary */}
          <div className="w-[35%] flex flex-col gap-4">
            {/* Suggestions panel */}
            <div className="h-[34vh] bg-[#f0f8ff] rounded-xl p-6 overflow-y-auto">
              <h3 className="text-m font-medium text-gray-800 mb-3">Suggestions</h3>
              {suggestionList.length > 0 ? (
                <div className="space-y-3">
                  {suggestionList.map((suggestion, index) => (
                    <button
                      key={index}
                      className="w-full bg-white rounded-lg p-3 shadow-sm hover:bg-gray-50 transition-colors text-left flex items-center"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <span className="flex-shrink-0 w-6 h-6 bg-[#20b2aa] rounded-full flex items-center justify-center text-white text-xs mr-3">
                        {index + 1}
                      </span>
                      <p className="text-gray-700">{suggestion}</p>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-gray-500">Suggestions will appear here after you start chatting.</p>
                </div>
              )}
            </div>
            
            {/* Dictionary panel */}
            <div className="h-[34vh] bg-[#f0f8ff] rounded-xl p-6 overflow-y-auto mb-2">
              <h3 className="text-m font-medium text-gray-800 mb-3">Dictionary</h3>
              <Dictionary/>
            </div>

            {/* Lessons button */}
            <div className="mt-0">
            <button
              onClick={generateLessons}
              className="w-full bg-[#20b2aa] hover:bg-[#008080] py-3 rounded-lg text-white font-medium transition-colors flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Go to Lessons
                </>
              )}
            </button>
            </div>
          </div>
        </div>
      </div>
      
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">End Scenario</h3>
            <p className="text-gray-600 mb-6">Your practice session will be closed. Do you want to save this conversation to your profile?</p>
            
            <div className="flex gap-4 justify-end">
              <button 
                onClick={handleDiscardConversation}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors"
              >
                Don't Save
              </button>
              <button 
                onClick={handleSaveConversation}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleplayPage;