import React, { useRef } from 'react';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { RiReplyLine, RiEditLine } from 'react-icons/ri';
import { BsPin, BsTrash, BsThreeDotsVertical } from 'react-icons/bs';

const MessageBubble = ({ 
  message, 
  activeChatData,
  onReply,
  onEdit,
  onPin,
  onDelete,
  onReaction,
  setShowMessageOptions,
  showMessageOptions,
  commonReactions 
}) => {
  const bubbleRef = useRef(null);
  const reactions = message.reactions || [];

  return (
    <div
      id={`msg-${message.id}`}
      className={`flex ${message.sender === 'me' ? "justify-end" : "justify-start"} mb-3 group relative message-bubble`}
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
                ? "bg-indigo-500/30 text-white/90 backdrop-blur-sm"
                : "bg-slate-100/80 text-gray-600 backdrop-blur-sm"
            }`}
          >
            <div className="font-medium mb-0.5 opacity-90">
              Replying to {
                activeChatData.messages.find((m) => m.id === message.replyTo)?.sender
              }
            </div>
            <div className="truncate opacity-75">
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
            message.sender === 'me' ? "text-white/80" : "text-slate-400"
          }`}
        >
          <span className="text-xs">{message.time}</span>
          {message.sender === 'me' && (
            <span className="transform transition-transform group-hover:scale-110">
              {message.status === "sent" ? (
                <AiOutlineCheckCircle className="text-xs" />
              ) : (
                <AiOutlineCheckCircle className="text-xs opacity-50" />
              )}
            </span>
          )}
          {message.edited && (
            <span className="text-xs italic opacity-75">edited</span>
          )}
        </div>

        {reactions.length > 0 && (
          <div
            className={`absolute flex -bottom-2 ${
              message.sender === 'me' ? "right-2" : "left-2"
            } bg-white/80 rounded-full px-2 py-0.5 shadow-sm border border-slate-100/50 space-x-0.5 group-hover:scale-105 transition-transform duration-200 backdrop-blur-sm`}
          >
            {reactions.slice(0, 3).map((reaction, idx) => (
              <span key={idx} className="text-xs transform hover:scale-125 transition-transform cursor-pointer">
                {reaction.reaction}
              </span>
            ))}
            {reactions.length > 3 && (
              <span className="text-xs text-slate-400">
                +{reactions.length - 3}
              </span>
            )}
          </div>
        )}

        <button
          className={`absolute -top-2 ${
            message.sender === 'me' ? "-left-2" : "-right-2"
          } opacity-0 group-hover:opacity-100 transition-all duration-200 h-7 w-7 bg-white/80 rounded-full shadow-sm flex items-center justify-center border border-slate-100/50 hover:bg-white hover:scale-110 active:scale-95 message-options-trigger group/options backdrop-blur-sm`}
          onClick={() =>
            setShowMessageOptions(
              showMessageOptions === message.id ? null : message.id
            )
          }
        >
          <div className="absolute inset-0 bg-gradient-to-r from-slate-50/50 to-white/50 rounded-full opacity-0 group-hover/options:opacity-100 transition-opacity duration-200" />
          <BsThreeDotsVertical className="text-slate-400 text-xs relative z-10" />
        </button>

        {showMessageOptions === message.id && (
          <div
            className={`absolute z-50 ${
              message.sender === 'me' ? "-left-[190px]" : "right-0"
            } -top-1 bg-white/80 rounded-lg shadow-sm border border-slate-200/50 py-1 min-w-[180px] transform scale-100 origin-top transition-transform duration-200 message-options backdrop-blur-sm`}
          >
            <div className="flex space-x-1 px-2 py-1.5 border-b border-slate-200/50">
              {commonReactions.map((reaction, idx) => (
                <button
                  key={idx}
                  className="hover:scale-125 transform transition-transform duration-150"
                  onClick={() => onReaction(message.id, reaction)}
                >
                  {reaction}
                </button>
              ))}
            </div>
            <div className="py-1">
              <button
                className="flex items-center w-full px-3 py-1.5 text-sm hover:bg-slate-50/80 transition-colors group/button"
                onClick={() => {
                  onReply(message);
                  setShowMessageOptions(null);
                }}
              >
                <RiReplyLine className="mr-2 text-slate-400 group-hover/button:text-indigo-400 transition-colors" /> Reply
              </button>
              {message.sender === 'me' && (
                <button
                  className="flex items-center w-full px-3 py-1.5 text-sm hover:bg-slate-50/80 transition-colors group/button"
                  onClick={() => {
                    onEdit(message);
                    setShowMessageOptions(null);
                  }}
                >
                  <RiEditLine className="mr-2 text-slate-400 group-hover/button:text-indigo-400 transition-colors" /> Edit
                </button>
              )}
              <button
                className="flex items-center w-full px-3 py-1.5 text-sm hover:bg-slate-50/80 transition-colors group/button"
                onClick={() => {
                  onPin(message.id);
                }}
              >
                <BsPin className="mr-2 text-slate-400 group-hover/button:text-indigo-400 transition-colors" /> Pin
              </button>
              <button
                className="flex items-center w-full px-3 py-1.5 text-sm text-red-400 hover:bg-red-50/80 transition-colors group/button"
                onClick={() => onDelete(message.id)}
              >
                <BsTrash className="mr-2 group-hover/button:text-red-500 transition-colors" /> Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble; 