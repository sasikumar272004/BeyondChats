// AIAssistant.js
import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { v4 as uuidv4 } from 'uuid';
import AIAvatar from './AIAvatar';
import UserAvatar from './UserAvatar';
import TypingIndicator from './TypingIndicator';

const AIAssistant = ({ showAIPanel, setShowAIPanel }) => {
  const [aiMessages, setAiMessages] = useState([
    { 
      id: uuidv4(), 
      sender: 'AI', 
      content: 'Hello! I can help you draft responses to messages, find information, and suggest actions. How can I assist you today?', 
      time: 'Just now', 
      isMe: false 
    },
  ]);
  const [newAiMessage, setNewAiMessage] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const aiMessagesEndRef = useRef(null);
  const aiInputRef = useRef(null);

  // Smooth scroll to bottom
  useEffect(() => {
    gsap.to(aiMessagesEndRef.current, {
      duration: 0.3,
      scrollTo: aiMessagesEndRef.current,
      ease: "power2.out"
    });
  }, [aiMessages]);

  // Typing indicator animation
  useEffect(() => {
    if (isAiThinking) {
      gsap.to(".ai-typing-indicator", {
        y: -5,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }
  }, [isAiThinking]);

  const handleSendAiMessage = () => {
    if (!newAiMessage.trim()) return;

    const userMsg = {
      id: uuidv4(),
      sender: 'You',
      content: newAiMessage,
      time: 'Just now',
      isMe: true
    };

    // Animation for user message
    gsap.from(`#ai-msg-${userMsg.id}`, {
      y: 50,
      opacity: 0,
      duration: 0.3,
      ease: "back.out(1)"
    });

    setAiMessages([...aiMessages, userMsg]);
    setNewAiMessage('');
    setIsAiThinking(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMsg = {
        id: uuidv4(),
        sender: 'AI',
        content: generateAIResponse(newAiMessage),
        time: 'Just now',
        isMe: false
      };

      // Animation for AI message
      gsap.from(`#ai-msg-${aiMsg.id}`, {
        x: -50,
        opacity: 0,
        duration: 0.4,
        ease: "elastic.out(1, 0.5)"
      });

      setAiMessages(prev => [...prev, aiMsg]);
      setIsAiThinking(false);
    }, 1500);
  };

  const generateAIResponse = (message) => {
    const responses = [
      `Based on your message "${message}", I suggest responding with: "I'd be happy to help with that. Could you provide more details?"`,
      `For "${message}", consider these points:\n1. Clarify the objectives\n2. Set a timeline\n3. Identify resources needed\n\nWould you like me to draft a detailed response?`,
      `This seems like a technical question. Common solutions:\n• Check system requirements\n• Verify network connection\n• Clear cache and cookies\n\nNeed more details?`,
      `Professional template you could use:\n\n"Dear [Name],\n\nThank you for reaching out. We appreciate your patience while we resolve this. Our team is investigating and we'll update you within [timeframe].\n\nBest regards,\n[Your Name]"`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendAiMessage();
    }
  };

  return (
    <div className={`w-full md:w-1/4 border-l border-gray-200 bg-white flex flex-col h-full transition-all duration-300 ${showAIPanel ? 'translate-x-0' : 'translate-x-full'}`}>
      {/* AI Assistant header */}
      <div className="p-3 border-b border-gray-200 bg-white flex items-center justify-between shadow-sm">
        <h3 className="font-medium text-gray-800">AI Assistant</h3>
        <button 
          className="text-gray-500 hover:text-gray-700"
          onClick={() => setShowAIPanel(false)}
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* AI Messages area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {aiMessages.map((message) => (
          <div id={`ai-msg-${message.id}`} key={message.id} className="mb-4">
            <div className="flex items-start">
              {!message.isMe && (
                <div className="mr-2">
                  <AIAvatar isTyping={false} />
                </div>
              )}
              <div className={`flex-1 ${message.isMe ? 'text-right' : ''}`}>
                <div 
                  className={`inline-block px-4 py-2 rounded-lg ${message.isMe ? 
                    'bg-blue-500 text-white rounded-br-none' : 
                    'bg-white text-gray-800 rounded-bl-none border border-gray-200'}`}
                >
                  <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                  <div className={`text-xs mt-1 ${message.isMe ? 'text-blue-100' : 'text-gray-500'}`}>
                    {message.time}
                  </div>
                </div>
              </div>
              {message.isMe && (
                <div className="ml-2">
                  <UserAvatar name="You" isOnline={true} />
                </div>
              )}
            </div>
          </div>
        ))}

        {isAiThinking && (
          <div className="ai-typing-indicator flex mb-4">
            <div className="mr-2">
              <AIAvatar isTyping={true} />
            </div>
            <TypingIndicator />
          </div>
        )}
        <div ref={aiMessagesEndRef} />
      </div>

      {/* AI Input area */}
      <div className="p-3 border-t border-gray-200 bg-white">
        <div className="flex items-center">
          <div className="flex-1 mr-2">
            <input
              ref={aiInputRef}
              type="text"
              className="w-full py-2 px-3 bg-gray-100 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-300 text-gray-700 placeholder-gray-400 transition-all duration-200"
              placeholder="Ask AI for help..."
              value={newAiMessage}
              onChange={(e) => setNewAiMessage(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <button
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full transition-all duration-200"
            onClick={handleSendAiMessage}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <div className="mt-2 text-xs text-gray-500 text-center">
          AI can help draft messages, find info, and suggest actions
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;