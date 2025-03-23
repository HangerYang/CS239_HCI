"use client"
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { auth } from "../../../../server/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

const OrderFood = () => { 
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Array<{text: string, sender: 'user' | 'bot'}>>([
    { text: "Hello! Welcome to our restaurant. What would you like to order today?", sender: 'bot' }
  ]);
  const [conversationStage, setConversationStage] = useState('initial'); 
  const [orderItems, setOrderItems] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const router = useRouter();

  const restaurantTips = [
    "You can customize your order by saying 'no onions' or 'extra cheese'.",
    "Don't forget to ask for your preferred drink."
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      
      if (currentUser?.displayName) {
        setMessages(currentMessages => {
          if (currentMessages.length === 1 && currentMessages[0].sender === 'bot') {
            return [
              { 
                text: `Hello, ${currentUser.displayName}! Welcome to our restaurant. What would you like to order today?`, 
                sender: 'bot' 
              }
            ];
          }
          return currentMessages;
        });
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

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
  };

  const handleSendMessage = () => {
    if (inputText.trim()) {
      const userMessage = inputText.trim();
      setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
      
      setTimeout(() => {
        let botResponse = "";

        const userMessageLower = userMessage.toLowerCase();
        const containsFood = /burger|salad|sandwich|fries|coffee|tea/i.test(userMessageLower);
        const isGreeting = /^hi|^hello|^hey/i.test(userMessageLower);
        const mentionsDone = /done|finished|that's all|that is all|complete|nothing else/i.test(userMessageLower);
        
        if (isGreeting && conversationStage === 'initial') {
          botResponse = "Hello there! What would you like to order today? We have burger, pizza, pasta, and salad.";
        } 
        else if (containsFood) {
          const foodItems = [
            'burger', 'salad', 'sandwich', 'fries',
            'drink', 'coffee', 'tea'
          ];
          
          const mentionedFoods = foodItems.filter(food => 
            userMessageLower.includes(food)
          );
          
          if (mentionedFoods.length > 0) {
            setOrderItems(prev => [...prev, ...mentionedFoods]);
            if (conversationStage === 'initial' || conversationStage === 'ordering') {
              botResponse = `Great choice! Would you like anything else with your ${mentionedFoods.join(', ')}?`;
              setConversationStage('ordering');
            } else if (conversationStage === 'extras') {
              botResponse = "Perfect! Your order will be ready shortly. Is there anything else you'd like to know?";
              setConversationStage('confirmation');
            }
          }
        }
        else if (mentionsDone || userMessageLower.includes('no')) {
          if (orderItems.length > 0) {
            botResponse = `Thank you for your order of ${orderItems.join(', ')}. Your food will be ready in about 15 minutes. `;
          }
        }
        
        // Handle empty responses
        if (!botResponse) {
          botResponse = "I'm not sure I understand. Can you please repeat that?";
        }
        
        setMessages(prev => [...prev, { text: botResponse, sender: 'bot' }]);
      }, 1000);

      setInputText('');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleBackClick = () => {
    router.push('/scenario');
  };

  const handleEndConvo = () => {
    setShowModal(true);
  };

  const handleSaveConversation = () => {
    const savedConversations = JSON.parse(localStorage.getItem('orderFood') || '[]');
    savedConversations.push({
      id: Date.now(),
      date: new Date().toISOString(),
      scenario: 'Ordering Food',
      messages: messages
    });
    localStorage.setItem('orderFood', JSON.stringify(savedConversations));
    router.push('/text');
  };

  const handleDiscardConversation = () => {
    router.push('/text');
  };

  // Toggle voice recording
  const toggleRecording = () => {};

  const navigateToDashboard = () => {
    router.push('/profile');
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
                      }`}
                    >
                      {message.text}
                    </div>
                    {message.sender === 'user' && (
                      <div className="w-8 h-8 ml-2 flex-shrink-0 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center">
                        <div className="w-full h-full bg-[#48d1cc] flex items-center justify-center text-white font-semibold text-xs">
                          {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 
                           user?.email ? user.email.charAt(0).toUpperCase() : "U"}
                        </div>
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
                disabled={isRecording}
              />
              <button 
                onClick={handleSendMessage}
                disabled={isRecording}
                className="bg-[#20b2aa] hover:bg-[#008080] px-4 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center disabled:opacity-50"
              >
                <Image src="/icons/send.png" alt="Send" width={24} height={24} />
              </button>
            </div>
          </div>

          {/* Restaurant menu panel */}
          <div className="w-[35%]">
            <div className="h-[70vh] bg-[#f0f8ff] rounded-xl p-6 overflow-y-auto mb-4">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Restaurant Menu
              </h2>
              
              <div className="mb-6 relative">
                <Image
                  src="/icons/menu.jpg"
                  alt="Restaurant Menu"
                  width={400}
                  height={400}
                  className="object-contain rounded-lg w-full"
                  priority
                />
              </div>
              
              <h3 className="text-lg font-semibold text-gray-800 mb-3 mt-4">Ordering Tips</h3>
              <div className="space-y-4">
                {restaurantTips.map((tip, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center">
                      <span className="flex-shrink-0 w-6 h-6 bg-[#20b2aa] rounded-full flex items-center justify-center text-white text-xs mr-3">
                        {index + 1}
                      </span>
                      <p className="text-gray-700">{tip}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-blue-50 rounded-lg p-4">
                <h3 className="font-medium text-blue-800 mb-2">Popular Orders:</h3>
                <ul className="list-disc pl-5 text-blue-700 space-y-1">
                  <li>Burger with fries</li>
                  <li>Caesar salad</li>
                  <li>Sandwich and coffee combo</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">End Restaurant Conversation</h3>
            <p className="text-gray-600 mb-6">Your restaurant ordering practice will be closed. Do you want to save this conversation to your profile?</p>
            
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
}

export default OrderFood;