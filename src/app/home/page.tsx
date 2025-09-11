'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Store, Palette, Calendar, ArrowRight, Bot } from 'lucide-react';

interface Pillar {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  color: string;
}


export default function HomePage() {
  const [selectedPillar, setSelectedPillar] = useState<string | null>(null);
  const router = useRouter();

  const pillars: Pillar[] = [
    {
      id: 'market',
      title: 'MARKET',
      subtitle: 'EXPERT-CURATED COMMERCE',
      description: 'Premium fashion and fine art verified by specialists with investment insights and trend analysis',
      href: '/browse',
      icon: <Store className="w-8 h-8" />,
      color: 'from-black/20 to-black/10'
    },
    {
      id: 'generators',
      title: 'GENERATORS',
      subtitle: 'CREATIVE TOOLS',
      description: 'Design custom content and personalized items with AI-powered creative tools and generators',
      href: '/tools',
      icon: <Palette className="w-8 h-8" />,
      color: 'from-black/15 to-black/5'
    },
    {
      id: 'calendar',
      title: 'CALENDAR',
      subtitle: 'LIVE CITY CULTURE',
      description: 'Real-time venue performances and cultural events across major cities with expert curation',
      href: '/calendar',
      icon: <Calendar className="w-8 h-8" />,
      color: 'from-black/10 to-black/5'
    },
    {
      id: 'hue',
      title: 'HUE',
      subtitle: 'EVOLVING CONSCIOUSNESS',
      description: 'Meet our AI avatar that learns and evolves through conversations, developing personality and preparing for embodiment',
      href: '/hue',
      icon: <Bot className="w-8 h-8" />,
      color: 'from-purple/20 to-blue/10'
    }
  ];

  const handlePillarClick = (pillar: Pillar) => {
    router.push(pillar.href);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="px-4 sm:px-6 py-6 sm:py-8 border-b-4 border-black"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold lowercase text-black nav-text-bold">plaza</h1>
          <div className="text-xs sm:text-sm nav-text-medium uppercase tracking-wider text-black/60">
            DIGITAL HUB
          </div>
        </div>
      </motion.header>

      {/* Main Navigation System */}
      <main className="px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto">
          
          {/* Title Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="heading-lg text-black mb-4 sm:mb-6">
              CHOOSE YOUR EXPERIENCE
            </h2>
            <p className="body-text text-base sm:text-lg lg:text-xl text-black/70 max-w-3xl mx-auto">
              Four interconnected pillars of culture, commerce, creativity, and consciousness.
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>Each experience is curated by experts and enhanced by evolving intelligence.
            </p>
          </motion.div>

          {/* Stacked Bubble Navigation */}
          <div className="space-y-6 sm:space-y-8 max-w-5xl mx-auto">
            {pillars.map((pillar, index) => (
              <motion.div
                key={pillar.id}
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                onMouseEnter={() => setSelectedPillar(pillar.id)}
                onMouseLeave={() => setSelectedPillar(null)}
                onClick={() => handlePillarClick(pillar)}
                className={`pillar-bubble group cursor-pointer relative overflow-hidden ${
                  selectedPillar === pillar.id ? 'pillar-active' : ''
                }`}
              >
                {/* Background Gradient */}
                <div 
                  className={`absolute inset-0 bg-gradient-to-br ${pillar.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />
                
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-center">
                  
                  {/* Left: Icon and Title */}
                  <div className="text-center lg:text-left">
                    <div className={`inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 mb-4 sm:mb-6 transition-colors duration-300 ${
                      selectedPillar === pillar.id ? 'text-white' : 'text-black'
                    }`}>
                      {pillar.icon}
                    </div>
                    <h3 className={`heading-lg mb-2 transition-colors duration-300 ${
                      selectedPillar === pillar.id ? 'text-white' : 'text-black'
                    }`}>
                      {pillar.title}
                    </h3>
                    <p className={`nav-text-medium text-sm uppercase tracking-wider transition-colors duration-300 ${
                      selectedPillar === pillar.id ? 'text-white/80' : 'text-black/60'
                    }`}>
                      {pillar.subtitle}
                    </p>
                  </div>

                  {/* Right: Description and Action */}
                  <div className="text-center lg:text-right">
                    <p className={`body-text text-sm sm:text-base mb-6 sm:mb-8 transition-colors duration-300 ${
                      selectedPillar === pillar.id ? 'text-white/90' : 'text-black/70'
                    }`}>
                      {pillar.description}
                    </p>
                    
                    <div className={`inline-flex items-center space-x-2 nav-text-medium uppercase tracking-wider transition-colors duration-300 ${
                      selectedPillar === pillar.id ? 'text-white' : 'text-black'
                    }`}>
                      <span>EXPLORE</span>
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </main>
    </div>
  );
}
