'use client';

import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import * as THREE from 'three';

interface AvatarModelProps {
  hue: number;
}

// Avatar Model Component - Simplified approach
function AvatarModel({ hue }: AvatarModelProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [mixer, setMixer] = useState<THREE.AnimationMixer | null>(null);
  const [fbxModel, setFbxModel] = useState<THREE.Group | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  // Load model using traditional FBXLoader approach (more reliable)
  useEffect(() => {
    console.log('Starting to load FBX model...');
    const loader = new FBXLoader();
    
    // Add a small delay to ensure Three.js is ready
    const loadModel = () => {
      console.log('Attempting to load /models/hue.fbx');
      
      loader.load(
        '/models/hue.fbx',
        (object: THREE.Group) => {
          console.log('✅ Model loaded successfully!', object);
          console.log('Model has', object.children.length, 'children');
          console.log('Model animations:', object.animations?.length || 0);
          
          // Scale and position
          object.scale.setScalar(0.01);
          object.position.set(0, -1, 0);
          
          // Apply materials
          let meshCount = 0;
          object.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              meshCount++;
              const mesh = child as THREE.Mesh;
              if (mesh.material) {
                const material = new THREE.MeshStandardMaterial({
                  color: new THREE.Color().setHSL(hue / 360, 0.6, 0.5),
                  metalness: 0.3,
                  roughness: 0.4
                });
                mesh.material = material;
              }
            }
          });
          console.log('Applied materials to', meshCount, 'meshes');
          
          // Setup animations
          if (object.animations && object.animations.length > 0) {
            console.log('Found animations:', object.animations.map(anim => anim.name));
            const animationMixer = new THREE.AnimationMixer(object);
            
            const idleAnimation = object.animations.find(anim => 
              anim.name.toLowerCase().includes('idle') ||
              anim.name.toLowerCase().includes('breathing')
            ) || object.animations[0];
            
            console.log('Playing animation:', idleAnimation.name);
            const action = animationMixer.clipAction(idleAnimation);
            action.setLoop(THREE.LoopRepeat, Infinity);
            action.play();
            
            setMixer(animationMixer);
          } else {
            console.log('No animations found in model');
          }
          
          setFbxModel(object);
        },
        (progress) => {
          const percent = Math.round((progress.loaded / progress.total) * 100);
          console.log(`Loading progress: ${percent}%`);
        },
        (error) => {
          console.error('❌ Error loading model:', error);
          console.log('Will use fallback geometric character');
        }
      );
    };

    // Small delay to ensure everything is initialized
    setTimeout(loadModel, 100);
  }, [hue]);

  // Update hue when it changes
  useEffect(() => {
    if (fbxModel) {
      fbxModel.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (mesh.material && (mesh.material as THREE.MeshStandardMaterial).color) {
            (mesh.material as THREE.MeshStandardMaterial).color.setHSL(hue / 360, 0.6, 0.5);
          }
        }
      });
    }
  }, [hue, fbxModel]);

  // Multi-layer animation system
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Update FBX animation mixer
    if (mixer) {
      mixer.update(state.clock.getDelta());
    }
    
    // Layer 2: Floating motion (always active)
    if (meshRef.current) {
      // Gentle floating motion
      const floatY = Math.sin(time * 2) * 0.1;
      meshRef.current.position.y = -1 + floatY;
      
      // Gentle overall rotation
      meshRef.current.rotation.y += 0.002;
    }
  });

  // Fallback system if model fails to load
  if (!fbxModel) {
    return (
      <group ref={meshRef}>
        {/* Fallback geometric character */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.8, 16, 16]} />
          <meshStandardMaterial color={new THREE.Color().setHSL(hue / 360, 0.6, 0.5)} />
        </mesh>
        {/* Eyes */}
        <mesh position={[-0.3, 0.2, 0.7]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color="white" />
        </mesh>
        <mesh position={[0.3, 0.2, 0.7]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color="white" />
        </mesh>
      </group>
    );
  }

  return <primitive ref={meshRef} object={fbxModel} />;
}

// Main Avatar Component
interface PlazaAvatarProps {
  hue?: number;
  className?: string;
}

export default function PlazaAvatar({ hue = 180, className = '' }: PlazaAvatarProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    // Server-side fallback
    return (
      <div className={`w-full h-full bg-gradient-to-br from-black/5 to-black/10 rounded-2xl flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div 
            className="w-16 h-16 rounded-full mx-auto mb-4 animate-pulse"
            style={{ backgroundColor: `hsl(${hue}, 60%, 50%)` }}
          />
          <p className="mono-text text-xs text-black/60">LOADING AVATAR...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={0.8} 
          castShadow
        />
        <pointLight 
          position={[-5, 5, 5]} 
          intensity={0.3}
          color={`hsl(${hue}, 60%, 70%)`}
        />
        
        {/* Environment */}
        <Environment preset="studio" />
        
        {/* Avatar */}
        <AvatarModel hue={hue} />
        
        {/* Controls */}
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          autoRotate={true}
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>
    </div>
  );
}
