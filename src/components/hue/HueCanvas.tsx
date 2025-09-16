'use client';

import { Suspense, useEffect, useState } from 'react';

interface HueCanvasProps {
  isTalking: boolean;
  onError?: () => void;
}

export default function HueCanvas({ isTalking, onError }: HueCanvasProps) {
  const [isClient, setIsClient] = useState(false);
  const [ThreeComponents, setThreeComponents] = useState<any>(null);

  useEffect(() => {
    setIsClient(true);
    
    // Dynamically import all Three.js components only on client
    const loadThreeComponents = async () => {
      try {
        const [
          { Canvas },
          { OrbitControls, Environment },
          { HueModel, HueModelFallback }
        ] = await Promise.all([
          import('@react-three/fiber'),
          import('@react-three/drei'),
          import('@/components/hue/HueModel')
        ]);

        setThreeComponents({
          Canvas,
          OrbitControls,
          Environment,
          HueModel,
          HueModelFallback
        });
      } catch (error) {
        console.error('Failed to load Three.js components:', error);
        onError?.();
      }
    };

    loadThreeComponents();
  }, []);

  if (!isClient || !ThreeComponents) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl animate-pulse flex items-center justify-center">
        <div className="text-gray-500 text-sm">Loading 3D Hue...</div>
      </div>
    );
  }

  const { Canvas, OrbitControls, Environment, HueModel, HueModelFallback } = ThreeComponents;

  return (
    <Canvas
      camera={{ position: [0, 0, 3], fov: 60 }}
      style={{ background: 'transparent', width: '100%', height: '100%' }}
      gl={{ 
        powerPreference: "high-performance",
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: false
      }}
      onCreated={({ gl }: any) => {
        console.log('Canvas created successfully');
      }}
      onError={(error: any) => {
        console.error('Canvas error:', error);
        onError?.();
      }}
    >
      <Suspense fallback={<HueModelFallback />}>
        <HueModel isTalking={isTalking} />
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
        enableZoom={false}
        enableRotate={true}
        minDistance={2}
        maxDistance={5}
        autoRotate={false}
        autoRotateSpeed={0.5}
      />
    </Canvas>
  );
}
