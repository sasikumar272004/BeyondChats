import React, { useState, useEffect } from 'react';
import ChatList from './components/ChatList';
import ChatWindow from './components/ChatWindow';
import AIAssistant from './components/AIAssistant';

const App = () => {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  // Initialize with mockChats on first render
  useEffect(() => {
    import('./components/ChatList').then(module => {
      if (module.mockChats) {
        setChats(module.mockChats);
        if (module.mockChats.length > 0) {
          setActiveChat(module.mockChats[0].id);
        }
      }
    });
  }, []);

  // Track screen width
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle chat selection for mobile view
  useEffect(() => {
    if (screenWidth < 768 && activeChat) {
      setShowSidebar(false);
    }
  }, [activeChat, screenWidth]);

  // Mark messages as read when chat is opened
  useEffect(() => {
    if (activeChat) {
      setChats(prevChats => 
        prevChats.map(chat => {
          if (chat.id === activeChat) {
            return {
              ...chat,
              unread: 0,
              messages: chat.messages.map(msg => 
                !msg.isMe ? { ...msg, status: 'read' } : msg
              )
            };
          }
          return chat;
        })
      );
    }
  }, [activeChat]);

  // Handle AI Panel toggle
  const handleAIPanelToggle = (show) => {
    setShowAIPanel(show);
  };

  // Get component classes based on screen size and state
  const getComponentClasses = (component) => {
    const isMobile = screenWidth < 768;
    const isTablet = screenWidth < 1000 && screenWidth >= 768;

    switch (component) {
      case 'chatList':
        if (isMobile) {
          return `fixed inset-0 z-30 bg-white transition-transform duration-300 ${
            showSidebar ? 'translate-x-0' : '-translate-x-full'
          }`;
        }
        return 'flex-none w-[320px] border-r border-gray-200';
      case 'mainContent':
        if (isMobile) {
          return 'flex-1 min-w-0';
        }
        if (isTablet) {
          return 'flex-1 min-w-0';
        }
        return `flex-1 min-w-0 ${showAIPanel ? 'max-w-[calc(100%-640px)]' : 'max-w-[calc(100%-320px)]'}`;
      case 'aiPanel':
        return 'flex-none w-[320px] border-l border-gray-200';
      default:
        return '';
    }
  };

  const isMobile = screenWidth < 768;
  const isTablet = screenWidth < 1000 && screenWidth >= 768;

  return (
    <div className="h-screen w-full bg-white overflow-hidden">
      <div className="h-full w-full flex">
        {/* Chat List */}
        <div className={getComponentClasses('chatList')}>
          <ChatList 
            chats={chats} 
            setChats={setChats} 
            activeChat={activeChat} 
            setActiveChat={setActiveChat}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            setShowSidebar={setShowSidebar}
            showSidebar={showSidebar}
          />
        </div>

        {isMobile ? (
          // Mobile: Show either ChatList or Chat Window/AI Panel
          <div className={getComponentClasses('mainContent')}>
            {!showAIPanel ? (
              <ChatWindow 
                chats={chats} 
                setChats={setChats} 
                activeChat={activeChat}
                setActiveChat={setActiveChat}
                setShowSidebar={setShowSidebar}
                setShowAIPanel={handleAIPanelToggle}
                showAIPanel={showAIPanel}
                showSidebar={showSidebar}
                isMobile={true}
              />
            ) : (
              <AIAssistant 
                showAIPanel={showAIPanel}
                setShowAIPanel={handleAIPanelToggle}
              />
            )}
          </div>
        ) : isTablet ? (
          // Tablet: Toggle between Chat Window and AI Panel
          <div className={getComponentClasses('mainContent')}>
            {!showAIPanel ? (
              <ChatWindow 
                chats={chats} 
                setChats={setChats} 
                activeChat={activeChat}
                setActiveChat={setActiveChat}
                setShowSidebar={setShowSidebar}
                setShowAIPanel={handleAIPanelToggle}
                showAIPanel={showAIPanel}
                showSidebar={showSidebar}
                isMobile={false}
              />
            ) : (
              <AIAssistant 
                showAIPanel={showAIPanel}
                setShowAIPanel={handleAIPanelToggle}
              />
            )}
          </div>
        ) : (
          // Desktop: Show both Chat Window and AI Panel side by side
          <>
            <div className={getComponentClasses('mainContent')}>
              <ChatWindow 
                chats={chats} 
                setChats={setChats} 
                activeChat={activeChat}
                setActiveChat={setActiveChat}
                setShowSidebar={setShowSidebar}
                setShowAIPanel={handleAIPanelToggle}
                showAIPanel={showAIPanel}
                showSidebar={showSidebar}
                isMobile={false}
              />
            </div>

            {showAIPanel && (
              <div className={getComponentClasses('aiPanel')}>
                <AIAssistant 
                  showAIPanel={showAIPanel}
                  setShowAIPanel={handleAIPanelToggle}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default App;