import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import AIAvatar from './AIAvatar';
import UserAvatar from './UserAvatar';
import TypingIndicator from './TypingIndicator';
import { FiX } from 'react-icons/fi';
import { BsStars, BsLightning } from 'react-icons/bs';

const AIAssistant = ({ showAIPanel, setShowAIPanel }) => {
  const [aiMessages, setAiMessages] = useState([
    {
      id: uuidv4(),
      sender: 'AI',
      content: 'Hello! I can help you draft responses to messages, find information, and suggest actions. How can I assist you today?',
      time: 'Just now',
      isMe: false,
    },
  ]);
  const [newAiMessage, setNewAiMessage] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [activeTab, setActiveTab] = useState('copilot');
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const aiMessagesEndRef = useRef(null);
  const tabsRef = useRef([]);
  const underlineRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (aiMessagesEndRef.current) {
      aiMessagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [aiMessages]);

  useEffect(() => {
    const activeIndex = activeTab === 'copilot' ? 0 : 1;
    const activeTabEl = tabsRef.current[activeIndex];
    
    if (activeTabEl && underlineRef.current) {
      const { offsetLeft, offsetWidth } = activeTabEl;
      underlineRef.current.style.left = `${offsetLeft}px`;
      underlineRef.current.style.width = `${offsetWidth}px`;
    }
  }, [activeTab]);

  const handleSendAiMessage = () => {
    if (!newAiMessage.trim()) return;

    const userMsg = {
      id: uuidv4(),
      sender: 'You',
      content: newAiMessage,
      time: 'Just now',
      isMe: true,
    };

    setAiMessages((prev) => [...prev, userMsg]);
    setNewAiMessage('');
    setIsAiThinking(true);

    setTimeout(() => {
      const aiMsg = {
        id: uuidv4(),
        sender: 'AI',
        content: generateAIResponse(newAiMessage),
        time: 'Just now',
        isMe: false,
      };

      setAiMessages((prev) => [...prev, aiMsg]);
      setIsAiThinking(false);
    }, 1500);
  };

  const generateAIResponse = (message) => {
    const responses = [
      `Based on your message "${message}", I suggest responding with: "I'd be happy to help with that. Could you provide more details?"`,
      `For "${message}", consider these points:\n1. Clarify the objectives\n2. Set a timeline\n3. Identify resources needed\n\nWould you like me to draft a detailed response?`,
      `This seems like a technical question. Common solutions:\n• Check system requirements\n• Verify network connection\n• Clear cache and cookies\n\nNeed more details?`,
      `Professional template you could use:\n\n"Dear [Name],\n\nThank you for reaching out. We appreciate your patience while we resolve this. Our team is investigating and we'll update you within [timeframe].\n\nBest regards,\n[Your Name]"`,
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
    <div className={`
      h-full w-full flex flex-col
      bg-gradient-to-br from-slate-50 to-white
      transition-all duration-300 ease-in-out
      overflow-hidden
      ${showAIPanel ? 'translate-x-0' : 'translate-x-full'}
    `}>
      {/* Header */}
      <div className="flex-none px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-white via-slate-50 to-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-gradient-to-br from-indigo-100 to-blue-50 rounded-lg">
              <BsStars className="h-5 w-5 text-indigo-500" />
            </div>
            <h2 className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-blue-600">
              AI Assistant
            </h2>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowAIPanel(false)}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gradient-to-br from-gray-50 to-gray-100 transition-colors"
            >
              <FiX />
            </button>
          </div>
        </div>

        <div className="flex items-center mt-3 relative">
          <button
            ref={(el) => (tabsRef.current[0] = el)}
            onClick={() => setActiveTab('copilot')}
            className={`font-medium text-sm px-4 py-2 rounded-lg transition-all duration-200 ${
              activeTab === 'copilot' 
                ? 'bg-gradient-to-r from-indigo-50 to-blue-50 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600' 
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            AI Copilot
          </button>
          <button
            ref={(el) => (tabsRef.current[1] = el)}
            onClick={() => setActiveTab('details')}
            className={`font-medium text-sm px-4 py-2 rounded-lg transition-all duration-200 ${
              activeTab === 'details' 
                ? 'bg-gradient-to-r from-indigo-50 to-blue-50 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600' 
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            Details
          </button>
        </div>
      </div>

      {activeTab === 'copilot' ? (
        <>
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {aiMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isMe ? 'justify-end' : 'justify-start'} group`}
              >
                {!message.isMe && (
                  <div className="mr-3 mt-1">
                    <AIAvatar isTyping={false} />
                  </div>
                )}
                <div
                  className={`relative max-w-[80%] px-4 py-3 rounded-2xl ${
                    message.isMe
                      ? 'bg-gradient-to-br from-indigo-500 via-indigo-600 to-blue-600 text-white'
                      : 'bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 border border-indigo-200/30'
                  } message-highlight`}
                >
                  <div className="text-sm whitespace-pre-wrap">
                    {message.content}
                  </div>
                  <div
                    className={`flex items-center gap-1 mt-1 text-xs ${
                      message.isMe ? 'text-blue-100' : 'text-indigo-500'
                    }`}
                  >
                    {message.time}
                  </div>
                </div>
                {message.isMe && (
                  <div className="ml-3 mt-1">
                    <UserAvatar name="You" isOnline={true} />
                  </div>
                )}
              </div>
            ))}

            {isAiThinking && (
              <div className="flex items-start">
                <div className="mr-3 mt-1">
                  <AIAvatar isTyping={true} />
                </div>
                <div className="bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 border border-indigo-200/30 rounded-2xl px-4 py-3">
                  <TypingIndicator />
                </div>
              </div>
            )}
            <div ref={aiMessagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="flex-none p-4 relative">
            {/* Blurred background */}
            <div 
              className="absolute inset-0 bg-gradient-to-r from-indigo-400/90 to-blue-400/95 -z-10 blur-sm opacity-30"
              aria-hidden="true"
            />
            
            {/* Content */}
            <div className="relative">
              <div className="flex items-center bg-gradient-to-br from-white/80 via-white/90 to-white/80 rounded-xl border border-gray-200/50 shadow-lg backdrop-blur-sm">
                <textarea
                  value={newAiMessage}
                  onChange={(e) => setNewAiMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask AI for help..."
                  className="flex-1 p-3 pr-24 bg-transparent focus:outline-none text-gray-700 placeholder-gray-400 rounded-xl resize-none"
                  rows={1}
                  style={{ minHeight: '45px', maxHeight: '120px' }}
                />
                <div className="absolute right-2 bottom-2 flex items-center gap-2">
                  <button
                    onClick={handleSendAiMessage}
                    className="p-2 bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-lg hover:shadow-md transition-all duration-200 hover:scale-105 flex items-center gap-1 hover:from-indigo-600 hover:to-blue-700"
                  >
                    <BsLightning className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="mt-2 text-center">
                <span className="text-xs text-gray-500 bg-white/80 px-2 py-1 rounded-full shadow-sm">
                  Press Enter ↵ to send
                </span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg">
                  <BsLightning className="h-5 w-5 text-blue-500" />
                </div>
                <h3 className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  Quick Actions
                </h3>
              </div>
              <p className="text-sm text-gray-600">
                Get instant help with message drafting, information lookup, and smart suggestions.
              </p>
            </div>

            <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg">
                  <BsStars className="h-5 w-5 text-purple-500" />
                </div>
                <h3 className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                  AI Capabilities
                </h3>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">• Message drafting and suggestions</p>
                <p className="text-sm text-gray-600">• Context-aware responses</p>
                <p className="text-sm text-gray-600">• Information retrieval and summarization</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-100/50 to-blue-100/50 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-sm text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600 text-center font-medium">
                AI Assistant v2.0 • Last updated today
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;