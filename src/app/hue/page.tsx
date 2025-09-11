'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { useDarkMode } from '@/hooks/useDarkMode';
import { HueModel, HueModelFallback } from '@/components/hue/HueModel';
import { ChatUI } from '@/components/hue/ChatUI';
import { useChat } from '@/hooks/useChat';
import Header from '@/components/Header';

export default function HuePage() {
  const { isDarkMode } = useDarkMode();
  const { isLoading } = useChat();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-between mb-6">
              <button
              onClick={() => window.location.href = '/home'}
              className="nav-text flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
              <span>←</span>
              <span>plaza</span>
              </button>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-blue-500 animate-pulse' : 'bg-green-500'}`}></div>
              <span className="mono-text text-xs text-gray-500">
                {isLoading ? 'Processing' : 'Online'}
              </span>
            </div>
          </div>
          <h1 className="heading-lg text-black mb-4">hue</h1>
          <p className="body-text text-xl text-black/80">AI Digital Assistant</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <div className="w-full lg:w-1/2">
            <div className="bg-white border border-gray-200 rounded-3xl p-8 lg:p-12 shadow-lg">
              <div className="text-center mb-6">
                <h2 className="heading-lg text-black mb-2">avatar</h2>
                <p className="body-text text-black/70">hue: 180°</p>
              </div>
              
              <div className="bg-gray-100 rounded-2xl mb-6 relative h-64 sm:h-80 lg:h-96">
                <Canvas
                  camera={{ position: [0, 0, 5], fov: 75 }}
                  style={{ background: 'transparent' }}
                  gl={{ 
                    powerPreference: "high-performance",
                    antialias: true,
                    alpha: true,
                    preserveDrawingBuffer: false
                  }}
                >
                  <Suspense fallback={<HueModelFallback />}>
                    <HueModel isTalking={isLoading} />
                  </Suspense>
                  
                  {/* Better lighting for visibility */}
                  <ambientLight intensity={1.2} />
                  <directionalLight 
                    position={[10, 10, 5]} 
                    intensity={1.5} 
                    castShadow 
                  />
                  <pointLight position={[-10, -10, -5]} intensity={0.8} />
                  <pointLight position={[5, 0, 5]} intensity={0.6} color="#ffffff" />
                  
                  {/* Environment */}
                  <Environment preset="studio" />
                  
                  {/* Controls */}
                  <OrbitControls 
                    enablePan={false}
                    enableZoom={true}
                    minDistance={2}
                    maxDistance={8}
                    autoRotate={false}
                    autoRotateSpeed={0.5}
                  />
                </Canvas>
              </div>

              <div>
                <h3 className="heading-md text-black mb-4">personality</h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="body-text text-black">Curiosity</span>
                      <span className="mono-text text-sm font-medium">50</span>
                      </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-black h-2 rounded-full transition-all duration-500" style={{width: '50%'}}></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="body-text text-black">Empathy</span>
                      <span className="mono-text text-sm font-medium">50</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-black h-2 rounded-full transition-all duration-500" style={{width: '50%'}}></div>
              </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="body-text text-black">Creativity</span>
                      <span className="mono-text text-sm font-medium">50</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-black h-2 rounded-full transition-all duration-500" style={{width: '50%'}}></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="body-text text-black">Assertiveness</span>
                      <span className="mono-text text-sm font-medium">50</span>
                </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-black h-2 rounded-full transition-all duration-500" style={{width: '50%'}}></div>
              </div>
            </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="body-text text-black">Humor</span>
                      <span className="mono-text text-sm font-medium">50</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-black h-2 rounded-full transition-all duration-500" style={{width: '50%'}}></div>
                </div>
              </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="body-text text-black">Philosophical</span>
                      <span className="mono-text text-sm font-medium">50</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-black h-2 rounded-full transition-all duration-500" style={{width: '50%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 mt-6 lg:mt-0">
            <div className="bg-white border border-gray-200 rounded-3xl border-l-4 border-l-blue-500 overflow-hidden h-[600px] shadow-lg">
              <ChatUI isDarkMode={isDarkMode} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}