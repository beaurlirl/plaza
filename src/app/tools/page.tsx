'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Download, Palette } from 'lucide-react';

import Header from '@/components/Header';

export default function Tools() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-12">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="heading-lg text-black mb-6">tools</h1>
          <p className="body-text text-xl text-black/80 max-w-3xl mx-auto">
            creative generators and utilities for digital expression
          </p>
        </motion.div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 mb-8 sm:mb-12 lg:mb-16">
          {/* T-Shirt Generator */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="glass-panel rounded-3xl p-12 text-center group hover:shadow-brutal-hover transition-all duration-300"
          >
            {/* Animated T-Shirt Preview */}
            <div className="mb-8 flex justify-center">
              <div 
                className="w-64 h-64 relative cursor-pointer animate-gentle-wave glass-panel rounded-3xl border-2 border-gray-300"
                style={{
                  background: 'linear-gradient(135deg, #000000 0%, #333333 100%)',
                  WebkitMaskImage: "url('/shirtforpublic.svg')",
                  WebkitMaskSize: '100%',
                  WebkitMaskRepeat: 'no-repeat',
                  WebkitMaskPosition: 'center',
                  maskImage: "url('/shirtforpublic.svg')",
                  maskSize: '100%',
                  maskRepeat: 'no-repeat',
                  maskPosition: 'center',
                }}
              >
                <div className="absolute top-[25%] left-0 right-0 text-center">
                  <div className="text-lg font-light text-white drop-shadow-lg">plaza</div>
                </div>
                <div className="absolute top-[40%] left-0 right-0 text-center">
                  <div className="text-sm font-light text-white drop-shadow-lg">design</div>
                </div>
                <div className="absolute top-[30%] left-[10%] -translate-y-1/2">
                  <div className="text-xs font-light text-white drop-shadow-lg transform rotate-90">2024</div>
                </div>
              </div>
            </div>

            <h2 className="heading-lg text-black mb-4">t-shirt generator</h2>
            <p className="body-text text-black/70 mb-8">
              create custom designs with text, colors, and patterns
            </p>
            
            <a 
              href="/tools/tshirt-generator"
              className="btn-brutal-outline flex items-center justify-center space-x-3 group-hover:bg-black group-hover:text-white transition-all"
            >
              <Palette className="w-5 h-5" />
              <span>create design</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>

          {/* CD Generator */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="glass-panel rounded-3xl p-12 text-center group hover:shadow-brutal-hover transition-all duration-300"
          >
            {/* Animated CD Preview */}
            <div className="mb-8 flex justify-center">
              <div 
                className="w-64 h-64 relative cursor-pointer aspect-square"
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
                    filter: 'hue-rotate(calc(var(--hue, 0) * 1deg))',
                  }}
                >
                  {/* Center Ring */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-gradient-to-b from-gray-200 to-gray-400">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white"></div>
                  </div>

                  {/* Text Layer */}
                  <div className="absolute inset-0" style={{ zIndex: 10 }}>
                    <div className="absolute top-[20%] left-0 right-0 text-center">
                      <div className="text-lg font-light text-black drop-shadow-lg">plaza</div>
                    </div>
                    <div className="absolute bottom-[20%] left-0 right-0 text-center">
                      <div className="text-sm font-light text-black drop-shadow-lg">mixtape</div>
                    </div>
                    <div className="absolute top-1/2 right-[20%] -translate-y-1/2">
                      <div className="text-xs font-light text-black drop-shadow-lg transform rotate-90">2024</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <h2 className="heading-lg text-black mb-4">cd generator</h2>
            <p className="body-text text-black/70 mb-8">
              design holographic cd covers with custom artwork
            </p>
            
            <a 
              href="/tools/cd-generator"
              className="btn-brutal-outline flex items-center justify-center space-x-3 group-hover:bg-black group-hover:text-white transition-all"
            >
              <Download className="w-5 h-5" />
              <span>create design</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>

        {/* Calendar Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="glass-panel-strong rounded-3xl p-12 text-center"
        >
          <h2 className="heading-lg text-black mb-4">public calendar</h2>
          <p className="body-text text-black/70 mb-8 max-w-2xl mx-auto">
            community events and happenings • connected to live database
          </p>
          
          <a 
            href="/calendar"
            className="btn-brutal flex items-center justify-center space-x-3 mx-auto"
          >
            <span>view calendar</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>

      {/* Custom Animations */}
      <style jsx global>{`
        @keyframes gentle-wave {
          0% { transform: scale(1) rotate(0deg) translateY(0px); }
          25% { transform: scale(1.01) rotate(0.5deg) translateY(-2px); }
          50% { transform: scale(1) rotate(-0.5deg) translateY(0px); }
          75% { transform: scale(0.99) rotate(0.25deg) translateY(2px); }
          100% { transform: scale(1) rotate(0deg) translateY(0px); }
        }

        .animate-gentle-wave {
          animation: gentle-wave 6s ease-in-out infinite;
          transform-origin: center center;
        }

        @keyframes spin-slow {
          from { transform: rotateX(20deg) rotateZ(0deg); }
          to { transform: rotateX(20deg) rotateZ(360deg); }
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }

      `}</style>
    </div>
  );
} 