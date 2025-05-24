import React from 'react';
import { FiMoreVertical, FiHome } from 'react-icons/fi';
import { RiBookmarkLine } from 'react-icons/ri';
import { BsTrash } from 'react-icons/bs';
import { BiBlock } from 'react-icons/bi';
import { FaBolt } from 'react-icons/fa';

const ChatHeader = ({
  activeChatData,
  isTyping,
  showAIPanel,
  handleAIButtonClick,
  showChatOptions,
  setShowChatOptions,
  onSaveChat,
  onClearChat,
  onBlockChat,
  chatOptionsRef,
  setShowSidebar,
  showSidebar
}) => {
  const Avatar = ({ name, isOnline }) => {
    const initials = name
      ? name.split(" ").map((n) => n[0]).join("")
      : "?";
    return (
      <div className="relative">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-pink-200 to-blue-300 flex items-center justify-center text-white font-medium text-lg shadow-sm">
          {initials}
        </div>
        {isOnline && (
          <div className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 rounded-full border-2 border-white"></div>
        )}
      </div>
    );
  };

  return (
    <div className="p-4 backdrop-blur-sm bg-white/40 border-b border-slate-200/50 flex items-center h-[11.4%] sticky top-0">
      <div className="absolute inset-0 bg-gradient-to-r from-slate-50/40 via-transparent to-slate-50/40 animate-pulse" style={{ animationDuration: '3s' }} />

      <button
        onClick={() => setShowSidebar(true)}
        className={`
          mr-3 p-2 rounded-lg relative group
          ${showSidebar ? 'bg-blue-100 text-blue-500' : 'text-gray-500 hover:text-blue-500 hover:bg-blue-50'}
          transition-all duration-300 transform hover:scale-105
        `}
        aria-label="Show Chat List"
      >
        <div className="absolute inset-0 bg-blue-100/50 rounded-lg transition-all duration-300 opacity-0 group-hover:opacity-100" />
        <FiHome className="w-6 h-6 relative z-10" />
      </button>

      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-200 to-blue-200 rounded-full opacity-0 group-hover:opacity-100 transition duration-500"></div>
        <Avatar
          name={activeChatData?.name}
          isOnline={activeChatData?.isOnline}
        />
        {activeChatData?.isOnline && (
          <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 bg-blue-500 rounded-full border-2 border-white">
            <div className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-75"></div>
          </div>
        )}
      </div>

      <div className="ml-3 flex-1 min-w-0">
        <h3 className="font-semibold text-gray-800 truncate group-hover:text-blue-500 transition-colors">
          {activeChatData?.name}
        </h3>
        <p className="text-xs text-gray-500 truncate">
          {isTyping ? (
            <span className="inline-flex items-center">
              <span className="text-blue-500">Typing</span>
              <span className="ml-1 flex space-x-1">
                <span className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                <span className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                <span className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
              </span>
            </span>
          ) : activeChatData?.isOnline ? (
            <span className="text-green-500">Online</span>
          ) : (
            "Last seen recently"
          )}
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <button
          className={`p-2 rounded-lg transition-all duration-300 transform hover:scale-105 relative group
            ${showAIPanel 
              ? 'bg-blue-100 text-blue-500 shadow-inner shadow-blue-200/50' 
              : 'text-gray-500 hover:text-blue-500 hover:bg-blue-50'}`}
          onClick={handleAIButtonClick}
          aria-label="Toggle AI Panel"
        >
          <div className={`absolute inset-0 bg-blue-100/50 rounded-lg transition-all duration-300
            ${showAIPanel ? 'scale-100 opacity-100' : 'scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100'}`} 
          />
          <FaBolt className={`h-5 w-5 relative z-10 transition-transform duration-300
            ${showAIPanel ? 'rotate-360 scale-110' : ''}`} 
          />
          {showAIPanel && (
            <span className="absolute -top-1 -right-1 h-2 w-2 bg-blue-500 rounded-full animate-pulse" />
          )}
        </button>

        <div className="relative">
          <button
            className="chat-options-trigger p-2 text-gray-500 hover:text-blue-500 rounded-lg hover:bg-blue-50 transition-all duration-300 transform hover:scale-105"
            onClick={() => setShowChatOptions(!showChatOptions)}
          >
            <FiMoreVertical className="h-5 w-5" />
          </button>
          {showChatOptions && (
            <div
              ref={chatOptionsRef}
              className="absolute right-0 mt-2 bg-slate-50/90 rounded-xl shadow-xl border border-slate-200/50 py-1 w-48 z-50 transform origin-top-right transition-all duration-300 backdrop-blur-sm"
              style={{
                animation: "slideIn 0.3s ease-out forwards"
              }}
            >
              <button 
                className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                onClick={onSaveChat}
              >
                <RiBookmarkLine className="mr-2 text-blue-500" /> Save Chat
              </button>
              <button
                className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                onClick={onClearChat}
              >
                <BsTrash className="mr-2 text-blue-500" /> Clear Chat
              </button>
              <button
                className="flex items-center w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                onClick={onBlockChat}
              >
                <BiBlock className="mr-2" /> Block Contact
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatHeader; 