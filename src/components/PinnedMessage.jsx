import React from 'react';
import { BsPin, BsX } from 'react-icons/bs';

const PinnedMessage = ({
  pinnedMessage,
  setPinnedMessage,
  scrollToMessage
}) => {
  if (!pinnedMessage) return null;

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-[#f8fafc]/80 via-[#f1f5f9]/80 to-[#f8fafc]/80 backdrop-blur-sm" />
      <div className="relative px-4 py-2 flex items-center justify-between border-b border-[#e2e8f0]">
        <div className="flex items-center space-x-2">
          <BsPin className="text-[#64748b] h-4 w-4 transform -rotate-45" />
          <span className="text-sm font-medium text-[#64748b]">Pinned Message</span>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => scrollToMessage(pinnedMessage.id)}
            className="text-xs text-[#3b82f6] hover:text-[#2563eb] transition-colors"
          >
            Jump to message
          </button>
          <button
            onClick={() => setPinnedMessage(null)}
            className="p-1 text-[#64748b] hover:text-[#475569] hover:bg-[#f1f5f9] rounded-full transition-all duration-300 transform hover:scale-110"
          >
            <BsX className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="px-4 py-2 text-sm text-[#475569] line-clamp-1">
        {pinnedMessage.content}
      </div>
    </div>
  );
};

export default PinnedMessage; 