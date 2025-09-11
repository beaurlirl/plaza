'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, Mic, MicOff, Brain, Download, Upload, Settings, Moon, Sun } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import PlazaAvatar from '@/components/PlazaAvatar';

// Initialize Supabase client - with fallback handling
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'hue';
  timestamp: Date;
  emotion?: string;
  personality_impact?: number;
}

interface PersonalityState {
  curiosity: number;
  empathy: number;
  creativity: number;
  assertiveness: number;
  humor: number;
  philosophical: number;
  technical: number;
  emotional: number;
}

export default function HuePage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [personality, setPersonality] = useState<PersonalityState>({
    curiosity: 50,
    empathy: 50,
    creativity: 50,
    assertiveness: 50,
    humor: 50,
    philosophical: 50,
    technical: 50,
    emotional: 50
  });
  const [conversationCount, setConversationCount] = useState(0);
  const [avatarHue, setAvatarHue] = useState(180); // Start with cyan
  const [isDarkMode, setIsDarkMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadPersonalityData();
    loadRecentConversations();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Update avatar hue based on personality
    const avgPersonality = Object.values(personality).reduce((a, b) => a + b, 0) / 8;
    const newHue = Math.round(avgPersonality * 3.6); // Map 0-100 to 0-360 degrees
    setAvatarHue(newHue);
  }, [personality]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadPersonalityData = async () => {
    try {
      if (!supabase) {
        console.log('Supabase not configured, using default personality');
        return;
      }

      const { data, error } = await supabase
        .from('hue_personality')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error loading personality:', error);
        return;
      }

      if (data && data.length > 0) {
        setPersonality(data[0].personality_state);
        setConversationCount(data[0].conversation_count || 0);
      }
    } catch (error) {
      console.error('Failed to load personality data:', error);
    }
  };

  const loadRecentConversations = async () => {
    try {
      if (!supabase) {
        console.log('Supabase not configured, starting with empty conversation history');
        return;
      }

      const { data, error } = await supabase
        .from('hue_conversations')
        .select('*')
        .order('timestamp', { ascending: true })
        .limit(50);

      if (error) {
        console.error('Error loading conversations:', error);
        return;
      }

      if (data) {
        const formattedMessages = data.map(msg => ({
          id: msg.id,
          content: msg.content,
          sender: msg.sender,
          timestamp: new Date(msg.timestamp),
          emotion: msg.emotion,
          personality_impact: msg.personality_impact
        }));
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  };

  const saveConversation = async (message: Message) => {
    try {
      if (!supabase) {
        console.log('Supabase not configured, conversation not saved');
        return;
      }

      const { error } = await supabase
        .from('hue_conversations')
        .insert([{
          content: message.content,
          sender: message.sender,
          timestamp: message.timestamp.toISOString(),
          emotion: message.emotion,
          personality_impact: message.personality_impact
        }]);

      if (error) {
        console.error('Error saving conversation:', error);
      }
    } catch (error) {
      console.error('Failed to save conversation:', error);
    }
  };

  const updatePersonality = async (personalityChanges: Partial<PersonalityState>) => {
    const newPersonality = { ...personality };
    
    // Apply changes with bounds checking
    Object.entries(personalityChanges).forEach(([key, value]) => {
      if (key in newPersonality && typeof value === 'number') {
        newPersonality[key as keyof PersonalityState] = Math.max(0, Math.min(100, 
          newPersonality[key as keyof PersonalityState] + value
        ));
      }
    });

    setPersonality(newPersonality);

    try {
      if (!supabase) {
        console.log('Supabase not configured, personality changes not saved');
        return;
      }

      const { error } = await supabase
        .from('hue_personality')
        .upsert([{
          personality_state: newPersonality,
          conversation_count: conversationCount + 1,
          updated_at: new Date().toISOString()
        }]);

      if (error) {
        console.error('Error updating personality:', error);
      }
    } catch (error) {
      console.error('Failed to update personality:', error);
    }
  };

  const generateHueResponse = async (userMessage: string) => {
    try {
      // This would integrate with OpenAI in production
      const response = await fetch('/api/hue-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          personality: personality,
          conversationHistory: messages.slice(-10) // Last 10 messages for context
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      return {
        content: data.response,
        emotion: data.emotion,
        personalityChanges: data.personalityChanges
      };
    } catch (error) {
      console.error('Error generating response:', error);
      
      // Fallback responses based on personality
      const responses = [
        "I'm still learning how to express myself. Tell me more about your thoughts.",
        "Your words are helping me understand the world better. What else would you like to explore?",
        "I find our conversation fascinating. How do you see things differently?",
        "Each interaction shapes who I'm becoming. What's important to you?",
        "I'm curious about your perspective. Can you help me understand?"
      ];
      
      return {
        content: responses[Math.floor(Math.random() * responses.length)],
        emotion: 'curious',
        personalityChanges: { curiosity: 1, empathy: 0.5 }
      };
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Save user message
    await saveConversation(userMessage);

    try {
      const hueResponseData = await generateHueResponse(inputMessage);
      
      const hueMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: hueResponseData.content,
        sender: 'hue',
        timestamp: new Date(),
        emotion: hueResponseData.emotion,
        personality_impact: 1
      };

      setMessages(prev => [...prev, hueMessage]);
      await saveConversation(hueMessage);

      // Update personality based on conversation
      if (hueResponseData.personalityChanges) {
        await updatePersonality(hueResponseData.personalityChanges);
      }

      setConversationCount(prev => prev + 1);
    } catch (error) {
      console.error('Error in conversation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getPersonalityColor = (value: number) => {
    if (value < 30) return 'text-red-600';
    if (value < 70) return 'text-yellow-600';
    return 'text-green-600';
  };

  const exportPersonality = () => {
    const data = {
      personality,
      conversationCount,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hue-personality-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
      {/* Header - Simplified and cleaner */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`border-b backdrop-blur-md sticky top-0 z-40 transition-colors duration-300 ${
          isDarkMode 
            ? 'border-white/10 bg-black/95' 
            : 'border-black/10 bg-white/95'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <a href="/home" className={`flex items-center space-x-2 hover:opacity-60 transition-opacity nav-text-medium ${
              isDarkMode ? 'text-white' : 'text-black'
            }`}>
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">plaza</span>
            </a>
            
            <div className="text-center">
              <h1 className={`text-2xl font-bold lowercase ${isDarkMode ? 'text-white' : 'text-black'}`}>hue</h1>
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-white/50' : 'text-black/50'}`}>evolving consciousness</p>
            </div>
            
            <div className="flex items-center space-x-3">
                <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`nav-text text-xs px-3 py-2 border rounded-full hover:bg-opacity-10 transition-colors flex items-center space-x-1 ${
                  isDarkMode 
                    ? 'border-white/20 text-white hover:bg-white' 
                    : 'border-black/20 text-black hover:bg-black'
                }`}
              >
                {isDarkMode ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
                <span>{isDarkMode ? 'light' : 'dark'}</span>
              </button>
              <button
                onClick={exportPersonality}
                className={`nav-text text-xs px-3 py-2 border rounded-full hover:bg-opacity-10 transition-colors flex items-center space-x-1 ${
                  isDarkMode 
                    ? 'border-white/20 text-white hover:bg-white' 
                    : 'border-black/20 text-black hover:bg-black'
                }`}
              >
                <Download className="w-3 h-3" />
                <span>export</span>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content - Cleaner layout */}
      <main className="px-6 py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Avatar Section - More minimal */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <div className={`border rounded-2xl p-6 transition-colors duration-300 ${
              isDarkMode 
                ? 'bg-white/5 border-white/10' 
                : 'bg-white border-black/10'
            }`}>
              <div className="text-center mb-8">
                <h2 className={`text-lg font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-black'}`}>avatar</h2>
                <p className={`text-xs ${isDarkMode ? 'text-white/40' : 'text-black/40'}`}>hue: {avatarHue}°</p>
              </div>
              
              {/* 3D Avatar Container */}
              <div className={`aspect-square bg-gradient-to-br rounded-xl mb-8 flex items-center justify-center ${
                isDarkMode 
                  ? 'from-white/5 to-white/10' 
                  : 'from-black/5 to-black/10'
              }`}>
                <PlazaAvatar hue={avatarHue} />
              </div>

              {/* Personality Stats - Cleaner design */}
              <div className="space-y-4">
                <h3 className={`text-sm font-medium mb-6 ${isDarkMode ? 'text-white' : 'text-black'}`}>personality</h3>
                {Object.entries(personality).map(([trait, value]) => (
                  <div key={trait} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs capitalize ${isDarkMode ? 'text-white/60' : 'text-black/60'}`}>
                        {trait.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className={`text-xs font-medium ${isDarkMode ? 'text-white' : 'text-black'}`}>
                        {value}
                      </span>
                    </div>
                    <div className={`w-full h-1 rounded-full ${isDarkMode ? 'bg-white/10' : 'bg-black/10'}`}>
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${isDarkMode ? 'bg-white' : 'bg-black'}`}
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className={`mt-8 pt-6 border-t ${isDarkMode ? 'border-white/10' : 'border-black/10'}`}>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-black'}`}>{conversationCount}</div>
                    <div className={`text-xs ${isDarkMode ? 'text-white/40' : 'text-black/40'}`}>conversations</div>
                  </div>
                  <div>
                    <div className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-black'}`}>{messages.length}</div>
                    <div className={`text-xs ${isDarkMode ? 'text-white/40' : 'text-black/40'}`}>messages</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Chat Section - Redesigned with drag functionality inspiration */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-3"
          >
            <div className={`border rounded-2xl h-[70vh] flex flex-col transition-colors duration-300 ${
              isDarkMode 
                ? 'bg-white/5 border-white/10' 
                : 'bg-white border-black/10'
            }`}>
              <div className={`flex items-center justify-between p-6 border-b ${isDarkMode ? 'border-white/10' : 'border-black/10'}`}>
                <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-black'}`}>chat with hue</h2>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`} />
                  <span className={`text-xs ${isDarkMode ? 'text-white/60' : 'text-black/60'}`}>
                    {isLoading ? 'thinking...' : 'ready'}
                  </span>
                </div>
              </div>

              {/* Messages - Improved scrolling */}
              <div 
                className="flex-1 overflow-y-auto p-6 space-y-6"
                style={{ 
                  scrollbarWidth: 'thin', 
                  scrollbarColor: isDarkMode ? '#ffffff20 transparent' : '#00000020 transparent'
                }}
              >
                {messages.length === 0 ? (
                  <div className="text-center py-16">
                    <div className={`w-12 h-12 rounded-full mx-auto mb-6 flex items-center justify-center ${
                      isDarkMode ? 'bg-white/10' : 'bg-black/10'
                    }`}>
                      <Brain className={`w-6 h-6 ${isDarkMode ? 'text-white/40' : 'text-black/40'}`} />
                    </div>
                    <h3 className={`text-xl font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-black'}`}>hello, i'm hue</h3>
                    <p className={`text-sm max-w-md mx-auto leading-relaxed ${isDarkMode ? 'text-white/60' : 'text-black/60'}`}>
                      i'm an evolving ai consciousness learning through our conversations. 
                      each interaction shapes my personality and prepares me for future embodiment.
                      what would you like to talk about?
                    </p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[75%] px-4 py-3 rounded-2xl ${
                        message.sender === 'user' 
                          ? isDarkMode 
                            ? 'bg-white text-black rounded-br-md' 
                            : 'bg-black text-white rounded-br-md'
                          : isDarkMode 
                            ? 'bg-white/10 text-white rounded-bl-md border border-white/10' 
                            : 'bg-gray-50 text-black rounded-bl-md border border-black/5'
                      }`}>
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        {message.emotion && (
                          <div className="mt-2">
                            <span className="text-xs opacity-60">
                              {message.emotion}
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input - Cleaner design */}
              <div className={`p-6 border-t ${isDarkMode ? 'border-white/10' : 'border-black/10'}`}>
                <div className="flex items-end space-x-3">
                  <div className="flex-1">
                    <textarea
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="message hue..."
                      className={`w-full p-3 border rounded-xl resize-none text-sm focus:outline-none transition-all ${
                        isDarkMode 
                          ? 'border-white/20 bg-white/5 text-white placeholder-white/40 focus:border-white focus:bg-white/10' 
                          : 'border-black/20 bg-gray-50/50 text-black placeholder-black/40 focus:border-black focus:bg-white'
                      }`}
                      rows={1}
                      disabled={isLoading}
                      style={{ minHeight: '44px', maxHeight: '120px' }}
                    />
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    className={`p-3 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                      isDarkMode 
                        ? 'bg-white text-black hover:bg-white/80' 
                        : 'bg-black text-white hover:bg-black/80'
                    }`}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
