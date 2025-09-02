'use client';

import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Shield, Zap } from 'lucide-react';

import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import AISearchInterface from '@/components/AISearchInterface';

// Mock data for demonstration
const featuredProducts = [
  {
    id: '1',
    title: 'MINIMALIST LEATHER JACKET',
    price: 1200,
    originalPrice: 1500,
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop',
    category: 'fashion' as const,
    aiMatch: 94,
    authenticity: 98,
    trending: true,
    views: 1247,
    likes: 89,
  },
  {
    id: '2',
    title: 'ABSTRACT CONTEMPORARY PIECE',
    price: 3500,
    imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop',
    category: 'art' as const,
    aiMatch: 87,
    authenticity: 96,
    trending: false,
    views: 892,
    likes: 156,
  },
  {
    id: '3',
    title: 'GEOMETRIC SCULPTURE',
    price: 8900,
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
    category: 'art' as const,
    aiMatch: 91,
    authenticity: 99,
    trending: true,
    views: 2341,
    likes: 287,
  },
  {
    id: '4',
    title: 'STRUCTURED BLAZER',
    price: 890,
    imageUrl: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=400&h=400&fit=crop',
    category: 'fashion' as const,
    aiMatch: 89,
    authenticity: 97,
    trending: false,
    views: 634,
    likes: 45,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 md:px-6 py-12">
        {/* Background Pattern */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5">
          <div className="w-96 h-96 border-2 border-black transform rotate-45 animate-spin-slow"></div>
        </div>

        <div className="relative z-10 text-center max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          >
            <h1 className="heading-xl text-black mb-6">
              THE FUTURE OF
              <br />
              LUXURY COMMERCE
            </h1>
                      <p className="body-text text-xl text-black/80 mb-12 max-w-3xl mx-auto">
            Intelligent marketplace where fashion meets fine art.
            <br />
            Discover, authenticate, and invest with confidence.
          </p>
          </motion.div>

          {/* AI Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
          >
            <div className="glass-panel rounded-3xl p-8 text-center">
              <Sparkles className="w-12 h-12 text-black mx-auto mb-4" />
              <h3 className="heading-md text-black mb-3">VISUAL SEARCH</h3>
              <p className="body-text text-black/70">
                Upload any image to find similar items across fashion and art
              </p>
            </div>
            
            <div className="glass-panel rounded-3xl p-8 text-center">
              <Shield className="w-12 h-12 text-black mx-auto mb-4" />
                             <h3 className="heading-md text-black mb-3">AUTHENTICATION</h3>
               <p className="body-text text-black/70">
                 Advanced verification of authenticity and condition
               </p>
            </div>
            
            <div className="glass-panel rounded-3xl p-8 text-center">
              <TrendingUp className="w-12 h-12 text-black mx-auto mb-4" />
              <h3 className="heading-md text-black mb-3">MARKET INTELLIGENCE</h3>
              <p className="body-text text-black/70">
                Real-time pricing and trend analysis for smart investing
              </p>
            </div>
          </motion.div>

          {/* AI Search Interface */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            <AISearchInterface />
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="px-4 md:px-6 py-16 md:py-24 bg-black/5">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
                      <h2 className="heading-xl text-black mb-6">
            CURATED
            <br />
            COLLECTION
          </h2>
          <p className="body-text text-xl text-black/80 max-w-2xl mx-auto">
            Expertly selected by our team of stylists and specialists
            based on global trends, authenticity, and investment potential.
          </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <ProductCard {...product} />
              </motion.div>
            ))}
          </div>

          {/* Browse All Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
                         <a href="/browse" className="btn-brutal-outline flex items-center space-x-3 mx-auto">
               <Zap className="w-5 h-5" />
               <span>BROWSE ALL ITEMS</span>
             </a>
          </motion.div>
        </div>
      </section>

      {/* AI Stats Section */}
      <section className="px-6 py-24">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="glass-panel-strong rounded-3xl p-12"
          >
            <div className="text-center mb-12">
              <h2 className="heading-lg text-black mb-4">
                INTELLIGENT MARKETPLACE
              </h2>
              <p className="body-text text-lg text-black/70">
                Real-time data and machine learning driving every decision
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              <div className="text-center">
                <div className="heading-xl text-black mb-2">98.7%</div>
                <div className="mono-text text-sm text-black/60">AUTHENTICATION ACCURACY</div>
              </div>
              <div className="text-center">
                <div className="heading-xl text-black mb-2">2.4M</div>
                <div className="mono-text text-sm text-black/60">ITEMS ANALYZED DAILY</div>
              </div>
              <div className="text-center">
                <div className="heading-xl text-black mb-2">94%</div>
                <div className="mono-text text-sm text-black/60">PRICE PREDICTION ACCURACY</div>
              </div>
              <div className="text-center">
                <div className="heading-xl text-black mb-2">847MS</div>
                <div className="mono-text text-sm text-black/60">AVERAGE SEARCH TIME</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="px-6 py-24">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="heading-xl text-black mb-6">
              CREATIVE
              <br />
              TOOLS
            </h2>
            <p className="body-text text-xl text-black/80 max-w-2xl mx-auto">
              Digital generators and utilities for artistic expression
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* T-Shirt Generator */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="glass-panel rounded-3xl p-8 text-center group hover:shadow-brutal-hover transition-all duration-300"
            >
              <div className="mb-6 flex justify-center">
                <div 
                  className="w-32 h-32 relative cursor-pointer animate-gentle-wave"
                  style={{
                    background: 'linear-gradient(135deg, #000000 0%, #333333 100%)',
                    WebkitMaskImage: "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik01MCAzMEg3MEM3NSAzMCA4MCAyNSA4MCAyMEM4MCAyMCA4NSAxNSA5MCAyMEM5NSAyNSAxMDAgMzAgMTUwIDMwSDE1MEMxNTUgMzAgMTYwIDM1IDE2MCA0MFYxNjBDMTYwIDE2NSAxNTUgMTcwIDE1MCAxNzBINTBDNDUgMTcwIDQwIDE2NSA0MCAxNjBWNDBDNDAgMzUgNDUgMzAgNTAgMzBaIiBmaWxsPSJibGFjayIvPgo8L3N2Zz4K')",
                    WebkitMaskSize: '80%',
                    WebkitMaskRepeat: 'no-repeat',
                    WebkitMaskPosition: 'center',
                    maskImage: "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik01MCAzMEg3MEM3NSAzMCA4MCAyNSA4MCAyMEM4MCAyMCA4NSAxNSA5MCAyMEM5NSAyNSAxMDAgMzAgMTUwIDMwSDE1MEMxNTUgMzAgMTYwIDM1IDE2MCA0MFYxNjBDMTYwIDE2NSAxNTUgMTcwIDE1MCAxNzBINTBDNDUgMTcwIDQwIDE2NSA0MCAxNjBWNDBDNDAgMzUgNDUgMzAgNTAgMzBaIiBmaWxsPSJibGFjayIvPgo8L3N2Zz4K')",
                    maskSize: '80%',
                    maskRepeat: 'no-repeat',
                    maskPosition: 'center',
                  }}
                >
                  <div className="absolute top-[25%] left-0 right-0 text-center">
                    <div className="text-sm font-bold text-white drop-shadow-lg lowercase">plaza</div>
                  </div>
                </div>
              </div>
              <h3 className="heading-md text-black mb-3">T-SHIRT GENERATOR</h3>
              <p className="body-text text-black/70 mb-6">
                Custom apparel design tool
              </p>
              <a href="/tools/tshirt-generator" className="btn-brutal-outline group-hover:bg-black group-hover:text-white transition-all">
                CREATE
              </a>
            </motion.div>

            {/* CD Generator */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="glass-panel rounded-3xl p-8 text-center group hover:shadow-brutal-hover transition-all duration-300"
            >
              <div className="mb-6 flex justify-center">
                <div 
                  className="w-32 h-32 relative cursor-pointer aspect-square"
                  style={{
                    perspective: '1000px',
                    transformStyle: 'preserve-3d',
                  }}
                >
                  <div 
                    className="w-full h-full rounded-full absolute animate-spin-slow"
                    style={{
                      background: `linear-gradient(135deg, 
                        rgba(255,255,255,0.4) 0%, 
                        rgba(255,255,255,0.2) 25%, 
                        rgba(255,255,255,0.6) 50%, 
                        rgba(255,255,255,0.2) 75%, 
                        rgba(255,255,255,0.4) 100%)`,
                      boxShadow: '0 0 30px rgba(0,0,0,0.2), inset 0 0 50px rgba(255,255,255,0.3)',
                      transform: 'rotateX(20deg)',
                    }}
                  >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gradient-to-b from-gray-200 to-gray-400">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white"></div>
                    </div>
                    <div className="absolute top-[20%] left-0 right-0 text-center">
                      <div className="text-xs font-bold text-black drop-shadow-lg lowercase">plaza</div>
                    </div>
                  </div>
                </div>
              </div>
              <h3 className="heading-md text-black mb-3">CD GENERATOR</h3>
              <p className="body-text text-black/70 mb-6">
                Holographic cover design tool
              </p>
              <a href="/tools/cd-generator" className="btn-brutal-outline group-hover:bg-black group-hover:text-white transition-all">
                CREATE
              </a>
            </motion.div>

            {/* Calendar */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="glass-panel rounded-3xl p-8 text-center group hover:shadow-brutal-hover transition-all duration-300"
            >
              <div className="mb-6 flex justify-center">
                <div className="w-32 h-32 flex items-center justify-center">
                  <div className="w-24 h-24 border-brutal border-black rounded-2xl p-4 bg-white/60">
                    <div className="grid grid-cols-7 gap-1">
                      {Array.from({ length: 28 }, (_, i) => (
                        <div key={i} className={`w-1 h-1 ${i % 7 === 0 || i % 7 === 6 ? 'bg-black/20' : 'bg-black/40'} rounded-full`} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <h3 className="heading-md text-black mb-3">PUBLIC CALENDAR</h3>
              <p className="body-text text-black/70 mb-6">
                Community events tracker
              </p>
              <a href="/calendar" className="btn-brutal-outline group-hover:bg-black group-hover:text-white transition-all">
                VIEW
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-brutal border-black bg-white px-6 py-12">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="heading-lg text-black mb-4 lowercase">plaza</h3>
          <p className="mono-text text-sm text-black/60 mb-6">
            DIGITAL MARKETPLACE
          </p>
          <div className="flex items-center justify-center space-x-8">
            <a href="/about" className="body-text font-medium uppercase tracking-wide hover:text-black/60 transition-colors">
              ABOUT
            </a>
            <a href="/contact" className="body-text font-medium uppercase tracking-wide hover:text-black/60 transition-colors">
              CONTACT
            </a>
            <a href="/privacy" className="body-text font-medium uppercase tracking-wide hover:text-black/60 transition-colors">
              PRIVACY
            </a>
            <a href="/terms" className="body-text font-medium uppercase tracking-wide hover:text-black/60 transition-colors">
              TERMS
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
