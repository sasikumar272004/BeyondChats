// TypingIndicator.js
import React from 'react';

const TypingIndicator = () => {
  return (
    <div className="flex space-x-1 mt-2">
      {[...Array(3)].map((_, i) => (
        <span
          key={i}
          className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
};

export default TypingIndicator;
