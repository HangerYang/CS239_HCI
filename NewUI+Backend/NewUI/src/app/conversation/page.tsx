"use client"
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { auth } from "../../../server/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { sendChatMessage, getSuggestions, setScenario } from '@/services/api';
import Dictionary from '@/components/Dictionary';

interface ChatResponse {
  response: string;
  audio_url?: string;
}

interface SuggestionResponse {
  suggestions: string[];
}

interface ApiResult<T> {
  data: T | null;
  error: string | null;
}

const ConversationPage = () => {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Array<{text: string, sender: 'user' | 'bot', audio_url?: string}>>([
    { text: "Hello! I'm your conversation partner. What would you like to talk about today?", sender: 'bot' }
  ]);
  const [isListening, setIsListening] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestionList, setSuggestionList] = useState<string[]>([]);
  const [userLanguage, setUserLanguage] = useState<string>('en');
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  const audioRef = useRef<HTMLAudioElement | null>(null);


  const handleStartListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.log('Speech recognition not supported');
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = 'cmn';
    recognition.maxResults = 100;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
    };

    recognition.onerror = (event) => {
      console.log('Error occurred:', event.error);
    };

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleStopListening = () => {
    SpeechRecognition.stopListening();
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Initialize conversation with backend
  const initializeConversation = async (username: string) => {
    try {
      const scenarioResponse = await setScenario(username, "General conversation practice");
      fetchSuggestions(username); //initial suggestions
    } catch (error) {
      console.error("Error initializing conversation:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      const savedLocale = localStorage.getItem('locale') || 'en';
      setUserLanguage(savedLocale);
      
      if (currentUser) {
        const username = currentUser.displayName || currentUser.email?.split('@')[0] || 'Guest';
        if (messages.length === 1 && messages[0].sender === 'bot') {
          setMessages([
            { 
              text: `Hello, ${currentUser.displayName || username}! I'm chatty. What would you like to talk about today?`, 
              sender: 'bot' 
            }
          ]);
        }
        await initializeConversation(username);
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

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
  };

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

  // Play audio when speaker button is clicked
  const playMessageAudio = (messageId: number, audioUrl?: string) => {
    if (!audioUrl) return;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(null);
    }

    if (isPlaying === `message-${messageId}`) {
      setIsPlaying(null);
      return;
    }
    
    const audio = new Audio(`http://localhost:8000${audioUrl}`);
    audioRef.current = audio;
    setIsPlaying(`message-${messageId}`);

    audio.addEventListener('ended', () => {
      setIsPlaying(null);
    });
    
    audio.play().catch(e => {
      console.error("Audio playback error:", e);
      setIsPlaying(null);
    });
  };

  const handleSendMessage = async () => {
    if (inputText.trim()) {
      const userMessage = inputText.trim();
      setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
      setInputText('');
      setIsLoading(true);

      try {
        if (!user) {
          throw new Error("User not authenticated");
        }
        
        const username = user.displayName || user.email?.split('@')[0] || 'Guest';
        
        const response = await sendChatMessage(
          username,
          userMessage,
          "General conversation practice",
          undefined, // AI role
          userLanguage // User's language
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
        
        await fetchSuggestions(username);
      } catch (error) {
        console.error('Error sending message:', error);
        setMessages(prev => [
          ...prev,
          { text: "Sorry, I'm having trouble connecting to my brain. Please try again.", sender: 'bot' }
        ]);
      } finally {
        setIsLoading(false);
      }
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

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleBackClick = () => {
    router.push('/choose');
  };

  const handleEndConvo = () => {
    setShowModal(true);
  };

  const handleSaveConversation = async () => {
    try {
      if (user) {
        const username = user.displayName || user.email?.split('@')[0] || 'Guest';
        
        // Save the conversation locally
        const savedConversations = JSON.parse(localStorage.getItem('conversations') || '[]');
        savedConversations.push({
          id: Date.now(),
          date: new Date().toISOString(),
          messages: messages,
          userName: username,
          language: userLanguage
        });
        localStorage.setItem('conversations', JSON.stringify(savedConversations));
      }
      router.push('/text');
    } catch (error) {
      console.error("Error saving conversation:", error);
      router.push('/text');
    }
  };

  const handleDiscardConversation = () => {
    router.push('/text');
  };
  
  const navigateToDashboard = () => {
    router.push('/dashboard');
    setShowProfileMenu(false);
  };


  // Apply suggestion to input
  const handleSuggestionClick = (suggestion: string) => {
    setInputText(suggestion);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
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
            <div className="px-4 py-2 border-b border-gray-200">
              <p className="text-xs text-gray-500">Language: {userLanguage === 'en' ? 'English' : userLanguage === 'zh-CN' ? 'Chinese' : 'Japanese'}</p>
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

      <button 
        onClick={handleEndConvo}
        className="absolute top-8 right-8 bg-[#20b2aa] hover:bg-[#008080] px-6 py-2 rounded-lg transition-colors duration-200"
      >
        End Convo
      </button>

      <div className="pt-24 px-4 max-w-6xl mx-auto">
        <div className="flex gap-4">
          {/* Conversation area */}
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
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-center space-x-2 bg-gray-100 rounded-lg px-4 py-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleStartListening}
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
                {isListening && (
                  <span className="absolute top-0 right-0 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                )}
                {isListening && (
      <div className="animate-pulse absolute top-0 right-0 flex h-3 w-3">
        <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
      </div>
    )}
              </button>


              <input
                type="text"
                value={inputText}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder={isListening ? "Listening..." : "Type your message..."}
                className={`flex-1 bg-white text-black px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isListening ? 'animate-pulse border-2 border-red-400' : ''
                }`}
                disabled={isListening || isLoading}
              />
              
              <button 
                onClick={handleSendMessage}
                disabled={isListening || isLoading || !inputText.trim()}
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
          <div className="w-[35%]">
            <div className="h-[70vh] bg-[#f0f8ff] rounded-xl p-6 overflow-y-auto mb-4">
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
              <Dictionary />
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
      <div>
        <Dictionary></Dictionary>
      </div>
      
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">End Conversation</h3>
            <p className="text-gray-600 mb-6">Your conversation will be closed. Do you want to save your current conversation record to your profile?</p>
            
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

export default ConversationPage;