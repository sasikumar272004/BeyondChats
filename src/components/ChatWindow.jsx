import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { v4 as uuidv4 } from "uuid";
import EmojiPicker from "emoji-picker-react";
import { FiMoreVertical, FiPaperclip, FiChevronLeft, FiHome } from "react-icons/fi";
import { BsThreeDotsVertical, BsPin, BsTrash, BsEmojiSmile } from "react-icons/bs";
import { BiBlock } from "react-icons/bi";
import { AiOutlineCheckCircle, AiOutlineMessage } from "react-icons/ai";
import { RiBookmarkLine, RiReplyLine, RiEditLine, RiCloseLine } from "react-icons/ri";
import { FaBolt } from "react-icons/fa";

const ChatWindow = ({
  chats,
  setChats,
  activeChat,
  setActiveChat,
  setShowSidebar,
  setShowAIPanel,
  setAISelectedText,
  showAIPanel,
  showSidebar
}) => {
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [replyMessage, setReplyMessage] = useState(null);
  const [editMessage, setEditMessage] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMessageOptions, setShowMessageOptions] = useState(null);
  const [showChatOptions, setShowChatOptions] = useState(false);
  const [selectionCoords, setSelectionCoords] = useState(null);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const chatContainerRef = useRef(null);
  const textSelectionTooltipRef = useRef(null);
  const chatOptionsRef = useRef(null);

  const activeChatData = chats.find((c) => c.id === activeChat);
  
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (screenWidth < 768) {
      if (!activeChat) {
        setShowSidebar(true);
      } else {
        setShowSidebar(false);
      }
    } else {
      setShowSidebar(true);
    }
  }, [activeChat, screenWidth, setShowSidebar]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target) &&
        !event.target.closest('.emoji-trigger')
      ) {
        setShowEmojiPicker(false);
      }

      if (
        chatOptionsRef.current &&
        !chatOptionsRef.current.contains(event.target) &&
        !event.target.closest('.chat-options-trigger')
      ) {
        setShowChatOptions(false);
      }

      if (
        showMessageOptions &&
        !event.target.closest('.message-options') &&
        !event.target.closest('.message-options-trigger')
      ) {
        setShowMessageOptions(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMessageOptions]);

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (selection.toString().trim() && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        
        setSelectionCoords({
          text: selection.toString(),
          x: rect.left + rect.width / 2,
          y: rect.top - 40
        });
      } else {
        setSelectionCoords(null);
      }
    };

    const handleClick = (e) => {
      if (textSelectionTooltipRef.current && 
          !textSelectionTooltipRef.current.contains(e.target)) {
        setSelectionCoords(null);
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      gsap.to(chatContainerRef.current, {
        duration: 0.5,
        scrollTo: { y: "max", autoKill: false },
        ease: "back.out(1.2)",
      });
    }
  }, [activeChatData?.messages]);

  const messageBackgroundAnimation = () => {
    gsap.to(".message-highlight", {
      backgroundPosition: "200% center",
      duration: 15,
      ease: "none",
      repeat: -1
    });
  };

  useEffect(() => {
    messageBackgroundAnimation();
  }, []);

  const handleSendMessage = () => {
    if (!newMessage.trim() && !replyMessage && !editMessage) return;

    const newMsg = {
      id: uuidv4(),
      sender: "me",
      content: newMessage,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "sent",
      replyTo: replyMessage?.id,
      edited: !!editMessage,
      reactions: [],
    };

    animateNewMessage(newMsg.id);

    const updatedChats = chats.map((chat) => {
      if (chat.id === activeChat) {
        return {
          ...chat,
          messages: [...chat.messages, newMsg],
          lastMessage: newMessage,
          time: "Just now",
          unread: 0,
        };
      }
      return chat;
    });

    setChats(updatedChats);
    setNewMessage("");
    setReplyMessage(null);
    setEditMessage(null);
    setShowEmojiPicker(false);

    setTimeout(() => {
      setIsTyping(true);

      setTimeout(() => {
        setIsTyping(false);

        const replyMsg = {
          id: uuidv4(),
          sender: activeChatData.name,
          content: getRandomReply(),
          time: "Just now",
          status: "read",
          reactions: [],
        };

        animateNewMessage(replyMsg.id);

        setChats((prevChats) =>
          prevChats.map((chat) => {
            if (chat.id === activeChat) {
              return {
                ...chat,
                messages: [...chat.messages, replyMsg],
                lastMessage: replyMsg.content,
                time: "Just now",
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
      "I was just thinking the same thing!",
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const commonReactions = ["❤️", "😂", "😮", "😢", "👍", "👎"];

  const addEmoji = (emojiData) => {
    setNewMessage((prev) => prev + emojiData.emoji);
    inputRef.current.focus();
  };

  const handleReaction = (messageId, reaction) => {
    const updatedChats = chats.map((chat) => {
      if (chat.id === activeChat) {
        const updatedMessages = chat.messages.map((msg) => {
          if (msg.id === messageId) {
            const existingReactionIndex = (msg.reactions || []).findIndex(
              (r) => r.reaction === reaction
            );
            let updatedReactions = [...(msg.reactions || [])];

            if (existingReactionIndex >= 0) {
              updatedReactions.splice(existingReactionIndex, 1);
            } else {
              updatedReactions.push({ reaction, by: "You" });
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
    gsap.to(`#msg-${messageId}`, {
      scale: 1.05,
      duration: 0.2,
      yoyo: true,
      repeat: 1,
      onComplete: () => {
        const updatedChats = chats.map((chat) => {
          if (chat.id === activeChat) {
            return { ...chat, pinnedMessage: messageId };
          }
          return chat;
        });

        setChats(updatedChats);
        setShowMessageOptions(null);
      }
    });
  };

  const deleteMessage = (messageId) => {
    const updatedChats = chats.map((chat) => {
      if (chat.id === activeChat) {
        return {
          ...chat,
          messages: chat.messages.filter((msg) => msg.id !== messageId),
          pinnedMessage:
            chat.pinnedMessage === messageId ? null : chat.pinnedMessage,
        };
      }
      return chat;
    });

    setChats(updatedChats);
    setShowMessageOptions(null);
  };

  const clearChat = () => {
    const updatedChats = chats.map((chat) => {
      if (chat.id === activeChat) {
        return { 
          ...chat, 
          messages: [], 
          pinnedMessage: null,
          lastMessage: "",
          time: "Just now" 
        };
      }
      return chat;
    });

    setChats(updatedChats);
    setShowChatOptions(false);
  };

  const saveChat = () => {
    alert("Chat saved successfully!");
    setShowChatOptions(false);
  };

  const blockChat = () => {
    const updatedChats = chats.map((chat) => {
      if (chat.id === activeChat) {
        return { ...chat, isBlocked: true };
      }
      return chat;
    });

    setChats(updatedChats);
    setShowChatOptions(false);
  };

  const handleSendToAI = () => {
    if (selectionCoords?.text) {
      console.log('Sending text to AI:', selectionCoords.text);
      setAISelectedText(selectionCoords.text);
      setShowAIPanel(true);
      setSelectionCoords(null);
      window.getSelection().removeAllRanges();
    }
  };

  const handleAIButtonClick = () => {
    console.log('AI button clicked');
    setShowAIPanel((prev) => {
      console.log('Setting AI panel to:', !prev);
      return !prev;
    });
  };

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

  const MessageBubble = ({ message }) => {
    const bubbleRef = useRef(null);
    const reactions = message.reactions || [];

    return (
      <div
        id={`msg-${message.id}`}
        className={`flex ${message.sender === 'me' ? "justify-end" : "justify-start"} mb-3 group relative`}
        ref={bubbleRef}
      >
        <div
          className={`relative max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl ${
            message.sender === 'me'
              ? "bg-indigo-500 text-white rounded-tr-none"
              : "bg-white text-gray-800 rounded-tl-none"
          } shadow-sm hover:shadow-md transition-all duration-200`}
        >
          {message.replyTo && (
            <div
              className={`text-xs px-2 py-1.5 rounded-lg mb-2 overflow-hidden ${
                message.sender === 'me'
                  ? "bg-indigo-600/50 text-white/90"
                  : "bg-slate-100 text-gray-700"
              }`}
            >
              <div className="font-medium mb-0.5">
                Replying to {
                  activeChatData.messages.find((m) => m.id === message.replyTo)?.sender
                }
              </div>
              <div className="truncate">
                {
                  activeChatData.messages.find((m) => m.id === message.replyTo)
                    ?.content
                }
              </div>
            </div>
          )}

          <div className="relative whitespace-pre-wrap break-words">
            {message.content}
          </div>

          <div
            className={`flex items-center justify-end mt-1 space-x-1 ${
              message.sender === 'me' ? "text-white/90" : "text-slate-500"
            }`}
          >
            <span className="text-xs">{message.time}</span>
            {message.sender === 'me' && (
              <span className="transform transition-transform group-hover:scale-110">
                {message.status === "sent" ? (
                  <AiOutlineCheckCircle className="text-xs" />
                ) : (
                  <AiOutlineCheckCircle className="text-xs text-indigo-200" />
                )}
              </span>
            )}
            {message.edited && (
              <span className="text-xs italic">edited</span>
            )}
          </div>

          {reactions.length > 0 && (
            <div
              className={`absolute flex -bottom-2 ${
                message.sender === 'me' ? "right-2" : "left-2"
              } bg-white rounded-full px-2 py-0.5 shadow-lg border border-slate-100 space-x-0.5 group-hover:scale-105 transition-transform duration-200`}
            >
              {reactions.slice(0, 3).map((reaction, idx) => (
                <span key={idx} className="text-xs transform hover:scale-125 transition-transform cursor-pointer">
                  {reaction.reaction}
                </span>
              ))}
              {reactions.length > 3 && (
                <span className="text-xs text-slate-500">
                  +{reactions.length - 3}
                </span>
              )}
            </div>
          )}

          <button
            className={`absolute -top-2 ${
              message.sender === 'me' ? "-left-2" : "-right-2"
            } opacity-0 group-hover:opacity-100 transition-all duration-200 h-7 w-7 bg-white rounded-full shadow-lg flex items-center justify-center border border-slate-100 hover:bg-slate-50 hover:scale-110 active:scale-95 message-options-trigger group/options`}
            onClick={() =>
              setShowMessageOptions(
                showMessageOptions === message.id ? null : message.id
              )
            }
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-full opacity-0 group-hover/options:opacity-100 transition-opacity duration-200" />
            <BsThreeDotsVertical className="text-slate-500 text-xs relative z-10" />
          </button>

          {showMessageOptions === message.id && (
            <div
              className={`absolute z-50 ${
                message.sender === 'me' ? "-left-[190px]" : "right-0"
              } -top-1 bg-slate-50/90 rounded-lg shadow-xl border border-slate-200/50 py-1 min-w-[180px] transform scale-100 origin-top transition-transform duration-200 message-options backdrop-blur-sm`}
            >
              <div className="flex space-x-1 px-2 py-1.5 border-b border-slate-200">
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
              <div className="py-1">
                <button
                  className="flex items-center w-full px-3 py-1.5 text-sm hover:bg-slate-50 transition-colors group/button"
                  onClick={() => {
                    setReplyMessage(message);
                    setShowMessageOptions(null);
                  }}
                >
                  <RiReplyLine className="mr-2 text-slate-500 group-hover/button:text-indigo-500 transition-colors" /> Reply
                </button>
                {message.sender === 'me' && (
                  <button
                    className="flex items-center w-full px-3 py-1.5 text-sm hover:bg-slate-50 transition-colors group/button"
                    onClick={() => {
                      setEditMessage(message);
                      setNewMessage(message.content);
                      setShowMessageOptions(null);
                      inputRef.current.focus();
                    }}
                  >
                    <RiEditLine className="mr-2 text-slate-500 group-hover/button:text-indigo-500 transition-colors" /> Edit
                  </button>
                )}
                <button
                  className="flex items-center w-full px-3 py-1.5 text-sm hover:bg-slate-50 transition-colors group/button"
                  onClick={() => {
                    pinMessage(message.id);
                  }}
                >
                  <BsPin className="mr-2 text-slate-500 group-hover/button:text-indigo-500 transition-colors" /> Pin
                </button>
                <button
                  className="flex items-center w-full px-3 py-1.5 text-sm text-red-500 hover:bg-red-50 transition-colors group/button"
                  onClick={() => deleteMessage(message.id)}
                >
                  <BsTrash className="mr-2 group-hover/button:text-red-600 transition-colors" /> Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const TypingIndicator = () => {
    return (
      <div className="flex justify-start mb-3">
        <div className="bg-white px-4 py-2 rounded-2xl rounded-tl-none shadow-sm">
          <div className="flex space-x-1.5">
            <div
              className="h-2 w-2 bg-pink-400 rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            />
            <div
              className="h-2 w-2 bg-pink-400 rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            />
            <div
              className="h-2 w-2 bg-pink-400 rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            />
          </div>
        </div>
      </div>
    );
  };

  const animateNewMessage = (messageId) => {
    gsap.from(`#msg-${messageId}`, {
      y: 20,
      opacity: 0,
      duration: 0.4,
      ease: "back.out(1.2)",
      onComplete: () => {
        gsap.to(`#msg-${messageId}`, {
          scale: 1.02,
          duration: 0.15,
          yoyo: true,
          repeat: 1
        });
      }
    });
  };

  return (
    <div className="h-full w-full flex flex-col">
      {activeChat ? (
        <div className="flex-1 flex flex-col h-full relative bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-slate-50 via-blue-50/40 to-pink-50/30">
          <div 
            className="absolute inset-0 bg-repeat opacity-40 pointer-events-none"
            style={{
              backgroundImage: 'url("https://i.pinimg.com/736x/69/d3/21/69d321443e21f4b57f81532f540a306d.jpg")',
              backgroundSize: 'contain',
              backgroundRepeat:'repeat'
            }}
          />

          <div className="relative z-10 flex-1 flex flex-col h-full">
            <div className="p-4 backdrop-blur-sm bg-white/40 border-b border-slate-200/50 flex items-center h-[11.4%] sticky top-0">
              <div className="absolute inset-0 bg-gradient-to-r from-slate-50/40 via-transparent to-slate-50/40 animate-pulse" style={{ animationDuration: '3s' }} />

              {screenWidth < 768 && (
                <button
                  className="mr-3 text-gray-500 hover:text-blue-500 transition-all duration-300 transform hover:scale-110 hover:rotate-6 relative group"
                  onClick={() => setShowSidebar(true)}
                >
                  <div className="absolute inset-0 bg-blue-100/50 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
                  <FiHome className="h-5 w-5 relative z-10" />
                </button>
              )}

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
                  className={`p-2 rounded-full transition-all duration-300 transform hover:scale-110 relative group
                    ${showAIPanel 
                      ? 'bg-blue-100 text-blue-500 shadow-inner shadow-blue-200/50' 
                      : 'text-gray-500 hover:text-blue-500 hover:bg-blue-50'}`}
                  onClick={handleAIButtonClick}
                  aria-label="Toggle AI Panel"
                >
                  <div className={`absolute inset-0 bg-blue-100/50 rounded-full transition-all duration-300
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
                    className="chat-options-trigger p-2 text-gray-500 hover:text-blue-500 rounded-full hover:bg-blue-50 transition-all duration-300 transform hover:scale-110"
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
                        onClick={saveChat}
                      >
                        <RiBookmarkLine className="mr-2 text-blue-500" /> Save Chat
                      </button>
                      <button
                        className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                        onClick={clearChat}
                      >
                        <BsTrash className="mr-2 text-blue-500" /> Clear Chat
                      </button>
                      <button
                        className="flex items-center w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                        onClick={blockChat}
                      >
                        <BiBlock className="mr-2" /> Block Contact
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 relative scroll-smooth"
            >
              <div className="relative z-20 space-y-4 max-w-4xl mx-auto">
                {activeChatData?.pinnedMessage && (
                  <div className="pinned-message backdrop-blur-sm bg-gradient-to-r from-white/90 via-slate-50/80 to-white/90 border-l-4 border-indigo-400 rounded-r-xl p-3 mb-6 flex items-start transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-indigo-100/50">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/20 to-transparent rounded-r-xl animate-pulse" style={{ animationDuration: '2s' }} />
                    <BsPin className="text-indigo-400 mt-0.5 mr-2 flex-shrink-0 animate-bounce" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-indigo-500 mb-1">
                        Pinned Message
                      </div>
                      <div className="text-sm text-gray-700 truncate">
                        {activeChatData.messages.find(
                          (m) => m.id === activeChatData.pinnedMessage
                        )?.content}
                      </div>
                    </div>
                    <button
                      className="text-indigo-400 hover:text-indigo-600 ml-2 transition-colors transform hover:scale-110"
                      onClick={() => pinMessage(null)}
                    >
                      <RiCloseLine className="h-4 w-4" />
                    </button>
                  </div>
                )}

                <div className="space-y-6">
                  {activeChatData?.messages.map((message, index) => (
                    <div
                      key={message.id}
                      className="transform transition-all duration-300"
                      style={{
                        opacity: 0,
                        animation: `fadeSlideIn 0.3s ease-out ${index * 0.1}s forwards`
                      }}
                    >
                      <MessageBubble message={message} />
                    </div>
                  ))}
                </div>

                {isTyping && <TypingIndicator />}
              </div>
            </div>

            {replyMessage && (
              <div className="bg-gradient-to-r from-slate-50/90 via-white/90 to-slate-50/90 border-t border-slate-200 px-4 py-2 flex items-center justify-between backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/10 via-transparent to-indigo-50/10 animate-pulse" style={{ animationDuration: '2s' }} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-indigo-600">Replying to {replyMessage.sender}</div>
                  <div className="text-sm text-gray-700 truncate">{replyMessage.content}</div>
                </div>
                <button 
                  onClick={() => setReplyMessage(null)}
                  className="text-gray-400 hover:text-gray-600 ml-2"
                >
                  <RiCloseLine className="h-4 w-4" />
                </button>
              </div>
            )}

            <div className="p-4 mx-4 mb-4 rounded-2xl bg-gradient-to-r from-white/90 via-[#f8fafc]/90 to-[#f1f5f9]/90 border border-[#e2e8f0] shadow-lg backdrop-blur-sm">
              <div className="relative">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[#64748b]">
                      Message
                    </span>
                    <span className="text-xs text-[#64748b] bg-[#f1f5f9] px-2 py-1 rounded-full">
                      Press Enter to send
                    </span>
                  </div>

                  <div className="relative">
                    <textarea
                      ref={inputRef}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type something amazing..."
                      className="w-full p-3 rounded-xl bg-gradient-to-r from-[#f8fafc]/50 via-white/30 to-[#f1f5f9]/50 border border-[#e2e8f0] focus:ring-2 focus:ring-[#bfdbfe]/30 focus:border-[#93c5fd] outline-none resize-none text-[#334155] placeholder-[#94a3b8] transition-all duration-300"
                      rows={1}
                      style={{ minHeight: '45px', maxHeight: '120px' }}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-2">
                      <button 
                        className="emoji-trigger p-2 text-slate-500 hover:text-indigo-500 hover:bg-indigo-50 rounded-full transition-all duration-300 transform hover:scale-110 hover:rotate-12 relative group"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      >
                        <div className="absolute inset-0 bg-indigo-100/50 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
                        <BsEmojiSmile className="h-5 w-5 relative z-10" />
                      </button>
                      <button 
                        className="p-2 text-slate-500 hover:text-indigo-500 hover:bg-indigo-50 rounded-full transition-all duration-300 transform hover:scale-110 hover:rotate-12 relative group"
                      >
                        <div className="absolute inset-0 bg-indigo-100/50 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
                        <FiPaperclip className="h-5 w-5 relative z-10" />
                      </button>
                    </div>

                    <button 
                      className={`group flex items-center px-5 py-2.5 rounded-full font-medium transition-all duration-500 transform relative overflow-hidden ${
                        !newMessage.trim() ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-lg active:scale-95 shadow-md'
                      }`}
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                    >
                      <div 
                        className="absolute inset-0 bg-gradient-to-r from-[#2563eb] via-[#4f46e5] to-[#2563eb]"
                        style={{
                          backgroundSize: '200% 100%',
                          animation: 'gradientFlow 2s linear infinite'
                        }}
                      />
                      <div 
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-[#1d4ed8] via-[#4338ca] to-[#1d4ed8]"
                        style={{
                          backgroundSize: '200% 100%',
                          animation: 'gradientFlow 2s linear infinite'
                        }}
                      />
                      <div 
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        style={{
                          backgroundSize: '200% 100%',
                          animation: 'shimmerEffect 2s infinite'
                        }}
                      />
                      
                      <span className="relative z-10 flex items-center text-white font-semibold group-hover:text-white/95 transition-colors duration-300">
                        Send
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="ml-2 h-4 w-4 transform transition-all duration-500 group-hover:translate-x-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14m-4-4l4 4-4 4" />
                        </svg>
                      </span>

                      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#2563eb]/50 via-[#4f46e5]/50 to-[#2563eb]/50 blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {showEmojiPicker && (
            <div
              ref={emojiPickerRef}
              className="absolute bottom-20 right-4 z-50 transform scale-95 transition-transform duration-200 ease-out"
            >
              <div className="absolute inset-0 bg-slate-50/80 rounded-lg backdrop-blur-sm -z-10" />
              <EmojiPicker
                onEmojiClick={addEmoji}
                width={300}
                height={350}
                searchDisabled={false}
                skinTonesDisabled={true}
                previewConfig={{ showPreview: false }}
                theme="light"
              />
            </div>
          )}

          {selectionCoords && (
            <div 
              ref={textSelectionTooltipRef}
              className="fixed bg-white rounded-lg shadow-xl border border-gray-100 p-2 flex items-center z-50 transform -translate-x-1/2"
              style={{
                left: `${selectionCoords.x}px`,
                top: `${selectionCoords.y}px`
              }}
            >
              <button 
                onClick={handleSendToAI}
                className="flex items-center text-sm text-blue-500 hover:text-blue-600 transition-colors"
              >
                <FaBolt className="mr-1" /> Send to AI
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] p-8">
          <div className="relative w-40 h-40 mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-200 via-blue-200 to-purple-200 rounded-full animate-pulse" style={{ animationDuration: '2s' }} />
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-blue-200 to-purple-100 rounded-full flex items-center justify-center">
              <AiOutlineMessage className="h-20 w-20 text-indigo-500" />
            </div>
          </div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-700 via-indigo-800 to-slate-900 bg-clip-text text-transparent mb-4 text-center">
            Welcome to BeyondChats
          </h3>
          <p className="text-slate-600 text-center max-w-md mb-8">
            Select a conversation to start messaging or create a new one to connect with someone.
          </p>
          <button className="relative px-6 py-3 bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 text-white rounded-full font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-indigo-500/50 group">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-400/0 via-white/20 to-indigo-400/0 blur-sm group-hover:animate-shine" />
            <span className="relative z-10">Start a New Chat</span>
          </button>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shine {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(100%);
          }
        }
        
        .group-hover\\:animate-shine {
          animation: shine 1s ease-in-out infinite;
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }

        @keyframes rotate-360 {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .rotate-360 {
          animation: rotate-360 0.5s ease-out;
        }

        @keyframes gradientMove {
          0% {
            background-position: 0% 0%;
          }
          100% {
            background-position: 200% 0%;
          }
        }
        
        textarea::placeholder {
          opacity: 0.5;
          transition: opacity 0.3s ease;
        }
        
        textarea:focus::placeholder {
          opacity: 0.3;
        }

        @keyframes gradientFlow {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes shimmerEffect {
          0% {
            transform: translateX(-100%);
            opacity: 0;
          }
          50% {
            opacity: 0.9;
          }
          100% {
            transform: translateX(100%);
            opacity: 0;
          }
        }

        textarea::placeholder {
          opacity: 0.7;
          transition: opacity 0.3s ease;
          color: #94a3b8;
        }

        textarea:focus::placeholder {
          opacity: 0.5;
        }

        /* Hide scrollbar for Chrome, Safari and Opera */
        textarea::-webkit-scrollbar {
          display: none;
        }

        /* Hide scrollbar for IE, Edge and Firefox */
        textarea {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </div>
  );
};

export default ChatWindow;