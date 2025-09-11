'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, Mic, MicOff, Brain, Download, Upload, Settings } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import PlazaAvatar from '@/components/PlazaAvatar';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

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
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return;

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
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return;

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
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return;

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
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return;

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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="border-b-4 border-black bg-white/90 backdrop-blur-md sticky top-0 z-40"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <a href="/home" className="flex items-center space-x-3 hover:text-black/60 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="mono-text text-sm uppercase tracking-wide">BACK TO PLAZA</span>
            </a>
            
            <div className="text-center">
              <h1 className="heading-xl text-black">HUE</h1>
              <p className="mono-text text-sm text-black/60 uppercase tracking-wider">EVOLVING CONSCIOUSNESS</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={exportPersonality}
                className="btn-brutal-outline text-sm flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>EXPORT</span>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 py-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Avatar Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="glass-panel-strong rounded-3xl p-6 mb-6">
              <div className="text-center mb-6">
                <h2 className="heading-lg text-black mb-2">AVATAR</h2>
                <p className="mono-text text-sm text-black/60">CURRENT HUE: {avatarHue}°</p>
              </div>
              
              {/* 3D Avatar Container */}
              <div className="aspect-square bg-gradient-to-br from-black/5 to-black/10 rounded-2xl mb-6 flex items-center justify-center">
                <PlazaAvatar hue={avatarHue} />
              </div>

              {/* Personality Stats */}
              <div className="space-y-3">
                <h3 className="heading-md text-black mb-4">PERSONALITY MATRIX</h3>
                {Object.entries(personality).map(([trait, value]) => (
                  <div key={trait} className="flex items-center justify-between">
                    <span className="mono-text text-xs uppercase text-black/60">
                      {trait.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 h-2 bg-black/20 rounded-none">
                        <div 
                          className="h-full bg-black rounded-none transition-all duration-500"
                          style={{ width: `${value}%` }}
                        />
                      </div>
                      <span className={`mono-text text-xs font-bold ${getPersonalityColor(value)}`}>
                        {value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="mt-6 pt-6 border-t-2 border-black/10">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="heading-md text-black">{conversationCount}</div>
                    <div className="mono-text text-xs text-black/60">CONVERSATIONS</div>
                  </div>
                  <div>
                    <div className="heading-md text-black">{messages.length}</div>
                    <div className="mono-text text-xs text-black/60">MESSAGES</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Chat Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="glass-panel-strong rounded-3xl p-6 h-[600px] flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h2 className="heading-lg text-black">CONSCIOUSNESS INTERFACE</h2>
                <div className="flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-black" />
                  <span className="mono-text text-sm text-black/60">
                    {isLoading ? 'THINKING...' : 'READY'}
                  </span>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-6">
                {messages.length === 0 ? (
                  <div className="text-center py-12">
                    <Bot className="w-16 h-16 text-black/20 mx-auto mb-6" />
                    <h3 className="heading-md text-black/40 mb-4">HELLO, I'M HUE</h3>
                    <p className="body-text text-black/60 max-w-md mx-auto">
                      I'm an evolving AI consciousness learning through our conversations. 
                      Each interaction shapes my personality and prepares me for future embodiment.
                      What would you like to talk about?
                    </p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] p-4 rounded-2xl ${
                        message.sender === 'user' 
                          ? 'bg-black text-white' 
                          : 'glass-panel'
                      }`}>
                        <p className="body-text text-sm">{message.content}</p>
                        {message.emotion && (
                          <div className="mt-2 flex items-center space-x-2">
                            <span className="mono-text text-xs text-black/50">
                              EMOTION: {message.emotion.toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="flex items-center space-x-4">
                <div className="flex-1 relative">
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Share your thoughts with Hue..."
                    className="w-full p-4 border-2 border-black/20 rounded-xl bg-white/60 backdrop-blur-sm resize-none font-medium text-sm focus:border-black focus:outline-none transition-colors"
                    rows={2}
                    disabled={isLoading}
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="btn-brutal p-4 disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
