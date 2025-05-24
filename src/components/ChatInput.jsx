import React from 'react';
import { BsEmojiSmile } from 'react-icons/bs';
import { FiPaperclip } from 'react-icons/fi';
import { IoSendSharp } from 'react-icons/io5';
import EmojiPicker from 'emoji-picker-react';

const ChatInput = ({
  newMessage,
  setNewMessage,
  handleSendMessage,
  handleKeyDown,
  inputRef,
  showEmojiPicker,
  setShowEmojiPicker,
  emojiPickerRef,
  addEmoji
}) => {
  return (
    <div className="relative p-4 mx-4 mb-4">
      {/* Glowing background effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-indigo-50 to-violet-50 rounded-2xl opacity-70" />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-100/20 via-indigo-100/20 to-violet-100/20 rounded-2xl animate-pulse" style={{ animationDuration: '3s' }} />
      
      {/* Main container */}
      <div className="relative bg-white/80 backdrop-blur-lg rounded-2xl p-4 shadow-lg border border-indigo-100/50">
        <div className="flex flex-col gap-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium bg-gradient-to-r from-blue-500 to-indigo-500 text-transparent bg-clip-text animate-gradient-x">
              Message
            </span>
            <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-1 rounded-full group">
              <span className="text-xs text-indigo-400 group-hover:text-indigo-500 transition-colors">
                Press
              </span>
              <kbd className="px-2 py-0.5 text-xs font-semibold text-indigo-500 bg-white rounded-md shadow-sm border border-indigo-100 group-hover:scale-105 transition-transform">
                Enter
              </kbd>
              <span className="text-xs text-indigo-400 group-hover:text-indigo-500 transition-colors">
                to send
              </span>
            </div>
          </div>

          {/* Textarea container */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-200/20 via-indigo-200/20 to-violet-200/20 rounded-xl blur-md transition-opacity opacity-0 group-hover:opacity-100" />
            <textarea
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type something amazing..."
              className="w-full p-3 rounded-xl bg-white/50 border border-indigo-100/50 focus:ring-2 focus:ring-indigo-200/50 focus:border-indigo-300/50 outline-none resize-none text-indigo-900 placeholder-indigo-300 transition-all duration-300"
              rows={1}
              style={{ minHeight: '45px', maxHeight: '120px' }}
            />
            
            {/* Animated focus border */}
            <div className="absolute inset-0 rounded-xl border-2 border-transparent pointer-events-none transition-all duration-500 group-focus-within:border-indigo-300/30 group-focus-within:shadow-lg" />
          </div>

          {/* Bottom toolbar */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-2">
              <button 
                className="emoji-trigger p-2.5 text-indigo-400 hover:text-indigo-500 rounded-xl transition-all duration-300 transform hover:scale-110 hover:rotate-12 relative group bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <div className="absolute inset-0 bg-white/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <BsEmojiSmile className="h-5 w-5 relative z-10 transform group-hover:scale-110 transition-transform" />
              </button>
              <button 
                className="p-2.5 text-indigo-400 hover:text-indigo-500 rounded-xl transition-all duration-300 transform hover:scale-110 hover:rotate-12 relative group bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100"
              >
                <div className="absolute inset-0 bg-white/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <FiPaperclip className="h-5 w-5 relative z-10 transform group-hover:scale-110 transition-transform" />
              </button>
            </div>

            <button 
              className={`group flex items-center px-5 py-2.5 rounded-xl font-medium transition-all duration-500 transform relative overflow-hidden ${
                !newMessage.trim() 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'cursor-pointer hover:scale-105 hover:shadow-xl active:scale-95'
              }`}
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
            >
              {/* Button background layers */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 transition-all duration-300" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 opacity-0 group-hover:opacity-100 transition-all duration-300" />
              
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
              
              {/* Button content */}
              <span className="relative z-10 flex items-center text-white font-semibold group-hover:text-white/95 transition-colors duration-300">
                Send
                <IoSendSharp className="ml-2 h-4 w-4 transform transition-all duration-500 group-hover:translate-x-1 group-hover:rotate-12" />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Emoji picker */}
      {showEmojiPicker && (
        <div
          ref={emojiPickerRef}
          className="absolute bottom-full right-0 mb-2 z-50 transform scale-95 origin-bottom-right transition-all duration-200 ease-out animate-fade-in"
        >
          <div className="absolute inset-0 bg-white/80 rounded-2xl backdrop-blur-xl shadow-xl border border-indigo-100/50 -z-10" />
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
    </div>
  );
};

export default ChatInput; 