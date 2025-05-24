import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AiOutlineMessage } from 'react-icons/ai';

// ... (keep your mockChats data the same) ...
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
    avatarColor: 'bg-[#FFD6BA] text-[#FF6F61]',
    lastActive: '2 mins ago',
    status: 'Project Manager',
    messages: [
      { id: 1, content: 'Hi there!', time: '9:15 AM', sender: 'them' },
      { id: 2, content: 'How are you doing?', time: '9:16 AM', sender: 'them' },
      { id: 3, content: "I'm good, thanks! How about you?", time: '9:30 AM', sender: 'me' },
      { id: 4, content: 'Hey, about the project deadline...', time: '10:30 AM', sender: 'them' }
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
    avatarColor: 'bg-[#F6D1C1] text-[#D49A89]',
    lastActive: '1 hour ago',
    status: 'UI/UX Designer',
    messages: [
      { id: 1, content: 'Working on those designs', time: 'Yesterday, 2:45 PM', sender: 'them' },
      { id: 2, content: 'When do you think they will be ready?', time: 'Yesterday, 3:10 PM', sender: 'me' },
      { id: 3, content: 'The design files are ready for review', time: 'Yesterday, 4:30 PM', sender: 'them' }
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
    avatarColor: 'bg-[#FFF5E1] text-[#A68973]',
    lastActive: '30 mins ago',
    status: 'Developer',
    messages: [
      { id: 1, content: 'Can we sync up about the API?', time: 'Yesterday, 11:20 AM', sender: 'them' },
      { id: 2, content: 'Sure, what time works for you?', time: 'Yesterday, 11:45 AM', sender: 'me' },
      { id: 3, content: 'Meeting notes from today', time: 'Yesterday, 5:15 PM', sender: 'them' }
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
    avatarColor: 'bg-[#F8CBA6] text-[#FF6F61]',
    lastActive: '5 hours ago',
    status: 'QA Engineer',
    messages: [
      { id: 1, content: 'Found an issue with the login flow', time: '2 days ago, 9:00 AM', sender: 'them' },
      { id: 2, content: 'Looking into it now', time: '2 days ago, 9:30 AM', sender: 'me' },
      { id: 3, content: 'Fixed! Should be working now', time: '2 days ago, 11:45 AM', sender: 'me' },
      { id: 4, content: 'Thanks for your help with the issue!', time: '2 days ago, 12:30 PM', sender: 'them' }
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
    avatarColor: 'bg-[#EFD9C1] text-[#D47452]',
    lastActive: '1 day ago',
    status: 'Finance Director',
    messages: [
      { id: 1, content: 'I need approval for the Q3 budget', time: '3 days ago, 10:00 AM', sender: 'me' },
      { id: 2, content: 'Reviewing it now', time: '3 days ago, 2:30 PM', sender: 'them' },
      { id: 3, content: 'The budget has been approved', time: '3 days ago, 4:45 PM', sender: 'them' }
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
      { id: 1, content: 'We have a new client onboarding', time: '4 days ago, 9:00 AM', sender: 'them' },
      { id: 2, content: 'Great! What are their requirements?', time: '4 days ago, 9:15 AM', sender: 'me' },
      { id: 3, content: 'Can you send me the client requirements?', time: '4 days ago, 3:30 PM', sender: 'them' }
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
      { id: 1, content: 'Starting server migration tonight', time: '1 week ago, 5:00 PM', sender: 'them' },
      { id: 2, content: 'How long will it take?', time: '1 week ago, 5:30 PM', sender: 'me' },
      { id: 3, content: 'About 4 hours, with some downtime', time: '1 week ago, 6:00 PM', sender: 'them' },
      { id: 4, content: 'The server migration is complete', time: '1 week ago, 10:30 PM', sender: 'them' }
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
      { id: 1, content: 'I submitted a vacation request', time: '2 weeks ago, 9:00 AM', sender: 'me' },
      { id: 2, content: 'We received it, reviewing now', time: '2 weeks ago, 11:00 AM', sender: 'them' },
      { id: 3, content: 'Your vacation request was approved', time: '2 weeks ago, 3:00 PM', sender: 'them' }
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
      { id: 1, content: 'Let me share the new campaign ideas', time: 'Today, 9:00 AM', sender: 'them' },
      { id: 2, content: 'These look great!', time: 'Today, 9:30 AM', sender: 'me' },
      { id: 3, content: 'When will we launch?', time: 'Today, 10:00 AM', sender: 'them' },
      { id: 4, content: 'New campaign performance metrics attached', time: 'Just now', sender: 'them' }
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
      { id: 1, content: 'I have an issue with my account', time: 'Today, 8:00 AM', sender: 'me' },
      { id: 2, content: 'We are looking into it', time: 'Today, 8:30 AM', sender: 'them' },
      { id: 3, content: 'Your issue has been escalated to tier 2', time: '30 mins ago', sender: 'them' }
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
      { id: 1, content: 'Preparing for the client meeting', time: 'Today, 9:00 AM', sender: 'them' },
      { id: 2, content: 'Good luck! Let me know how it goes', time: 'Today, 9:15 AM', sender: 'me' },
      { id: 3, content: 'The client loved the presentation!', time: '1 hour ago', sender: 'them' }
    ]
  }
,
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
      { id: 1, content: 'About our 2pm meeting tomorrow', time: 'Today, 11:00 AM', sender: 'them' },
      { id: 2, content: 'Yes, what about it?', time: 'Today, 11:30 AM', sender: 'me' },
      { id: 3, content: 'Can we reschedule our meeting?', time: '3 hours ago', sender: 'them' }
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
      { id: 1, content: 'I have a question about the subscription', time: 'Yesterday, 2:00 PM', sender: 'them' },
      { id: 2, content: 'Sure, what would you like to know?', time: 'Yesterday, 2:05 PM', sender: 'me' },
      { id: 3, content: 'Thanks for the quick response!', time: 'Yesterday, 2:30 PM', sender: 'them' }
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
      { id: 1, content: 'Working on the new feature deployment', time: '2 days ago, 10:00 AM', sender: 'them' },
      { id: 2, content: 'Keep me updated on progress', time: '2 days ago, 10:30 AM', sender: 'me' },
      { id: 3, content: 'The new feature is deployed to staging', time: '2 days ago, 4:00 PM', sender: 'them' }
    ]
  }
];

