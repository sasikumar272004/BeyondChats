import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSliders } from "react-icons/fi";


const mockChats = [
  {
    id: 1,
    name: 'Alex Johnson',
    lastMessage: 'Hey, about the project deadline...',
    time: '10:30 AM',
    unread: 3,
    isOnline: true,
    viewed: false,
    isPinned: true,
    avatarColor: 'bg-blue-100 text-blue-800',
    lastActive: '2 mins ago',
    status: 'Project Manager',
    messages: [
      { id: 1, text: 'Hi there!', time: '9:15 AM', sender: 'them' },
      { id: 2, text: 'How are you doing?', time: '9:16 AM', sender: 'them' },
      { id: 3, text: "I'm good, thanks! How about you?", time: '9:30 AM', sender: 'me' },
      { id: 4, text: 'Hey, about the project deadline...', time: '10:30 AM', sender: 'them' }
    ]
  },
  {
    id: 2,
    name: 'Sarah Williams',
    lastMessage: 'The design files are ready for review',
    time: 'Yesterday',
    unread: 0,
    isOnline: false,
    viewed: true,
    isPinned: false,
    avatarColor: 'bg-teal-100 text-teal-800',
    lastActive: '1 hour ago',
    status: 'UI/UX Designer',
    messages: [
      { id: 1, text: 'Working on those designs', time: 'Yesterday, 2:45 PM', sender: 'them' },
      { id: 2, text: 'When do you think they will be ready?', time: 'Yesterday, 3:10 PM', sender: 'me' },
      { id: 3, text: 'The design files are ready for review', time: 'Yesterday, 4:30 PM', sender: 'them' }
    ]
  },
  {
    id: 3,
    name: 'Michael Chen',
    lastMessage: 'Meeting notes from today',
    time: 'Yesterday',
    unread: 1,
    isOnline: true,
    viewed: false,
    isPinned: true,
    avatarColor: 'bg-indigo-100 text-indigo-800',
    lastActive: '30 mins ago',
    status: 'Developer',
    messages: [
      { id: 1, text: 'Can we sync up about the API?', time: 'Yesterday, 11:20 AM', sender: 'them' },
      { id: 2, text: 'Sure, what time works for you?', time: 'Yesterday, 11:45 AM', sender: 'me' },
      { id: 3, text: 'Meeting notes from today', time: 'Yesterday, 5:15 PM', sender: 'them' }
    ]
  },
  {
    id: 4,
    name: 'Emma Davis',
    lastMessage: 'Thanks for your help with the issue!',
    time: '2 days ago',
    unread: 0,
    isOnline: false,
    viewed: true,
    isPinned: false,
    avatarColor: 'bg-purple-100 text-purple-800',
    lastActive: '5 hours ago',
    status: 'QA Engineer',
    messages: [
      { id: 1, text: 'Found an issue with the login flow', time: '2 days ago, 9:00 AM', sender: 'them' },
      { id: 2, text: 'Looking into it now', time: '2 days ago, 9:30 AM', sender: 'me' },
      { id: 3, text: 'Fixed! Should be working now', time: '2 days ago, 11:45 AM', sender: 'me' },
      { id: 4, text: 'Thanks for your help with the issue!', time: '2 days ago, 12:30 PM', sender: 'them' }
    ]
  },
  {
    id: 5,
    name: 'David Wilson',
    lastMessage: 'The budget has been approved',
    time: '3 days ago',
    unread: 0,
    isOnline: false,
    viewed: true,
    isPinned: false,
    avatarColor: 'bg-cyan-100 text-cyan-800',
    lastActive: '1 day ago',
    status: 'Finance Director',
    messages: [
      { id: 1, text: 'I need approval for the Q3 budget', time: '3 days ago, 10:00 AM', sender: 'me' },
      { id: 2, text: 'Reviewing it now', time: '3 days ago, 2:30 PM', sender: 'them' },
      { id: 3, text: 'The budget has been approved', time: '3 days ago, 4:45 PM', sender: 'them' }
    ]
  },
  {
    id: 6,
    name: 'Olivia Martinez',
    lastMessage: 'Can you send me the client requirements?',
    time: '4 days ago',
    unread: 2,
    isOnline: true,
    viewed: false,
    isPinned: false,
    avatarColor: 'bg-sky-100 text-sky-800',
    lastActive: '15 mins ago',
    status: 'Account Manager',
    messages: [
      { id: 1, text: 'We have a new client onboarding', time: '4 days ago, 9:00 AM', sender: 'them' },
      { id: 2, text: 'Great! What are their requirements?', time: '4 days ago, 9:15 AM', sender: 'me' },
      { id: 3, text: 'Can you send me the client requirements?', time: '4 days ago, 3:30 PM', sender: 'them' }
    ]
  },
  {
    id: 7,
    name: 'James Taylor',
    lastMessage: 'The server migration is complete',
    time: '1 week ago',
    unread: 0,
    isOnline: false,
    viewed: true,
    isPinned: false,
    avatarColor: 'bg-blue-100 text-blue-800',
    lastActive: '2 days ago',
    status: 'DevOps Engineer',
    messages: [
      { id: 1, text: 'Starting server migration tonight', time: '1 week ago, 5:00 PM', sender: 'them' },
      { id: 2, text: 'How long will it take?', time: '1 week ago, 5:30 PM', sender: 'me' },
      { id: 3, text: 'About 4 hours, with some downtime', time: '1 week ago, 6:00 PM', sender: 'them' },
      { id: 4, text: 'The server migration is complete', time: '1 week ago, 10:30 PM', sender: 'them' }
    ]
  },
  {
    id: 8,
    name: 'Sophia Anderson',
    lastMessage: 'Your vacation request was approved',
    time: '2 weeks ago',
    unread: 0,
    isOnline: false,
    viewed: true,
    isPinned: false,
    avatarColor: 'bg-teal-100 text-teal-800',
    lastActive: '3 days ago',
    status: 'HR Manager',
    messages: [
      { id: 1, text: 'I submitted a vacation request', time: '2 weeks ago, 9:00 AM', sender: 'me' },
      { id: 2, text: 'We received it, reviewing now', time: '2 weeks ago, 11:00 AM', sender: 'them' },
      { id: 3, text: 'Your vacation request was approved', time: '2 weeks ago, 3:00 PM', sender: 'them' }
    ]
  },
  {
    id: 9,
    name: 'Marketing Team',
    lastMessage: 'New campaign performance metrics attached',
    time: 'Just now',
    unread: 5,
    isOnline: true,
    viewed: false,
    isPinned: true,
    avatarColor: 'bg-indigo-100 text-indigo-800',
    lastActive: 'Just now',
    status: 'Group Chat',
    messages: [
      { id: 1, text: 'Let me share the new campaign ideas', time: 'Today, 9:00 AM', sender: 'them' },
      { id: 2, text: 'These look great!', time: 'Today, 9:30 AM', sender: 'me' },
      { id: 3, text: 'When will we launch?', time: 'Today, 10:00 AM', sender: 'them' },
      { id: 4, text: 'New campaign performance metrics attached', time: 'Just now', sender: 'them' }
    ]
  },
  {
    id: 10,
    name: 'Support Ticket #4521',
    lastMessage: 'Your issue has been escalated to tier 2',
    time: '30 mins ago',
    unread: 1,
    isOnline: true,
    viewed: false,
    isPinned: false,
    avatarColor: 'bg-purple-100 text-purple-800',
    lastActive: '30 mins ago',
    status: 'High Priority',
    messages: [
      { id: 1, text: 'I have an issue with my account', time: 'Today, 8:00 AM', sender: 'me' },
      { id: 2, text: 'We are looking into it', time: 'Today, 8:30 AM', sender: 'them' },
      { id: 3, text: 'Your issue has been escalated to tier 2', time: '30 mins ago', sender: 'them' }
    ]
  },
  {
    id: 11,
    name: 'Robert Garcia',
    lastMessage: 'The client loved the presentation!',
    time: '1 hour ago',
    unread: 0,
    isOnline: true,
    viewed: true,
    isPinned: false,
    avatarColor: 'bg-cyan-100 text-cyan-800',
    lastActive: '20 mins ago',
    status: 'Sales Executive',
    messages: [
      { id: 1, text: 'Preparing for the client meeting', time: 'Today, 9:00 AM', sender: 'them' },
      { id: 2, text: 'Good luck! Let me know how it goes', time: 'Today, 9:15 AM', sender: 'me' },
      { id: 3, text: 'The client loved the presentation!', time: '1 hour ago', sender: 'them' }
    ]
  },
  {
    id: 12,
    name: 'Lisa Thompson',
    lastMessage: 'Can we reschedule our meeting?',
    time: '3 hours ago',
    unread: 2,
    isOnline: false,
    viewed: false,
    isPinned: false,
    avatarColor: 'bg-sky-100 text-sky-800',
    lastActive: '4 hours ago',
    status: 'Product Manager',
    messages: [
      { id: 1, text: 'About our 2pm meeting tomorrow', time: 'Today, 11:00 AM', sender: 'them' },
      { id: 2, text: 'Yes, what about it?', time: 'Today, 11:30 AM', sender: 'me' },
      { id: 3, text: 'Can we reschedule our meeting?', time: '3 hours ago', sender: 'them' }
    ]
  },
  {
    id: 13,
    name: 'Daniel Kim',
    lastMessage: 'The analytics dashboard is ready',
    time: '5 hours ago',
    unread: 0,
    isOnline: false,
    viewed: true,
    isPinned: true,
    avatarColor: 'bg-blue-100 text-blue-800',
    lastActive: '6 hours ago',
    status: 'Data Analyst',
    messages: [
      { id: 1, text: 'Working on the analytics dashboard', time: 'Yesterday, 4:00 PM', sender: 'them' },
      { id: 2, text: 'When will it be ready?', time: 'Yesterday, 4:30 PM', sender: 'me' },
      { id: 3, text: 'The analytics dashboard is ready', time: '5 hours ago', sender: 'them' }
    ]
  },
  {
    id: 14,
    name: 'Jennifer Lee',
    lastMessage: 'Thanks for the quick response!',
    time: 'Yesterday',
    unread: 0,
    isOnline: true,
    viewed: true,
    isPinned: false,
    avatarColor: 'bg-teal-100 text-teal-800',
    lastActive: '45 mins ago',
    status: 'Customer Support',
    messages: [
      { id: 1, text: 'I have a question about the subscription', time: 'Yesterday, 2:00 PM', sender: 'them' },
      { id: 2, text: 'Sure, what would you like to know?', time: 'Yesterday, 2:05 PM', sender: 'me' },
      { id: 3, text: 'Thanks for the quick response!', time: 'Yesterday, 2:30 PM', sender: 'them' }
    ]
  },
  {
    id: 15,
    name: 'Thomas Brown',
    lastMessage: 'The new feature is deployed to staging',
    time: '2 days ago',
    unread: 1,
    isOnline: false,
    viewed: false,
    isPinned: false,
    avatarColor: 'bg-indigo-100 text-indigo-800',
    lastActive: '1 day ago',
    status: 'Tech Lead',
    messages: [
      { id: 1, text: 'Working on the new feature deployment', time: '2 days ago, 10:00 AM', sender: 'them' },
      { id: 2, text: 'Keep me updated on progress', time: '2 days ago, 10:30 AM', sender: 'me' },
      { id: 3, text: 'The new feature is deployed to staging', time: '2 days ago, 4:00 PM', sender: 'them' }
    ]
  }
];

