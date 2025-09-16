'use client';

import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useFBX } from '@react-three/drei';
import * as THREE from 'three';

interface HueModelProps {
  isTalking?: boolean;
}

export function HueModel({ isTalking = false }: HueModelProps) {
  const fbxRef = useRef<THREE.Group>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [currentAnimation, setCurrentAnimation] = useState<string>('idle');
  const [error, setError] = useState<string | null>(null);

  // Load the main hue.fbx model
  const fbx = useFBX('/models/hue.fbx');
  const idleAnimation = useFBX('/models/hueidle.fbx');

  console.log('HueModel: FBX loaded:', { fbx, idleAnimation });

  useEffect(() => {
    console.log('HueModel: useEffect triggered', { fbx, fbxRef: fbxRef.current });
    
    if (fbx && fbxRef.current) {
      try {
        // Scale and position the model to fit the container
        fbx.scale.setScalar(0.01); // Appropriate scale for the container
        fbx.position.set(0, -1, 0); // Center in the container
        fbx.rotation.set(0, 0, 0); // Reset rotation
        
        console.log('HueModel: Model positioned and scaled');
        
        // Set up animations
        mixerRef.current = new THREE.AnimationMixer(fbx);
        
        // Try to use idle animation from separate file first
        if (idleAnimation && idleAnimation.animations && idleAnimation.animations.length > 0) {
          const idleAction = mixerRef.current.clipAction(idleAnimation.animations[0]);
          idleAction.setLoop(THREE.LoopRepeat, Infinity);
          idleAction.play();
          setCurrentAnimation('idle');
          console.log('HueModel: Using idle animation from separate file');
        }
        // Fallback to animations in main model
        else if (fbx.animations && fbx.animations.length > 0) {
          const action = mixerRef.current.clipAction(fbx.animations[0]);
          action.setLoop(THREE.LoopRepeat, Infinity);
          action.play();
          setCurrentAnimation('idle');
          console.log('HueModel: Using animation from main model');
        }

        setModelLoaded(true);
        console.log('HueModel: Model successfully set up');
      } catch (err) {
        console.error('HueModel: Error setting up model:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    }
  }, [fbx, idleAnimation]);

  // Animation loop
  useFrame((state, delta) => {
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }

    // Add subtle floating animation
    if (fbxRef.current) {
      const time = state.clock.getElapsedTime();
      fbxRef.current.position.y = -1 + Math.sin(time * 2) * 0.1;
      
      // Add talking animation when AI is responding
      if (isTalking && currentAnimation === 'idle') {
        // Subtle head movement during talking
        fbxRef.current.rotation.y = Math.sin(time * 8) * 0.05;
        fbxRef.current.rotation.x = Math.sin(time * 6) * 0.02;
      }
    }
  });

  // Only show fallback if there's a clear error
  if (error) {
    console.log('HueModel: Showing fallback due to error:', error);
    return (
      <group position={[0, 0, 0]}>
        {/* Main body */}
        <mesh>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color={isTalking ? "#8B5CF6" : "#4F46E5"} />
        </mesh>
        
        {/* Eyes */}
        <mesh position={[-0.3, 0.2, 0.8]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        <mesh position={[0.3, 0.2, 0.8]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        
        {/* Talking indicator */}
        {isTalking && (
          <mesh position={[0, -0.5, 0.8]}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial color="#EF4444" />
          </mesh>
        )}
      </group>
    );
  }

  return (
    <group ref={fbxRef}>
      {fbx && <primitive object={fbx} />}
    </group>
  );
}

// Fallback component if model fails to load
export function HueModelFallback() {
  return (
    <mesh position={[0, 0, 0]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color="#4F46E5" />
    </mesh>
  );
}