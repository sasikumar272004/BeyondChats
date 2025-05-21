// ChatWindow.js
import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { v4 as uuidv4 } from 'uuid';
import EmojiPicker from 'emoji-picker-react';
import { 
  FiMoreVertical, 
  FiPaperclip, 
  FiMic, 
  FiSend, 
  FiThumbsUp,
  FiChevronLeft
} from 'react-icons/fi';
import { 
  BsCheck2All, 
  BsThreeDotsVertical, 
  BsPin, 
  BsTrash, 
  BsBlockquoteRight,
  BsEmojiSmile,
  BsArrowUpShort
} from 'react-icons/bs';
import { 
  IoMdSend,
  IoMdAttach,
  IoMdMic
} from 'react-icons/io';
import { 
  BiBlock,
  BiPhoneCall
} from 'react-icons/bi';
import { 
  AiOutlineCheckCircle,
  AiOutlineMessage
} from 'react-icons/ai';
import { 
  RiChatSmile2Line,
  RiBookmarkLine,
  RiReplyLine,
  RiEditLine,
  RiCloseLine
} from 'react-icons/ri';
import { FaBolt } from 'react-icons/fa';

const ChatWindow = ({ 
  chats, 
  setChats, 
  activeChat, 
  setShowSidebar,
  setShowAIPanel 
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [replyMessage, setReplyMessage] = useState(null);
  const [editMessage, setEditMessage] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMessageOptions, setShowMessageOptions] = useState(null);
  const [showChatOptions, setShowChatOptions] = useState(false);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const chatContainerRef = useRef(null);
  
  const activeChatData = chats.find(c => c.id === activeChat);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Smooth scroll to bottom with animation
  useEffect(() => {
    if (messagesEndRef.current) {
      gsap.to(chatContainerRef.current, {
        duration: 0.3,
        scrollTo: { y: 'max', autoKill: false },
        ease: "power1.out"
      });
    }
  }, [activeChatData?.messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() && !replyMessage && !editMessage) return;

    const newMsg = {
      id: uuidv4(),
      sender: 'You',
      content: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
      status: 'sent',
      replyTo: replyMessage?.id,
      edited: !!editMessage,
      reactions: []
    };

    // Animation for sending message
    gsap.from(`#msg-${newMsg.id}`, {
      y: 20,
      opacity: 0,
      duration: 0.3,
      ease: "back.out(1.2)",
      onComplete: () => {
        gsap.to(`#msg-${newMsg.id}`, {
          scale: 1.03,
          duration: 0.15,
          yoyo: true,
          repeat: 1
        });
      }
    });

    const updatedChats = chats.map(chat => {
      if (chat.id === activeChat) {
        return {
          ...chat,
          messages: [...chat.messages, newMsg],
          lastMessage: newMessage,
          time: 'Just now',
          unread: 0
        };
      }
      return chat;
    });

    setChats(updatedChats);
    setNewMessage('');
    setReplyMessage(null);
    setEditMessage(null);
    setShowEmojiPicker(false);
    
    // Simulate reply with typing indicators
    setTimeout(() => {
      setIsTyping(true);
      
      setTimeout(() => {
        setIsTyping(false);
        
        const replyMsg = {
          id: uuidv4(),
          sender: activeChatData.name,
          content: getRandomReply(),
          time: 'Just now',
          isMe: false,
          status: 'read',
          reactions: []
        };

        gsap.from(`#msg-${replyMsg.id}`, {
          x: -20,
          opacity: 0,
          duration: 0.4,
          ease: "elastic.out(1, 0.5)",
          onComplete: () => {
            gsap.to(`#msg-${replyMsg.id}`, {
              scale: 1.02,
              duration: 0.15,
              yoyo: true,
              repeat: 1
            });
          }
        });

        setChats(prevChats => 
          prevChats.map(chat => {
            if (chat.id === activeChat) {
              return {
                ...chat,
                messages: [...chat.messages, replyMsg],
                lastMessage: replyMsg.content,
                time: 'Just now'
              };
            }
            return chat;
          })
        );
      }, 1500 + Math.random() * 1000);
    }, 600 + Math.random() * 500);
  };

  const getRandomReply = () => {
    const replies = [
      "Thanks for your message!",
      "I'll get back to you soon.",
      "That's interesting, tell me more.",
      "I appreciate your message.",
      "Let me think about that.",
      "Great point!",
      "I'll check and let you know.",
      "Can we discuss this later?",
      "👍",
      "Got it!",
      "Interesting perspective!",
      "Let me get back to you on that.",
      "What do you think about...",
      "I was just thinking the same thing!"
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const addEmoji = (emojiData) => {
    setNewMessage(prev => prev + emojiData.emoji);
    inputRef.current.focus();
  };

  const handleReaction = (messageId, reaction) => {
    const updatedChats = chats.map(chat => {
      if (chat.id === activeChat) {
        const updatedMessages = chat.messages.map(msg => {
          if (msg.id === messageId) {
            const existingReactionIndex = (msg.reactions || []).findIndex(r => r.reaction === reaction);
            let updatedReactions = [...(msg.reactions || [])];
            
            if (existingReactionIndex >= 0) {
              updatedReactions.splice(existingReactionIndex, 1);
            } else {
              updatedReactions.push({ reaction, by: 'You' });
            }
            
            return { ...msg, reactions: updatedReactions };
          }
          return msg;
        });
        
        return { ...chat, messages: updatedMessages };
      }
      return chat;
    });
    
    setChats(updatedChats);
    setShowMessageOptions(null);
  };

  const pinMessage = (messageId) => {
    const updatedChats = chats.map(chat => {
      if (chat.id === activeChat) {
        return { ...chat, pinnedMessage: messageId };
      }
      return chat;
    });
    
    setChats(updatedChats);
    setShowMessageOptions(null);
  };

  const deleteMessage = (messageId) => {
    const updatedChats = chats.map(chat => {
      if (chat.id === activeChat) {
        return { 
          ...chat, 
          messages: chat.messages.filter(msg => msg.id !== messageId),
          pinnedMessage: chat.pinnedMessage === messageId ? null : chat.pinnedMessage
        };
      }
      return chat;
    });
    
    setChats(updatedChats);
    setShowMessageOptions(null);
  };

  const clearChat = () => {
    const updatedChats = chats.map(chat => {
      if (chat.id === activeChat) {
        return { ...chat, messages: [], pinnedMessage: null };
      }
      return chat;
    });
    
    setChats(updatedChats);
    setShowChatOptions(false);
  };

  const blockChat = () => {
    const updatedChats = chats.map(chat => {
      if (chat.id === activeChat) {
        return { ...chat, isBlocked: true };
      }
      return chat;
    });
    
    setChats(updatedChats);
    setShowChatOptions(false);
  };

  // Enhanced avatar component with online status
  const Avatar = ({ name, isOnline }) => {
    const initials = name ? name.split(' ').map(n => n[0]).join('') : '?';
    return (
      <div className="relative">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-200 to-amber-300 flex items-center justify-center text-amber-800 font-medium text-lg shadow-sm">
          {initials}
        </div>
        {isOnline && (
          <div className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 rounded-full border-2 border-white"></div>
        )}
      </div>
    );
  };

  // Enhanced message bubble with reactions and options
  const MessageBubble = ({ message, isMe }) => {
    const bubbleRef = useRef(null);
    
    const commonReactions = ['❤️', '😂', '😮', '😢', '👍', '👎'];
    const reactions = message.reactions || [];
    
    return (
      <div 
        id={`msg-${message.id}`} 
        className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-3 group relative`}
        ref={bubbleRef}
      >
        <div 
          className={`relative max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl ${isMe ? 
            'bg-gradient-to-r from-amber-100 to-amber-50 text-amber-900 rounded-tr-none' : 
            'bg-white text-gray-800 rounded-tl-none'} shadow-sm transition-all duration-200 hover:shadow-md`}
        >
          {message.replyTo && (
            <div className={`text-xs px-2 py-1 rounded-lg mb-1 ${isMe ? 
              'bg-amber-200/70 text-amber-800' : 
              'bg-gray-100 text-gray-700'}`}>
              Replying to: {activeChatData.messages.find(m => m.id === message.replyTo)?.content}
            </div>
          )}
          
          <div className="whitespace-pre-wrap break-words">{message.content}</div>
          
          <div className={`flex items-center justify-end mt-1 space-x-1 ${isMe ? 'text-amber-600' : 'text-gray-500'}`}>
            <span className="text-xs">{message.time}</span>
            {isMe && (
              <span>
                {message.status === 'sent' ? (
                  <AiOutlineCheckCircle className="text-xs" />
                ) : (
                  <AiOutlineCheckCircle className="text-xs text-blue-500" />
                )}
              </span>
            )}
            {message.edited && <span className="text-xs italic">edited</span>}
          </div>
          
          {/* Message reactions */}
          {reactions.length > 0 && (
            <div className={`absolute flex -bottom-2 ${isMe ? 'right-2' : 'left-2'} bg-white rounded-full px-1 shadow-xs border border-gray-100`}>
              {reactions.slice(0, 3).map((reaction, idx) => (
                <span key={idx} className="text-xs">{reaction.reaction}</span>
              ))}
              {reactions.length > 3 && (
                <span className="text-xs">+{reactions.length - 3}</span>
              )}
            </div>
          )}
          
          {/* Message options button */}
          <button 
            className={`absolute -top-2 ${isMe ? '-left-2' : '-right-2'} opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-6 w-6 bg-white rounded-full shadow flex items-center justify-center border border-gray-200 hover:bg-gray-50`}
            onClick={() => setShowMessageOptions(showMessageOptions === message.id ? null : message.id)}
          >
            <BsThreeDotsVertical className="text-gray-500 text-xs" />
          </button>
          
          {/* Message options dropdown */}
          {showMessageOptions === message.id && (
            <div className={`absolute z-10 ${isMe ? 'right-0' : 'left-0'} -top-10 bg-white rounded-lg shadow-lg border border-gray-200 py-1`}>
              <div className="flex space-x-1 px-2 py-1">
                {commonReactions.map((reaction, idx) => (
                  <button 
                    key={idx} 
                    className="hover:scale-125 transform transition-transform duration-150"
                    onClick={() => handleReaction(message.id, reaction)}
                  >
                    {reaction}
                  </button>
                ))}
              </div>
              <div className="border-t border-gray-200">
                <button 
                  className="flex items-center w-full px-3 py-1.5 text-sm hover:bg-gray-50 transition-colors"
                  onClick={() => {
                    setReplyMessage(message);
                    setShowMessageOptions(null);
                  }}
                >
                  <RiReplyLine className="mr-2 text-gray-500" /> Reply
                </button>
                <button 
                  className="flex items-center w-full px-3 py-1.5 text-sm hover:bg-gray-50 transition-colors"
                  onClick={() => {
                    setEditMessage(message);
                    setNewMessage(message.content);
                    setShowMessageOptions(null);
                    inputRef.current.focus();
                  }}
                >
                  <RiEditLine className="mr-2 text-gray-500" /> Edit
                </button>
                <button 
                  className="flex items-center w-full px-3 py-1.5 text-sm hover:bg-gray-50 transition-colors"
                  onClick={() => {
                    pinMessage(message.id);
                  }}
                >
                  <BsPin className="mr-2 text-gray-500" /> Pin
                </button>
                <button 
                  className="flex items-center w-full px-3 py-1.5 text-sm text-red-500 hover:bg-gray-50 transition-colors"
                  onClick={() => {
                    deleteMessage(message.id);
                  }}
                >
                  <BsTrash className="mr-2" /> Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Enhanced typing indicator
  const TypingIndicator = () => {
    return (
      <div className="flex justify-start mb-3">
        <div className="bg-white px-4 py-2 rounded-2xl rounded-tl-none shadow-sm">
          <div className="flex space-x-1.5">
            <div className="h-2 w-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="h-2 w-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="h-2 w-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col h-full relative bg-gray-50">
      {activeChat ? (
        <>
          {/* Chat header with advanced options */}
          <div className="p-3 border-b border-gray-200 bg-white flex items-center shadow-sm z-10 sticky top-0">
            <button 
              className="md:hidden mr-2 text-gray-500 hover:text-gray-700 transition-colors"
              onClick={() => setShowSidebar(true)}
            >
              <FiChevronLeft className="h-5 w-5" />
            </button>

            <Avatar name={activeChatData?.name} isOnline={activeChatData?.isOnline} />
            
            <div className="ml-3 flex-1 min-w-0">
              <h3 className="font-medium text-gray-800 truncate">{activeChatData?.name}</h3>
              <p className="text-xs text-gray-500 truncate">
                {isTyping ? 'Typing...' : activeChatData?.isOnline ? 'Online' : 'Last seen recently'}
              </p>
            </div>

            <div className="flex space-x-3">
              <button className="text-gray-500 hover:text-amber-600 p-1 rounded-full transition-colors">
                <BiPhoneCall className="h-5 w-5" />
              </button>
              <button 
                className="text-gray-500 hover:text-amber-600 p-1 rounded-full transition-colors"
                onClick={() => setShowAIPanel(prev => !prev)}
              >
                <FaBolt className="h-5 w-5" />
              </button>
              <div className="relative">
                <button 
                  className="text-gray-500 hover:text-amber-600 p-1 rounded-full transition-colors"
                  onClick={() => setShowChatOptions(!showChatOptions)}
                >
                  <FiMoreVertical className="h-5 w-5" />
                </button>
                {showChatOptions && (
                  <div className="absolute right-0 top-10 bg-white rounded-lg shadow-lg border border-gray-200 py-1 w-48 z-20">
                    <button className="flex items-center w-full px-3 py-2 text-sm hover:bg-gray-50 transition-colors">
                      <RiBookmarkLine className="mr-2 text-gray-500" /> Save Chat
                    </button>
                    <button 
                      className="flex items-center w-full px-3 py-2 text-sm hover:bg-gray-50 transition-colors"
                      onClick={clearChat}
                    >
                      <BsTrash className="mr-2 text-gray-500" /> Clear Chat
                    </button>
                    <button 
                      className="flex items-center w-full px-3 py-2 text-sm text-red-500 hover:bg-gray-50 transition-colors"
                      onClick={blockChat}
                    >
                      <BiBlock className="mr-2" /> Block Contact
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Messages area with subtle noise background */}
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 relative"
            style={{ 
              backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)',
              backgroundSize: '20px 20px',
              backgroundColor: '#f9fafb'
            }}
          >
            {/* Pinned message indicator */}
            {activeChatData?.pinnedMessage && (
              <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-lg p-2 mb-4 flex items-start">
                <BsPin className="text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-xs font-medium text-amber-800 mb-1">Pinned Message</div>
                  <div className="text-sm text-amber-900">
                    {activeChatData.messages.find(m => m.id === activeChatData.pinnedMessage)?.content}
                  </div>
                </div>
                <button 
                  className="text-amber-500 hover:text-amber-700 ml-2 transition-colors"
                  onClick={() => pinMessage(null)}
                >
                  <RiCloseLine className="h-4 w-4" />
                </button>
              </div>
            )}

            {activeChatData?.messages.map((message) => (
              <MessageBubble 
                key={message.id} 
                message={message} 
                isMe={message.isMe} 
              />
            ))}

            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Reply/Edit preview */}
          {(replyMessage || editMessage) && (
            <div className="bg-amber-50 border-t border-amber-100 p-2">
              <div className="flex justify-between items-center bg-white rounded-lg p-2 shadow-xs">
                <div className="flex-1">
                  <div className="text-xs font-medium text-amber-600">
                    {editMessage ? 'Editing' : 'Replying to'} {replyMessage?.sender || editMessage?.sender}
                  </div>
                  <div className="text-sm truncate text-amber-900">
                    {replyMessage?.content || editMessage?.content}
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setReplyMessage(null);
                    setEditMessage(null);
                  }}
                  className="text-amber-400 hover:text-amber-600 transition-colors"
                >
                  <RiCloseLine className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {/* Emoji picker */}
          {showEmojiPicker && (
            <div 
              ref={emojiPickerRef}
              className="absolute bottom-16 left-4 z-20"
            >
              <EmojiPicker 
                onEmojiClick={addEmoji}
                width={300}
                height={350}
                searchDisabled={false}
                skinTonesDisabled={true}
              />
            </div>
          )}

          {/* Message input area */}
          <div className="p-3 border-t border-gray-200 bg-white sticky bottom-0">
            <div className="flex items-center">
              {/* Left side buttons */}
              <div className="flex items-center space-x-1 mr-2">
                <button 
                  className="text-gray-500 hover:text-amber-600 p-2 rounded-full transition-colors"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                  <BsEmojiSmile className="h-5 w-5" />
                </button>
                <button className="text-gray-500 hover:text-amber-600 p-2 rounded-full transition-colors">
                  <IoMdAttach className="h-5 w-5" />
                </button>
              </div>

              {/* Message input */}
              <div className="flex-1">
                <div className="relative">
                  <textarea
                    ref={inputRef}
                    className="w-full py-2.5 px-4 bg-gray-50 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-300 text-gray-700 placeholder-gray-400 resize-none transition-all duration-200 border border-gray-200 hover:border-gray-300"
                    placeholder="Type a message"
                    rows="1"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    style={{ minHeight: '44px', maxHeight: '120px' }}
                  />
                </div>
              </div>

              {/* Right side buttons */}
              <div className="flex items-center ml-2 space-x-1">
                {newMessage.trim() === '' ? (
                  <>
                    <button 
                      className="text-gray-500 hover:text-amber-600 p-2 rounded-full transition-colors"
                      onClick={() => setShowAIPanel(prev => !prev)}
                    >
                      <FaBolt className="h-5 w-5" />
                    </button>
                    <button className="text-gray-500 hover:text-amber-600 p-2 rounded-full transition-colors">
                      <IoMdMic className="h-5 w-5" />
                    </button>
                  </>
                ) : (
                  <button
                    className="p-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-white hover:from-amber-500 hover:to-amber-600 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
                    onClick={handleSendMessage}
                  >
                    <BsArrowUpShort className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center bg-white p-4">
          <div className="w-40 h-40 bg-gradient-to-br from-amber-50 to-amber-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <AiOutlineMessage className="h-20 w-20 text-amber-300" />
          </div>
          <h3 className="text-2xl font-medium text-amber-800 mb-3">Enhanced Chat</h3>
          <p className="text-gray-500 text-center max-w-md mb-6">
            Select a chat to start messaging or create a new conversation with advanced features.
          </p>
          <button className="px-6 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white rounded-full font-medium transition-all duration-200 shadow-md hover:shadow-lg active:scale-95">
            Start New Chat
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;