const ChatList = ({ 
  chats, 
  setChats, 
  activeChat, 
  setActiveChat,
  setShowSidebar 
}) => {
  const [activeFilter, setActiveFilter] = useState('open');
  const [selectedChats, setSelectedChats] = useState([]);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIcon, setActiveIcon] = useState(0);

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

  // Icon animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIcon(prev => (prev + 1) % 2);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Counts for different chat states
  const openChatsCount = chats.filter(chat => !chat.viewed || chat.unread > 0).length;
  const waitingChatsCount = chats.filter(chat => chat.viewed && chat.unread === 0).length;

  const handleChatClick = useCallback((chatId, e) => {
    if (isSelectMode) {
      // Handle multi-select
      setSelectedChats(prev => 
        prev.includes(chatId) 
          ? prev.filter(id => id !== chatId) 
          : [...prev, chatId]
      );
      return;
    }

    // Mark as viewed when clicked but don't change the filter tab
    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === chatId 
          ? { ...chat, unread: 0, viewed: true } 
          : chat
      )
    );

    // Smooth transition to active chat
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
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-full md:w-1/4 bg-slate-50 flex flex-col h-full overflow-hidden rounded-2xl border border-slate-200 font-sans"
    >
      {/* Header with actions */}
      <div className="p-4 flex items-center justify-between bg-slate-50 border-b border-slate-200 sticky top-0 z-20 rounded-t-2xl">
        <div className="flex items-center space-x-2">
          {isSelectMode ? (
            <>
              <motion.button 
                onClick={toggleSelectMode}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full hover:bg-slate-100 transition-colors"
              >
                <svg className="h-5 w-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm font-medium text-slate-700"
              >
                {selectedChats.length} selected
              </motion.span>
            </>
          ) : (
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-lg font-semibold text-slate-800"
            >
              Messages
            </motion.h1>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {isSelectMode ? (
            <>
              <motion.button 
                onClick={archiveSelected}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                title="Archive"
              >
                <svg className="h-5 w-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </motion.button>
              <motion.button 
                onClick={deleteSelected}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                title="Delete"
              >
                <svg className="h-5 w-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </motion.button>
            </>
          ) : (
            <>
              <motion.button 
                onClick={toggleSelectMode}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                title="Select messages"
              >
                <svg className="h-5 w-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </motion.button>
              <motion.button 
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full hover:bg-slate-100 transition-colors md:hidden"
                onClick={() => setShowSidebar(false)}
                title="Close sidebar"
              >
                <svg className="h-5 w-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </>
          )}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex border-b border-slate-200 bg-slate-50 sticky top-16 z-10">
        <button
          className={`flex-1 py-3 px-2 text-sm font-medium relative flex items-center justify-center transition-colors ${activeFilter === 'open' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
          onClick={() => setActiveFilter('open')}
        >
          <span className={`text-xs px-1.5 py-0.5 rounded mr-1.5 ${activeFilter === 'open' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-600'}`}>
            {openChatsCount}
          </span>
          <span>Open</span>
          {activeFilter === 'open' && (
            <motion.div 
              layoutId="activeFilter"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-t"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
        </button>
        <button
          className={`flex-1 py-3 px-2 text-sm font-medium relative flex items-center justify-center transition-colors ${activeFilter === 'waiting' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
          onClick={() => setActiveFilter('waiting')}
        >
          <span className={`text-xs px-1.5 py-0.5 rounded mr-1.5 ${activeFilter === 'waiting' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-600'}`}>
            {waitingChatsCount}
          </span>
          <span>Waiting</span>
          {activeFilter === 'waiting' && (
            <motion.div 
              layoutId="activeFilter"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-t"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
        </button>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 hover:scrollbar-thumb-slate-400">
        {isLoading ? (
          <div className="flex flex-col space-y-3 p-4">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0.5, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1, duration: 0.3, ease: "easeOut" }}
                className="flex items-center space-x-3 p-3 rounded-lg bg-slate-100/50"
              >
                <div className="h-12 w-12 bg-slate-200/50 rounded-full animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200/50 rounded w-3/4 animate-pulse"></div>
                  <div className="h-3 bg-slate-200/50 rounded w-1/2 animate-pulse"></div>
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
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={`relative flex items-center p-3 border-b border-slate-100 hover:bg-slate-100/30 cursor-pointer transition-colors duration-200 ${
                  activeChat === chat.id ? 'bg-blue-50/50' : ''
                } ${selectedChats.includes(chat.id) ? 'bg-blue-100/30' : ''}`}
                onClick={(e) => handleChatClick(chat.id, e)}
              >
                {isSelectMode && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mr-2"
                  >
                    <input 
                      type="checkbox" 
                      checked={selectedChats.includes(chat.id)}
                      onChange={() => {}}
                      className="h-4 w-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 transition-colors"
                    />
                  </motion.div>
                )}

                <div className="relative flex-shrink-0">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${chat.avatarColor}`}>
                    {chat.name.charAt(0)}
                  </div>
                  {chat.isOnline && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -bottom-1 -right-1"
                    >
                      <div className="h-3 w-3 bg-green-500 rounded-full border-2 border-slate-50"></div>
                    </motion.div>
                  )}
                </div>

                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium text-slate-800 truncate">
                      {chat.name}
                      {chat.isPinned && !isSelectMode && (
                        <span className="ml-1 text-blue-500">
                          <svg className="h-3 w-3 inline" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M16 12V4H17V2H7V4H8V12L6 14V16H11.2V22H12.8V16H18V14L16 12Z" />
                          </svg>
                        </span>
                      )}
                    </h3>
                    <div className="flex items-center space-x-1">
                      <span className={`text-xs ${
                        chat.viewed ? 'text-slate-500' : 'text-slate-700 font-medium'
                      } whitespace-nowrap transition-colors`}>
                        {chat.time}
                      </span>
                      {chat.unread > 0 && (
                        <motion.span 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-xs bg-blue-500 text-white rounded-full h-5 w-5 flex items-center justify-center"
                        >
                          {chat.unread}
                        </motion.span>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-0.5">
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs truncate ${
                        chat.viewed ? 'text-slate-600' : 'text-slate-800 font-medium'
                      } transition-colors`}>
                        {chat.lastMessage}
                      </p>
                      {chat.status && (
                        <p className="text-xs text-slate-500 truncate transition-colors">{chat.status}</p>
                      )}
                    </div>
                    {!isSelectMode && (
                      <motion.button 
                        onClick={(e) => {
                          e.stopPropagation();
                          pinChat(chat.id);
                        }}
                        whileTap={{ scale: 0.9 }}
                        className={`ml-2 p-1 rounded-full ${
                          chat.isPinned ? 'text-blue-500 hover:text-blue-700' : 'text-slate-400 hover:text-slate-600'
                        } transition-colors`}
                        title={chat.isPinned ? "Unpin chat" : "Pin chat"}
                      >
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M16 12V4H17V2H7V4H8V12L6 14V16H11.2V22H12.8V16H18V14L16 12Z" />
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
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex flex-col items-center justify-center h-full text-center p-6"
          >
            <motion.div 
              animate={{ 
                rotate: [0, 5, -5, 0],
                transition: { repeat: Infinity, duration: 2, ease: "linear" } 
              }}
              className="bg-slate-100 p-4 rounded-full mb-4"
            >
              <svg className="h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </motion.div>
            <h3 className="text-sm font-medium text-slate-700 mb-1">No chats available</h3>
            <p className="text-xs text-slate-500 max-w-xs">
              You currently have no conversations.
            </p>
          </motion.div>
        )}
      </div>

      {/* Footer with animated icons */}
  <div className="p-3 border-t border-slate-200 bg-slate-50 rounded-b-2xl flex justify-start">
  <div className="flex items-center gap-4">
    <div>
      <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </div>
    <div>
      <FiSliders className="h-5 w-5 text-blue-500" />
    </div>
  </div>
</div>
    </motion.div>
  );
};

export default React.memo(ChatList);