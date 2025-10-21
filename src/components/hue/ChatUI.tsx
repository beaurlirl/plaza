'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { useChat } from '@/hooks/useChat';

interface ChatUIProps {
  isDarkMode: boolean;
}

export function ChatUI({ isDarkMode }: ChatUIProps) {
  const [inputMessage, setInputMessage] = useState('');
  const { messages, isLoading, sendMessage, clearMessages } = useChat();

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;
    
    await sendMessage(inputMessage);
    setInputMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-full flex flex-col p-4 chat-container">
      {/* Chat Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="nav-text-medium text-lg">Chat with Hue</h3>
        <button
          onClick={clearMessages}
          className="body-text text-sm text-gray-500 hover:text-gray-700"
        >
          Clear
        </button>
      </div>

      {/* Chat Messages - Scrollable */}
      <div className="flex-1 overflow-y-auto mb-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block px-4 py-2 bg-black text-white rounded-full text-sm mb-4">
                hello
              </div>
              <p className="body-text text-gray-500 text-sm">
                I'm still learning how to express myself. Tell me<br />
                more about your thoughts.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
                    message.sender === 'user'
                      ? isDarkMode
                        ? 'bg-white text-black'
                        : 'bg-black text-white'
                      : isDarkMode
                      ? 'bg-gray-700 text-white'
                      : 'bg-gray-100 text-black'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chat Input - Fixed at Bottom */}
      <div className="border-t border-gray-200/30 pt-4">
        <div className="flex gap-3">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Start a conversation with Hue..."
            disabled={isLoading}
            className={`flex-1 px-4 py-3 rounded-lg border border-gray-200 outline-none text-sm ${
              isDarkMode
                ? 'bg-gray-800 text-white placeholder-gray-400 border-gray-700'
                : 'bg-white text-black placeholder-gray-500'
            }`}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className={`px-4 py-3 rounded-lg transition-all duration-200 disabled:opacity-50 ${
              isDarkMode
                ? 'bg-white text-black hover:bg-gray-100'
                : 'bg-gray-600 text-white hover:bg-gray-700'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
