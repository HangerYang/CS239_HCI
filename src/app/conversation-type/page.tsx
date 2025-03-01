"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const ConversationPage = () => {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Array<{text: string, sender: 'user' | 'bot'}>>([
    { text: "Hello! I'm your conversation partner. What would you like to talk about today?", sender: 'bot' }
  ]);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
  };

  const handleSendMessage = () => {
    if (inputText.trim()) {
      setMessages(prev => [...prev, { text: inputText, sender: 'user' }]);
      
      // Simulated bot response
      setTimeout(() => {
        const responses = [
          "That's interesting! Tell me more about that.",
          "I see. How does that make you feel?",
          "Could you elaborate on that point?",
          "What other thoughts do you have about this topic?",
          "That's a great perspective! Have you considered looking at it from another angle?",
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        setMessages(prev => [...prev, { text: randomResponse, sender: 'bot' }]);
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
    router.push('/text');
  };

  const handleEndConvo = () => {
    setShowModal(true);
  };

  const handleSaveConversation = () => {
    const savedConversations = JSON.parse(localStorage.getItem('conversations') || '[]');
    savedConversations.push({
      id: Date.now(),
      date: new Date().toISOString(),
      messages: messages
    });
    localStorage.setItem('conversations', JSON.stringify(savedConversations));
    router.push('/choose');
  };

  const handleDiscardConversation = () => {
    router.push('/choose');
  };

  const handleHelp = () => {
    router.push('/help');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white relative"
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

      <button 
        onClick={handleEndConvo}
        className="absolute top-8 right-8 bg-red-400 hover:bg-red-500 px-6 py-2 rounded-lg transition-colors duration-200"
      >
        End Convo
      </button>

      <div className="pt-24 px-4 max-w-4xl mx-auto">
        <div className="h-[70vh] bg-gray-800 rounded-xl p-6 overflow-y-auto mb-4">
          <div className="flex flex-col space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-sm rounded-lg px-4 py-2 ${
                    message.sender === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <input
            type="text"
            value={inputText}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            onClick={handleSendMessage}
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            <Image src="/icons/send.png" alt="Send" width={24} height={24} />
          </button>
          <button 
            onClick={handleHelp}
            className="bg-gray-600 hover:bg-gray-500 px-6 py-2 rounded-lg transition-colors duration-200"
          >
            Help
          </button>
        </div>
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