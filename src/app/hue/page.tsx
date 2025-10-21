'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useDarkMode } from '@/hooks/useDarkMode';
import { ChatUI } from '@/components/hue/ChatUI';
import { useChat } from '@/hooks/useChat';
import Header from '@/components/Header';

// Direct FBX model loader (no React Three Fiber)
const DirectHueModel = dynamic(() => import('@/components/hue/DirectHueModel'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl animate-pulse flex items-center justify-center">
      <div className="text-gray-500 text-sm">Loading Hue FBX...</div>
    </div>
  )
});

// Fallback 2D model in case FBX fails
const SimpleHueModel = dynamic(() => import('@/components/hue/SimpleHueModel'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl animate-pulse flex items-center justify-center">
      <div className="text-gray-500 text-sm">Loading Hue...</div>
    </div>
  )
});

export default function HuePage() {
  const { isDarkMode } = useDarkMode();
  const { isLoading } = useChat();
  const [use3D, setUse3D] = React.useState(true);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => window.location.href = '/home'}
            className="nav-text flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <span>←</span>
            <span className="font-light">plaza</span>
          </button>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-blue-500 animate-pulse' : 'bg-green-500'}`}></div>
            <span className="mono-text text-xs text-gray-500">
              {isLoading ? 'Processing' : 'Online'}
            </span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-2 lg:gap-3 h-[calc(100vh-100px)]">
          <div className="w-full lg:w-1/2">
            <div className="bg-white border border-gray-200 rounded-3xl border-l-4 border-l-yellow-500 overflow-hidden h-full shadow-lg relative">
              {use3D ? (
                <DirectHueModel isTalking={isLoading} />
              ) : (
                <SimpleHueModel isTalking={isLoading} />
              )}
              
              {/* Toggle button for testing */}
              <button
                onClick={() => setUse3D(!use3D)}
                className="absolute top-4 right-4 px-3 py-1 text-xs bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-full transition-colors z-10"
              >
                {use3D ? '3D' : '2D'}
              </button>
            </div>
          </div>

          <div className="w-full lg:w-1/2">
            <div className="bg-white border border-gray-200 rounded-3xl border-l-4 border-l-yellow-500 overflow-hidden h-full shadow-lg">
              <ChatUI isDarkMode={isDarkMode} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}