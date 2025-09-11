'use client';

import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import * as THREE from 'three';

interface AvatarModelProps {
  hue: number;
}

// Avatar Model Component
function AvatarModel({ hue }: AvatarModelProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [fbx, setFbx] = useState<THREE.Group | null>(null);
  const [mixer, setMixer] = useState<THREE.AnimationMixer | null>(null);
  const clock = useRef(new THREE.Clock());

  useEffect(() => {
    const loader = new FBXLoader();
    
    // Load your FBX file - update the path to where you place your FBX file
    loader.load(
      '/models/hue-avatar.fbx', // Place your FBX file in public/models/
      (object) => {
        // Scale and position the model
        object.scale.setScalar(0.01); // Adjust scale as needed
        object.position.set(0, -1, 0); // Adjust position as needed
        
        // Set up materials with hue-based coloring
        object.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            if (mesh.material) {
              // Create a new material with hue-based color
              const material = new THREE.MeshStandardMaterial({
                color: new THREE.Color().setHSL(hue / 360, 0.6, 0.5),
                metalness: 0.3,
                roughness: 0.4
              });
              mesh.material = material;
            }
          }
        });

        // Set up animation mixer if animations exist
        if (object.animations && object.animations.length > 0) {
          const animationMixer = new THREE.AnimationMixer(object);
          
          // Find idle animation or use the first one
          const idleAnimation = object.animations.find(anim => 
            anim.name.toLowerCase().includes('idle') || 
            anim.name.toLowerCase().includes('breathing') ||
            anim.name.toLowerCase().includes('rest')
          ) || object.animations[0];
          
          if (idleAnimation) {
            const action = animationMixer.clipAction(idleAnimation);
            action.play();
          }
          
          setMixer(animationMixer);
        }

        setFbx(object);
      },
      (progress) => {
        console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
      },
      (error) => {
        console.error('Error loading FBX:', error);
        // Create a fallback geometry if FBX fails to load
        createFallbackAvatar();
      }
    );

    return () => {
      if (mixer) {
        mixer.stopAllAction();
      }
    };
  }, []);

  // Create fallback avatar if FBX doesn't load
  const createFallbackAvatar = () => {
    const geometry = new THREE.CapsuleGeometry(0.5, 1.5, 4, 8);
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color().setHSL(hue / 360, 0.6, 0.5),
      metalness: 0.3,
      roughness: 0.4
    });
    const capsule = new THREE.Mesh(geometry, material);
    
    const group = new THREE.Group();
    group.add(capsule);
    setFbx(group);
  };

  // Update hue when it changes
  useEffect(() => {
    if (fbx) {
      fbx.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (mesh.material && (mesh.material as THREE.MeshStandardMaterial).color) {
            (mesh.material as THREE.MeshStandardMaterial).color.setHSL(hue / 360, 0.6, 0.5);
          }
        }
      });
    }
  }, [hue, fbx]);

  // Animation loop
  useFrame(() => {
    if (mixer) {
      mixer.update(clock.current.getDelta());
    }
    
    // Gentle rotation for idle movement
    if (meshRef.current && !mixer) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  if (!fbx) {
    return (
      <mesh ref={meshRef}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial 
          color={new THREE.Color().setHSL(hue / 360, 0.6, 0.5)} 
          wireframe 
        />
      </mesh>
    );
  }

  return <primitive ref={meshRef} object={fbx} />;
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
