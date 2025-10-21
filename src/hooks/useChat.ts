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
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock responses based on message content
      let mockResponse = "I'm HUE, your AI assistant. I'm currently in development mode, but I'm here to help you explore the Plaza marketplace!";
      
      if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
        mockResponse = "Hello! I'm HUE, your digital companion. I'm excited to help you discover amazing fashion and art pieces on Plaza!";
      } else if (message.toLowerCase().includes('fashion') || message.toLowerCase().includes('clothing')) {
        mockResponse = "Fashion is such a beautiful form of self-expression! I can help you find unique pieces that match your style. What kind of aesthetic are you drawn to?";
      } else if (message.toLowerCase().includes('art') || message.toLowerCase().includes('painting')) {
        mockResponse = "Art speaks to the soul! Plaza has an incredible collection of contemporary and classic pieces. Are you looking for something specific or just browsing?";
      } else if (message.toLowerCase().includes('price') || message.toLowerCase().includes('cost')) {
        mockResponse = "I understand you're curious about pricing! Each piece on Plaza is carefully curated and priced based on its artistic and market value. Would you like me to help you find pieces in a specific price range?";
      }
      
      // Add Hue response
      const hueMessage = {
        id: (Date.now() + 1).toString(),
        content: mockResponse,
        sender: 'hue',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, hueMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        content: "I'm having trouble connecting right now. Please try again in a moment.",
        sender: 'hue',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
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
