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
  const [bones, setBones] = useState<{[key: string]: THREE.Bone}>({});
  const clock = useRef(new THREE.Clock());

  useEffect(() => {
    const loader = new FBXLoader();
    
    // Load your FBX file - update the path to where you place your FBX file
    loader.load(
      '/models/hue.fbx', // Place your FBX file in public/models/
      (object) => {
        // Scale and position the model
        object.scale.setScalar(0.01); // Adjust scale as needed
        object.position.set(0, -1, 0); // Adjust position as needed
        
        // Set up materials with hue-based coloring and find bones
        const foundBones: {[key: string]: THREE.Bone} = {};
        
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
          
          // Find important bones for animation
          if (child.type === 'Bone') {
            const bone = child as THREE.Bone;
            const boneName = bone.name.toLowerCase();
            
            // Look for chest/spine bones
            if (boneName.includes('chest') || boneName.includes('spine') || boneName.includes('torso')) {
              foundBones.chest = bone;
              console.log('Found chest bone:', bone.name);
            }
            
            // Look for arm bones
            if (boneName.includes('arm') || boneName.includes('shoulder')) {
              if (boneName.includes('left') || boneName.includes('l_')) {
                foundBones.leftArm = bone;
                console.log('Found left arm bone:', bone.name);
              }
              if (boneName.includes('right') || boneName.includes('r_')) {
                foundBones.rightArm = bone;
                console.log('Found right arm bone:', bone.name);
              }
            }
          }
        });
        
        setBones(foundBones);
        console.log('Available bones:', Object.keys(foundBones));

        // Set up animation mixer if animations exist in the model
        if (object.animations && object.animations.length > 0) {
          console.log('Found animations in model:', object.animations.map(anim => anim.name));
          const animationMixer = new THREE.AnimationMixer(object);
          
          // Find idle animation or use the first one
          const idleAnimation = object.animations.find(anim => 
            anim.name.toLowerCase().includes('idle') || 
            anim.name.toLowerCase().includes('breathing') ||
            anim.name.toLowerCase().includes('rest') ||
            anim.name.toLowerCase().includes('stand')
          ) || object.animations[0];
          
          if (idleAnimation) {
            console.log('Playing model animation:', idleAnimation.name);
            const action = animationMixer.clipAction(idleAnimation);
            action.setLoop(THREE.LoopRepeat, Infinity);
            action.setEffectiveWeight(1);
            action.reset();
            
            // Small delay to ensure model is ready
            setTimeout(() => {
              action.play();
              console.log('Animation action started with weight 1');
            }, 100);
          }
          
          setMixer(animationMixer);
        } else {
          console.log('No animations found in model, loading separate animation file');
          
          // Load separate animation file
          const animLoader = new FBXLoader();
          animLoader.load(
            '/models/hueidle.fbx',
            (animObject) => {
              console.log('Loaded animation file');
              
              if (animObject.animations && animObject.animations.length > 0) {
                console.log('Found animations in separate file:', animObject.animations.map(anim => anim.name));
                
                const animationMixer = new THREE.AnimationMixer(object);
                const idleAnimation = animObject.animations[0]; // Use first animation from the file
                
                console.log('Playing separate animation:', idleAnimation.name);
                const action = animationMixer.clipAction(idleAnimation);
                action.setLoop(THREE.LoopRepeat, Infinity);
                action.setEffectiveWeight(1);
                action.play();
                
                console.log('Animation mixer set with action playing');
                setMixer(animationMixer);
              } else {
                console.log('No animations found in separate file either');
              }
            },
            (progress) => {
              console.log('Animation loading progress:', (progress.loaded / progress.total * 100) + '%');
            },
            (error) => {
              console.error('Error loading animation file:', error);
              console.log('Falling back to procedural animation');
            }
          );
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
      // If we have a real animation mixer, don't do procedural animations
      return;
    }
    
    const time = Date.now() * 0.001;
    
    // Only do procedural bone animation if no real animation is playing
    if (Object.keys(bones).length > 0 && !mixer) {
      // Chest breathing animation
      if (bones.chest) {
        const breatheIntensity = 0.08;
        const breatheSpeed = 0.8;
        const breathe = Math.sin(time * breatheSpeed) * breatheIntensity;
        
        // Scale chest for breathing effect
        bones.chest.scale.setScalar(1 + breathe);
        
        // Slight forward/back movement for chest pumping
        bones.chest.position.z = breathe * 0.05;
      }
      
      // Arm swaying animation
      if (bones.leftArm) {
        const swaySpeed = 0.6;
        const swayIntensity = 0.15;
        const leftSway = Math.sin(time * swaySpeed) * swayIntensity;
        bones.leftArm.rotation.z = leftSway;
        bones.leftArm.rotation.x = Math.sin(time * swaySpeed * 0.7) * swayIntensity * 0.5;
      }
      
      if (bones.rightArm) {
        const swaySpeed = 0.6;
        const swayIntensity = 0.15;
        // Right arm sways opposite to left for natural movement
        const rightSway = Math.sin(time * swaySpeed + Math.PI) * swayIntensity;
        bones.rightArm.rotation.z = rightSway;
        bones.rightArm.rotation.x = Math.sin(time * swaySpeed * 0.7 + Math.PI) * swayIntensity * 0.5;
      }
      
      // Gentle overall rotation
      if (meshRef.current) {
        meshRef.current.rotation.y += 0.002;
      }
    } else {
      // Fallback animation for models without bones
      if (meshRef.current && !mixer) {
        // Slow rotation
        meshRef.current.rotation.y += 0.003;
        // Gentle breathing-like scale
        const breathe = 1 + Math.sin(time * 0.5) * 0.02;
        meshRef.current.scale.setScalar(0.01 * breathe);
        // Subtle floating
        meshRef.current.position.y = -1 + Math.sin(time * 0.3) * 0.1;
      }
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
