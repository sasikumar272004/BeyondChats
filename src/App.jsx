// App.js
import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import ChatList from './components/ChatList';
import ChatWindow from './components/ChatWindow';
import AIAssistant from './components/AIAssistant';

const App = () => {
  // Initialize with empty array - ChatList will populate from mockChats
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);
  const [showAIPanel, setShowAIPanel] = useState(true);

  // Initialize with mockChats on first render
  useEffect(() => {
    // Dynamically import mockChats from ChatList
    import('./components/ChatList').then(module => {
      if (module.mockChats) {
        setChats(module.mockChats);
        // Set first chat as active if available
        if (module.mockChats.length > 0) {
          setActiveChat(module.mockChats[0].id);
        }
      }
    });
  }, []);

  // Responsive layout
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setShowSidebar(false);
        setShowAIPanel(false);
      } else {
        setShowSidebar(true);
        setShowAIPanel(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Chat List Sidebar */}
      {showSidebar && (
        <ChatList 
          chats={chats} 
          setChats={setChats} 
          activeChat={activeChat} 
          setActiveChat={setActiveChat}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setShowSidebar={setShowSidebar}
        />
      )}

      {/* Main Chat Window */}
      <ChatWindow 
        chats={chats} 
        setChats={setChats} 
        activeChat={activeChat}
        setShowSidebar={setShowSidebar}
        setShowAIPanel={setShowAIPanel}
      />

      {/* AI Assistant Panel */}
      {showAIPanel && (
        <AIAssistant 
          showAIPanel={showAIPanel}
          setShowAIPanel={setShowAIPanel}
        />
      )}
    </div>
  );
};

export default App;