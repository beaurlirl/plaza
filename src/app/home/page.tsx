'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Store, Palette, Calendar, ArrowRight, TrendingUp, Users, Clock } from 'lucide-react';

interface Pillar {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  stats: { label: string; value: string }[];
  color: string;
}

const MarketPreview = () => (
  <div className="space-y-3">
    <div className="flex items-center justify-between">
      <div className="w-12 h-12 bg-black/10 rounded-lg"></div>
      <div className="text-right">
        <div className="text-sm font-bold">$2,400</div>
        <div className="text-xs text-black/60">VERIFIED</div>
      </div>
    </div>
    <div className="space-y-1">
      <div className="h-2 bg-black/20 rounded w-3/4"></div>
      <div className="h-2 bg-black/10 rounded w-1/2"></div>
    </div>
  </div>
);

const GeneratorsPreview = () => (
  <div className="space-y-3">
    <div className="flex items-center justify-center py-4">
      <Palette className="w-8 h-8 text-black/60" />
    </div>
    <div className="text-xs text-black/60 text-center">CD • T-SHIRT • POSTER</div>
  </div>
);

const CalendarPreview = () => (
  <div className="space-y-3">
    <div className="grid grid-cols-7 gap-1">
      {Array.from({ length: 21 }, (_, i) => (
        <div 
          key={i} 
          className={`aspect-square rounded-sm ${
            i === 7 || i === 14 ? 'bg-black' : 'bg-black/10'
          } flex items-center justify-center`}
        >
          {(i === 7 || i === 14) && <div className="w-1 h-1 bg-white rounded-full"></div>}
        </div>
      ))}
    </div>
    <div className="text-xs text-black/60 text-center">LIVE VENUES • EVENTS</div>
  </div>
);

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
      stats: [
        { label: 'ITEMS', value: '12.4K' },
        { label: 'VERIFIED', value: '98.7%' },
        { label: 'EXPERTS', value: '247' }
      ],
      color: 'from-black/20 to-black/10'
    },
    {
      id: 'generators',
      title: 'GENERATORS',
      subtitle: 'CREATIVE TOOLS',
      description: 'Design custom content and personalized items with AI-powered creative tools and generators',
      href: '/tools',
      icon: <Palette className="w-8 h-8" />,
      stats: [
        { label: 'TOOLS', value: '8' },
        { label: 'CREATED', value: '45.2K' },
        { label: 'ACTIVE', value: '1.8K' }
      ],
      color: 'from-black/15 to-black/5'
    },
    {
      id: 'calendar',
      title: 'CALENDAR',
      subtitle: 'LIVE CITY CULTURE',
      description: 'Real-time venue performances and cultural events across major cities with expert curation',
      href: '/calendar',
      icon: <Calendar className="w-8 h-8" />,
      stats: [
        { label: 'VENUES', value: '892' },
        { label: 'CITIES', value: '12' },
        { label: 'EVENTS', value: '3.1K' }
      ],
      color: 'from-black/10 to-black/5'
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
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-normal lowercase text-black">plaza</h1>
          <div className="text-xs sm:text-sm font-medium uppercase tracking-wider text-black/60">
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
              Three interconnected pillars of culture, commerce, and creativity.
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>Each experience is curated by experts and enhanced by intelligent systems.
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
                
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 items-center">
                  
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
                    <p className={`font-medium text-sm uppercase tracking-wider transition-colors duration-300 ${
                      selectedPillar === pillar.id ? 'text-white/80' : 'text-black/60'
                    }`}>
                      {pillar.subtitle}
                    </p>
                  </div>

                  {/* Center: Description and Preview */}
                  <div className="text-center">
                    <p className={`body-text text-sm sm:text-base mb-4 sm:mb-6 transition-colors duration-300 ${
                      selectedPillar === pillar.id ? 'text-white/90' : 'text-black/70'
                    }`}>
                      {pillar.description}
                    </p>
                    <div className="max-w-xs mx-auto hidden sm:block">
                      {pillar.id === 'market' && <MarketPreview />}
                      {pillar.id === 'generators' && <GeneratorsPreview />}
                      {pillar.id === 'calendar' && <CalendarPreview />}
                    </div>
                  </div>

                  {/* Right: Stats and Action */}
                  <div className="text-center lg:text-right">
                    <div className="grid grid-cols-3 lg:grid-cols-1 gap-2 sm:gap-4 mb-4 sm:mb-8">
                      {pillar.stats.map((stat) => (
                        <div key={stat.label}>
                          <div className={`heading-md transition-colors duration-300 ${
                            selectedPillar === pillar.id ? 'text-white' : 'text-black'
                          }`}>
                            {stat.value}
                          </div>
                          <div className={`mono-text text-xs transition-colors duration-300 ${
                            selectedPillar === pillar.id ? 'text-white/70' : 'text-black/50'
                          }`}>
                            {stat.label}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className={`inline-flex items-center space-x-2 font-medium uppercase tracking-wider transition-colors duration-300 ${
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

          {/* Bottom Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-20 glass-panel-strong rounded-3xl p-12"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 text-center">
              <div>
                <TrendingUp className="w-8 h-8 text-black mx-auto mb-4" />
                <div className="heading-md text-black mb-2">847MS</div>
                <div className="mono-text text-sm text-black/60">AVERAGE RESPONSE</div>
              </div>
              <div>
                <Users className="w-8 h-8 text-black mx-auto mb-4" />
                <div className="heading-md text-black mb-2">12.4K</div>
                <div className="mono-text text-sm text-black/60">ACTIVE USERS</div>
              </div>
              <div>
                <Store className="w-8 h-8 text-black mx-auto mb-4" />
                <div className="heading-md text-black mb-2">98.7%</div>
                <div className="mono-text text-sm text-black/60">SATISFACTION</div>
              </div>
              <div>
                <Clock className="w-8 h-8 text-black mx-auto mb-4" />
                <div className="heading-md text-black mb-2">24/7</div>
                <div className="mono-text text-sm text-black/60">LIVE UPDATES</div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
