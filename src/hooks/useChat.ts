'use client';

import { useState } from 'react';

export function useChat() {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);

  const sendMessage = async (message: string) => {
    setIsLoading(true);
    
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      content: message,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add Hue response
      const hueMessage = {
        id: (Date.now() + 1).toString(),
        content: "I'm still learning how to express myself. Tell me more about your thoughts.",
        sender: 'hue',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, hueMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages
  };
}