const ChatList = ({ 
  chats, 
  setChats, 
  activeChat, 
  setActiveChat,
  setShowSidebar,
  showSidebar 
}) => {
  const [activeFilter, setActiveFilter] = useState('open');
  const [selectedChats, setSelectedChats] = useState([]);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (chats.length === 0) {
        setChats(mockChats);
      }
      setIsLoading(false);
    }, 1200);
    
    return () => clearTimeout(timer);
  }, [chats.length, setChats]);

  // Enhanced animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0,
      x: -50,
      scale: 0.8
    },
    show: { 
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    }
  };

  const shimmerVariants = {
    hidden: { 
      opacity: 0, 
      x: -100,
      scale: 0.95
    },
    show: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 250,
        damping: 25
      }
    }
  };

  const openChatsCount = chats.filter(chat => !chat.viewed || chat.unread > 0).length;
  const waitingChatsCount = chats.filter(chat => chat.viewed && chat.unread === 0).length;

  const handleChatClick = (chatId) => {
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
  };
  
  const toggleSelectMode = () => {
    setIsSelectMode(!isSelectMode);
    if (isSelectMode) {
      setSelectedChats([]);
    }
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
      initial={{ x: -300, opacity: 0 }}
      animate={{ 
        x: showSidebar ? 0 : -300,
        opacity: showSidebar ? 1 : 0
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="h-full w-full flex flex-col bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0]"
    >
      {/* Header */}
      <motion.div 
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 25 }}
        className="px-6 py-4 border-b border-[#e2e8f0] bg-gradient-to-r from-white/80 via-[#f8fafc]/80 to-[#f1f5f9]/80 backdrop-blur-sm"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {isSelectMode ? (
              <>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleSelectMode}
                  className="p-2 rounded-full hover:bg-[#e2e8f0]/50 transition-colors"
                >
                  <svg className="h-5 w-5 text-[#64748b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
                <motion.span 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-sm font-medium text-[#64748b]"
                >
                  {selectedChats.length} selected
                </motion.span>
              </>
            ) : (
              <motion.h1 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xl font-semibold bg-gradient-to-r from-[#334155] to-[#64748b] bg-clip-text text-transparent"
              >
                Messages
              </motion.h1>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {isSelectMode ? (
              <>
                <button 
                  onClick={archiveSelected}
                  className="p-2 rounded-full hover:bg-[#e2e8f0]/50 transition-colors"
                  title="Archive"
                >
                  <svg className="h-5 w-5 text-[#64748b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                </button>
                <button 
                  onClick={deleteSelected}
                  className="p-2 rounded-full hover:bg-[#e2e8f0]/50 transition-colors"
                  title="Delete"
                >
                  <svg className="h-5 w-5 text-[#64748b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 011.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </>
            ) : (
              <button 
                onClick={toggleSelectMode}
                className="p-2 rounded-full hover:bg-[#e2e8f0]/50 transition-colors"
                title="Select Messages"
              >
                <svg className="h-5 w-5 text-[#64748b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Filter tabs */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="border-b border-[#e2e8f0] bg-gradient-to-r from-white/80 via-[#f8fafc]/80 to-[#f1f5f9]/80 backdrop-blur-sm"
      >
        <div className="flex px-2">
          <button
            className={`flex-1 py-3 px-4 text-sm font-medium relative transition-all duration-300 ${
              activeFilter === 'open' 
                ? 'text-[#2563eb]' 
                : 'text-[#64748b] hover:text-[#475569]'
            }`}
            onClick={() => setActiveFilter('open')}
          >
            <span className="flex items-center justify-center">
              <motion.span 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`mr-2 px-2.5 py-1 rounded-full text-xs ${
                  activeFilter === 'open' 
                    ? 'bg-[#bfdbfe] text-[#1d4ed8]' 
                    : 'bg-[#f1f5f9] text-[#64748b]'
                }`}
              >
                {openChatsCount}
              </motion.span>
              Open
            </span>
            {activeFilter === 'open' && (
              <motion.div 
                layoutId="activeTab"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563eb]"
              />
            )}
          </button>
          <button
            className={`flex-1 py-3 px-4 text-sm font-medium relative transition-all duration-300 ${
              activeFilter === 'waiting' 
                ? 'text-[#2563eb]' 
                : 'text-[#64748b] hover:text-[#475569]'
            }`}
            onClick={() => setActiveFilter('waiting')}
          >
            <span className="flex items-center justify-center">
              <motion.span 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`mr-2 px-2.5 py-1 rounded-full text-xs ${
                  activeFilter === 'waiting' 
                    ? 'bg-[#bfdbfe] text-[#1d4ed8]' 
                    : 'bg-[#f1f5f9] text-[#64748b]'
                }`}
              >
                {waitingChatsCount}
              </motion.span>
              Waiting
            </span>
            {activeFilter === 'waiting' && (
              <motion.div 
                layoutId="activeTab"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563eb]"
              />
            )}
          </button>
        </div>
      </motion.div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto px-4 py-2 scrollbar-thin scrollbar-thumb-[#cbd5e1] scrollbar-track-transparent">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit={{ 
                opacity: 0, 
                scale: 0.95,
                transition: { duration: 0.2 } 
              }}
              className="space-y-3 py-2"
            >
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={`shimmer-${i}`}
                  variants={shimmerVariants}
                  custom={i}
                  className="flex items-center space-x-4 p-3 rounded-xl bg-gradient-to-r from-white/50 via-[#f8fafc]/50 to-[#f1f5f9]/50 backdrop-blur-sm"
                >
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[#e2e8f0] via-[#f1f5f9] to-[#e2e8f0] animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gradient-to-r from-[#e2e8f0] via-[#f1f5f9] to-[#e2e8f0] rounded-full w-3/4 animate-pulse" />
                    <div className="h-3 bg-gradient-to-r from-[#e2e8f0] via-[#f1f5f9] to-[#e2e8f0] rounded-full w-1/2 animate-pulse" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : chats.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="space-y-2 py-2"
            >
              {chats.map((chat, index) => (
                <motion.div
                  key={chat.id}
                  variants={itemVariants}
                  custom={index}
                  whileHover={{ 
                    scale: 1.02, 
                    x: 8,
                    transition: { type: "spring", stiffness: 400, damping: 25 }
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleChatClick(chat.id)}
                  className={`flex items-center p-4 rounded-xl cursor-pointer transition-all duration-300
                    ${activeChat === chat.id 
                      ? 'bg-gradient-to-r from-[#dbeafe] via-[#bfdbfe] to-[#dbeafe] shadow-md border border-[#93c5fd] transform scale-[1.02]' 
                      : 'hover:bg-gradient-to-r hover:from-white hover:to-[#f8fafc] border border-transparent hover:border-[#e2e8f0] hover:shadow-lg'
                    }`}
                >
                  <div className="relative">
                    <motion.div 
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      className={`h-12 w-12 rounded-full flex items-center justify-center shadow-md ${
                        chat.avatarColor || 'bg-gradient-to-br from-[#dbeafe] to-[#93c5fd]'
                      }`}
                    >
                      <span className="text-lg font-medium text-[#1e40af]">{chat.name.charAt(0)}</span>
                    </motion.div>
                    {chat.isOnline && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 bg-[#22c55e] rounded-full border-2 border-white shadow-sm"
                      />
                    )}
                  </div>
                  
                  <div className="ml-4 flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-semibold text-[#334155] truncate">
                        {chat.name}
                      </h3>
                      <span className="text-xs text-[#64748b] font-medium">{chat.time}</span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-sm text-[#64748b] truncate">{chat.lastMessage}</p>
                      {chat.unread > 0 && (
                        <motion.span 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 17,
                            delay: 0.1
                          }}
                          className="ml-2 px-2 py-0.5 bg-[#bfdbfe] text-[#1d4ed8] rounded-full text-xs font-medium"
                        >
                          {chat.unread}
                        </motion.span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
              className="flex flex-col items-center justify-center h-full text-center p-6"
            >
              <motion.div 
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                  delay: 0.3
                }}
                className="w-20 h-20 bg-gradient-to-br from-[#dbeafe] to-[#93c5fd] rounded-full flex items-center justify-center mb-4 shadow-inner"
              >
                <AiOutlineMessage className="h-10 w-10 text-[#2563eb]" />
              </motion.div>
              <motion.h3 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-base font-medium text-[#334155] mb-2"
              >
                No messages yet
              </motion.h3>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-sm text-[#64748b]"
              >
                Start a conversation to see messages here
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 300, damping: 25 }}
        className="mt-auto border-t border-[#e2e8f0] bg-gradient-to-r from-white/80 via-[#f8fafc]/80 to-[#f1f5f9]/80 backdrop-blur-sm p-3"
      >
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/30 p-1.5 rounded-xl flex space-x-2 shadow-sm relative overflow-hidden">
            {/* Container hover effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-100/10 via-indigo-100/10 to-blue-100/10 opacity-0 hover:opacity-100 transition-opacity duration-500"
              animate={{
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative p-2 rounded-lg bg-white shadow-sm transition-all duration-300 group"
              title="Menu"
            >
              <motion.div
                className="absolute inset-0 bg-blue-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <svg 
                className="w-5 h-5 text-blue-600 transition-all duration-300 group-hover:scale-110 relative z-10" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <motion.div
                className="absolute -bottom-1 left-1/2 w-8 h-0.5 bg-blue-500/50 rounded-full -translate-x-1/2"
                initial={{ opacity: 0, width: "0%" }}
                animate={{ opacity: 1, width: "60%" }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative p-2 rounded-lg hover:bg-white/80 transition-all duration-300 group"
              title="Settings"
            >
              <motion.div
                className="absolute inset-0 bg-blue-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="relative z-10"
              >
                <svg 
                  className="w-5 h-5 text-gray-500 transition-all duration-300 group-hover:text-blue-600 group-hover:scale-110" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </motion.div>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ChatList;