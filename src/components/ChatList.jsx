import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ChatList = ({ 
  chats, 
  setChats, 
  activeChat, 
  setActiveChat,
  setShowSidebar 
}) => {
  const [selectedChats, setSelectedChats] = useState([]);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize with mock data if empty
  useEffect(() => {
    const timer = setTimeout(() => {
      if (chats.length === 0) {
        setChats(mockChats);
      }
      setIsLoading(false);
    }, 800); // Simulate loading
    
    return () => clearTimeout(timer);
  }, [chats.length, setChats]);

  const handleChatClick = useCallback((chatId, e) => {
    if (isSelectMode) {
      setSelectedChats(prev => 
        prev.includes(chatId) 
          ? prev.filter(id => id !== chatId) 
          : [...prev, chatId]
      );
      return;
    }

    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === chatId 
          ? { ...chat, unread: 0, viewed: true } 
          : chat
      )
    );

    setTimeout(() => {
      setActiveChat(chatId);
      if (window.innerWidth < 768) {
        setShowSidebar(false);
      }
    }, 150);
  }, [isSelectMode, setActiveChat, setChats, setShowSidebar]);

  const toggleSelectMode = () => {
    setIsSelectMode(!isSelectMode);
    if (isSelectMode) {
      setSelectedChats([]);
    }
  };

  const pinChat = (chatId) => {
    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === chatId 
          ? { ...chat, isPinned: !chat.isPinned } 
          : chat
      )
    );
  };

  const archiveSelected = () => {
    setChats(prevChats => 
      prevChats.filter(chat => !selectedChats.includes(chat.id))
    );
    setSelectedChats([]);
    setIsSelectMode(false);
  };

  const deleteSelected = () => {
    setChats(prevChats => 
      prevChats.filter(chat => !selectedChats.includes(chat.id))
    );
    setSelectedChats([]);
    setIsSelectMode(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="w-full md:w-1/4 flex flex-col h-full overflow-hidden font-sans bg-gradient-to-b from-blue-50 to-blue-100 text-gray-800 rounded-xl"
    >
      {/* Header with actions */}
      <div className="p-4 flex items-center justify-between bg-white/80 backdrop-blur-sm border-b border-blue-200 rounded-t-xl sticky top-0 z-20">
        <div className="flex items-center space-x-2">
          {isSelectMode ? (
            <>
              <motion.button 
                onClick={toggleSelectMode}
                whileTap={{ scale: 0.92 }}
                className="p-2 rounded-lg hover:bg-blue-100/50 transition-all"
              >
                <svg className="h-5 w-5 text-blue-600" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                </svg>
              </motion.button>
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: "spring" }}
                className="text-sm font-medium text-blue-600"
              >
                {selectedChats.length} selected
              </motion.span>
            </>
          ) : (
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-lg font-semibold text-blue-800"
            >
              Conversations
            </motion.h1>
          )}
        </div>
        
        <div className="flex items-center space-x-1">
          {isSelectMode ? (
            <>
              <motion.button 
                onClick={archiveSelected}
                whileTap={{ scale: 0.92 }}
                className="p-2 rounded-lg hover:bg-blue-100/50 transition-all"
              >
                <svg className="h-5 w-5 text-blue-600" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M20.54,5.23L19.15,3.55C18.88,3.21 18.47,3 18,3H6C5.53,3 5.12,3.21 4.84,3.55L3.46,5.23C3.17,5.57 3,6.02 3,6.5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V6.5C21,6.02 20.83,5.57 20.54,5.23M6.24,5H17.76L18.18,5.5L17.12,6.5L6.89,6.5L5.82,5.5L6.24,5M5,19V8H19V19H5Z" />
                </svg>
              </motion.button>
              <motion.button 
                onClick={deleteSelected}
                whileTap={{ scale: 0.92 }}
                className="p-2 rounded-lg hover:bg-blue-100/50 transition-all"
              >
                <svg className="h-5 w-5 text-blue-600" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
                </svg>
              </motion.button>
            </>
          ) : (
            <>
              <motion.button 
                onClick={toggleSelectMode}
                whileTap={{ scale: 0.92 }}
                className="p-2 rounded-lg hover:bg-blue-100/50 transition-all"
              >
                <svg className="h-5 w-5 text-blue-600" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M9,13H15V11H9M9,17H15V15H9M9,9H15V7H9M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z" />
                </svg>
              </motion.button>
              <motion.button 
                whileTap={{ scale: 0.92 }}
                className="p-2 rounded-lg hover:bg-blue-100/50 transition-all md:hidden"
                onClick={() => setShowSidebar(false)}
              >
                <svg className="h-5 w-5 text-blue-600" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                </svg>
              </motion.button>
            </>
          )}
        </div>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-transparent">
        {isLoading ? (
          <div className="flex flex-col space-y-3 p-4">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center space-x-3 p-3 rounded-xl bg-white/50 backdrop-blur-sm"
              >
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 animate-pulse" style={{ width: `${60 + Math.random() * 30}%` }}></div>
                  <div className="h-3 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 animate-pulse" style={{ width: `${40 + Math.random() * 40}%` }}></div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : chats.length > 0 ? (
          <AnimatePresence initial={false}>
            {chats.map((chat) => (
              <motion.div
                key={chat.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  transition: { type: "spring", stiffness: 400, damping: 30 }
                }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className={`relative flex items-center p-3 mx-3 my-2 rounded-xl cursor-pointer transition-all duration-300 hover:bg-white/70 ${
                  activeChat === chat.id ? 'bg-white shadow-sm' : 'bg-white/50'
                } ${selectedChats.includes(chat.id) ? 'bg-blue-100/70' : ''}`}
                onClick={(e) => handleChatClick(chat.id, e)}
              >
                {isSelectMode && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mr-3"
                  >
                    <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      selectedChats.includes(chat.id) 
                        ? 'bg-blue-500 border-blue-500' 
                        : 'border-blue-300 hover:border-blue-400'
                    }`}>
                      {selectedChats.includes(chat.id) && (
                        <motion.svg
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="h-3 w-3 text-white"
                          viewBox="0 0 24 24"
                        >
                          <path fill="currentColor" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
                        </motion.svg>
                      )}
                    </div>
                  </motion.div>
                )}

                <div className={`h-12 w-12 rounded-full flex items-center justify-center ${chat.avatarColor} font-medium text-lg text-white`}>
                  {chat.name.charAt(0)}
                </div>

                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <motion.h3 
                      className="text-sm font-medium text-gray-800 truncate"
                      whileHover={{ x: 2 }}
                    >
                      {chat.name}
                    </motion.h3>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs ${
                        chat.viewed ? 'text-gray-500' : 'text-blue-600 font-medium'
                      } whitespace-nowrap transition-colors`}>
                        {chat.time}
                      </span>
                      {chat.unread > 0 && (
                        <motion.span 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-xs bg-blue-500 text-white rounded-full h-5 w-5 flex items-center justify-center font-medium"
                        >
                          {chat.unread}
                        </motion.span>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs truncate ${
                        chat.viewed ? 'text-gray-500' : 'text-gray-700 font-medium'
                      } transition-colors`}>
                        {chat.lastMessage}
                      </p>
                    </div>
                    {!isSelectMode && (
                      <motion.button 
                        onClick={(e) => {
                          e.stopPropagation();
                          pinChat(chat.id);
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`ml-2 p-1 rounded-lg ${
                          chat.isPinned ? 'text-blue-500 hover:bg-blue-100/50' : 'text-gray-400 hover:bg-blue-100/30 hover:text-blue-500'
                        } transition-all`}
                      >
                        <svg className="h-4 w-4" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M16,12V4H17V2H7V4H8V12L6,14V16H11.2V22H12.8V16H18V14L16,12Z" />
                        </svg>
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center h-full text-center p-8"
          >
            <motion.div 
              animate={{ 
                y: [0, -5, 0],
                transition: { repeat: Infinity, duration: 3, ease: "easeInOut" } 
              }}
              className="mb-6"
            >
              <svg className="h-16 w-16 text-blue-300" viewBox="0 0 24 24">
                <path fill="currentColor" d="M19,15H15A3,3 0 0,1 12,18A3,3 0 0,1 9,15H5V5H19M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z" />
              </svg>
            </motion.div>
            <h3 className="text-sm font-medium text-blue-600 mb-2">No conversations yet</h3>
            <p className="text-xs text-blue-400 max-w-xs">
              Start a new conversation to see it appear here
            </p>
          </motion.div>
        )}
      </div>

      {/* Footer with new chat button */}
       <div className="p-3 border-t border-gray-700/10 bg-blue-100 backdrop-blur-sm flex justify-start">
        <div className="flex items-center bg-blue-200/50 rounded-full p-1">
          <motion.button
            whileHover={{ backgroundColor: 'rgba(34, 211, 238, 0.1)' }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-full transition-all`}
         
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12,3L2,12H5V20H19V12H22L12,3M12,7.7L16,11.2V18H14V14H10V18H8V11.2L12,7.7Z" />
            </svg>
          </motion.button>
          <motion.button
            whileHover={{ backgroundColor: 'rgba(34, 211, 238, 0.1)' }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-full transition-all `}
           
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22A9,9 0 0,0 21,13A9,9 0 0,0 12,4M12.5,8H11V14L15.75,16.85L16.5,15.62L12.5,13.25V8M7.88,3.39L6.6,1.86L2,5.71L3.29,7.24L7.88,3.39M22,5.72L17.4,1.86L16.11,3.39L20.71,7.25L22,5.72Z" />
            </svg>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(ChatList);

// Mock data
const mockChats = [
  {
    id: '1',
    name: 'Alex Johnson',
    lastMessage: 'Hey, how about our meeting tomorrow?',
    time: '10:30 AM',
    unread: 2,
    viewed: false,
    isPinned: true,
    avatarColor: 'bg-gradient-to-r from-blue-500 to-blue-600'
  },
  {
    id: '2',
    name: 'Sarah Williams',
    lastMessage: 'I sent you the design files',
    time: 'Yesterday',
    unread: 0,
    viewed: true,
    isPinned: false,
    avatarColor: 'bg-gradient-to-r from-purple-500 to-purple-600'
  },
  {
    id: '3',
    name: 'Michael Chen',
    lastMessage: 'The project is due next week',
    time: 'Yesterday',
    unread: 5,
    viewed: false,
    isPinned: true,
    avatarColor: 'bg-gradient-to-r from-green-500 to-green-600'
  },
  {
    id: '4',
    name: 'Emily Davis',
    lastMessage: 'Thanks for your help!',
    time: '2 days ago',
    unread: 0,
    viewed: true,
    isPinned: false,
    avatarColor: 'bg-gradient-to-r from-pink-500 to-pink-600'
  },
  {
    id: '5',
    name: 'David Wilson',
    lastMessage: 'Let me know when you are free',
    time: '3 days ago',
    unread: 0,
    viewed: true,
    isPinned: false,
    avatarColor: 'bg-gradient-to-r from-yellow-500 to-yellow-600'
  },
  {
    id: '6',
    name: 'Jessica Brown',
    lastMessage: 'The documents have been approved',
    time: '1 week ago',
    unread: 0,
    viewed: true,
    isPinned: false,
    avatarColor: 'bg-gradient-to-r from-red-500 to-red-600'
  }
];