import React from 'react';

const AIAvatar = ({ isTyping }) => {
  return (
    <div className="relative w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg animate-pulse">
      <span className="text-white font-semibold text-sm">AI</span>
      {isTyping && (
        <span className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-400 border-2 border-white rounded-full animate-ping" />
      )}
    </div>
  );
};

export default AIAvatar;