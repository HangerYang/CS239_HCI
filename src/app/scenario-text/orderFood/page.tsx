"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const OrderFood = () => { 
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Array<{text: string, sender: 'user' | 'bot'}>>([
    { text: "Hello! Welcome to our restaurant. What would you like to order today?", sender: 'bot' }
  ]);
  const [conversationStage, setConversationStage] = useState('initial'); // Track conversation progress
  const [orderItems, setOrderItems] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

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
          botResponse = "Hello there! What would you like to order today? We have burgers, pizzas, pasta, and salads.";
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
    router.push('/scenario-text');
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

  const handleHelp = () => {
    router.push('/scenario-text/help');
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

        <div className="flex pt-16 px-6">
        <div className="w-1/3 flex-shrink-0">
            <div className="w-full h-[70vh] relative mt-8">
            <Image
                src="/icons/menu.jpg"
                alt="Restaurant Menu"
                fill
                className="object-contain"
                priority
            />
            </div>
        </div>

        <div className="w-2/3 flex flex-col ml-12 mt-12 mr-8">
        <div className="h-[60vh] bg-gray-800 rounded-xl p-6 overflow-y-auto mb-4 mr-12">
          <div className="flex flex-col space-y-4 mr-8">
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
            placeholder="Type your response..."
            className="flex-1 bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            onClick={handleSendMessage}
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            <Image src="/icons/send.png" alt="Send" width={24} height={24} className="text-white"/>
          </button>
          <button 
            onClick={handleHelp}
            className="bg-gray-600 hover:bg-gray-500 px-6 py-2 rounded-lg transition-colors duration-200"
          >
            Help
          </button>
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