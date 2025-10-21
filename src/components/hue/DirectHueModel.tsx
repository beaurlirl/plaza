'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

interface DirectHueModelProps {
  isTalking: boolean;
}

export default function DirectHueModel({ isTalking }: DirectHueModelProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const frameRef = useRef<number>();
  const modelRef = useRef<THREE.Object3D | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!mountRef.current) {
      console.log('DirectHueModel: No mount ref, aborting setup');
      return;
    }

    console.log('DirectHueModel: Starting setup...');
    console.log('DirectHueModel: Mount element dimensions:', {
      width: mountRef.current.offsetWidth,
      height: mountRef.current.offsetHeight
    });

    // Detect mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                    window.innerWidth <= 768;
    console.log('DirectHueModel: Mobile device detected:', isMobile);

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = null; // Transparent background
    sceneRef.current = scene;

    // Camera setup - mobile-optimized
    const aspect = mountRef.current.offsetWidth / mountRef.current.offsetHeight;
    const camera = new THREE.PerspectiveCamera(
      isMobile ? 60 : 75, // Lower FOV for mobile to prevent distortion
      aspect,
      0.1,
      1000
    );
    
    // Mobile-specific camera positioning
    if (isMobile) {
      camera.position.set(0, 0, 3); // Closer to model for mobile
    } else {
      camera.position.set(0, 0, 4);
    }
    camera.lookAt(0, 0, 0);
    
    console.log('DirectHueModel: Camera setup:', {
      position: camera.position,
      aspect: camera.aspect,
      fov: camera.fov,
      isMobile
    });

    // Renderer setup - mobile-optimized
    const renderer = new THREE.WebGLRenderer({ 
      antialias: !isMobile, // Disable antialias on mobile for performance
      alpha: true,
      powerPreference: isMobile ? "low-power" : "high-performance",
      precision: isMobile ? "lowp" : "highp"
    });
    
    // Set device pixel ratio for mobile
    const pixelRatio = isMobile ? Math.min(window.devicePixelRatio, 2) : window.devicePixelRatio;
    renderer.setPixelRatio(pixelRatio);
    
    renderer.setSize(mountRef.current.offsetWidth, mountRef.current.offsetHeight);
    renderer.setClearColor(0x000000, 0); // Transparent background
    
    // Mobile-specific renderer settings
    if (isMobile) {
      renderer.shadowMap.enabled = false; // Disable shadows on mobile for performance
      renderer.outputColorSpace = THREE.SRGBColorSpace;
    } else {
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }
    
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '50%';
    renderer.domElement.style.left = '50%';
    renderer.domElement.style.transform = 'translate(-50%, -50%)';
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Mobile-optimized lighting setup
    if (isMobile) {
      // Simplified lighting for mobile performance
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
      directionalLight.position.set(2, 2, 2);
      scene.add(directionalLight);
    } else {
      // Enhanced lighting for desktop
      const ambientLight = new THREE.AmbientLight(0xffffff, 2.0);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 2.0);
      directionalLight.position.set(5, 5, 5);
      scene.add(directionalLight);

      const frontLight = new THREE.DirectionalLight(0xffffff, 1.5);
      frontLight.position.set(0, 0, 10);
      scene.add(frontLight);

      const pointLight1 = new THREE.PointLight(0xffffff, 1.0);
      pointLight1.position.set(-5, 5, 5);
      scene.add(pointLight1);

      const pointLight2 = new THREE.PointLight(0xffffff, 1.0);
      pointLight2.position.set(5, 5, 5);
      scene.add(pointLight2);
    }

    // Load FBX model
    const loader = new FBXLoader();
    console.log('DirectHueModel: FBXLoader created:', loader);
    console.log('DirectHueModel: Starting FBX load from /models/hue.fbx');

    loader.load(
      '/models/hue.fbx',
      (object) => {
        console.log('DirectHueModel: FBX loaded successfully!', object);
        
        // Store reference to model
        modelRef.current = object;
        
        // Calculate bounding box to properly center and scale
        const box = new THREE.Box3().setFromObject(object);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        
        console.log('Model size:', size);
        console.log('Model center:', center);
        
        // Mobile-optimized scaling
        const maxDimension = Math.max(size.x, size.y, size.z);
        let scale;
        if (isMobile) {
          scale = 2.5 / maxDimension; // Slightly smaller scale for mobile
        } else {
          scale = 3.0 / maxDimension; // Desktop scale
        }
        object.scale.setScalar(scale);
        
        // Center the model perfectly - subtract the original center offset
        object.position.sub(center);
        
        // Mobile-specific positioning
        if (isMobile) {
          object.position.set(0, -0.8, 0); // Higher position for mobile
        } else {
          object.position.set(0, -1.2, 0); // Desktop position
        }
        
        // Face forward
        object.rotation.y = 0;
        
        // Mobile-optimized material setup
        object.traverse((child) => {
          if ((child as any).isMesh) {
            const mesh = child as THREE.Mesh;
            
            // Mobile-specific shadow settings
            if (!isMobile) {
              mesh.castShadow = true;
              mesh.receiveShadow = true;
            }
            
            // Ensure materials are properly configured
            if (mesh.material) {
              if (Array.isArray(mesh.material)) {
                mesh.material.forEach(mat => {
                  if (mat instanceof THREE.MeshStandardMaterial) {
                    // Mobile-optimized material settings
                    if (isMobile) {
                      mat.roughness = 0.5; // Slightly more rough for mobile
                      mat.metalness = 0.1; // Less metallic for mobile
                    }
                    mat.needsUpdate = true;
                  }
                });
              } else if (mesh.material instanceof THREE.MeshStandardMaterial) {
                if (isMobile) {
                  mesh.material.roughness = 0.5;
                  mesh.material.metalness = 0.1;
                }
                mesh.material.needsUpdate = true;
              }
            }
          }
        });
        
        scene.add(object);
        
        // Setup animation mixer
        if (object.animations && object.animations.length > 0) {
          console.log('DirectHueModel: Setting up animations...');
          mixerRef.current = new THREE.AnimationMixer(object);
          
          const action = mixerRef.current.clipAction(object.animations[0]);
          action.setLoop(THREE.LoopRepeat, Infinity);
          action.play();
          
          console.log('DirectHueModel: Animation started');
        }

        // Hide loading indicator once model is fully set up
        setIsLoading(false);

        // Try to load idle animation as fallback
        loader.load(
          '/models/hueidle.fbx',
          (idleObject) => {
            console.log('DirectHueModel: Idle animation loaded!', idleObject);
            if (idleObject.animations && idleObject.animations.length > 0 && mixerRef.current) {
              const idleAction = mixerRef.current.clipAction(idleObject.animations[0]);
              idleAction.setLoop(THREE.LoopRepeat, Infinity);
              idleAction.play();
              console.log('DirectHueModel: Idle animation playing');
            }
          },
          (progress) => console.log('Loading idle animation:', (progress.loaded / progress.total * 100) + '%'),
          (error) => console.log('Could not load idle animation (this is okay):', error)
        );
      },
      (progress) => {
        const percent = progress.total > 0 ? (progress.loaded / progress.total * 100) : 0;
        console.log('DirectHueModel: Loading progress:', percent + '%');
      },
      (error) => {
        console.error('DirectHueModel: Error loading FBX:', error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        
        // For mobile devices, be more lenient with errors
        if (isMobile) {
          console.log('DirectHueModel: Mobile device - using simplified fallback');
          setLoadError(null); // Don't show error on mobile, just use fallback
        } else {
          setLoadError(`Failed to load FBX model: ${errorMessage}`);
        }
        setIsLoading(false);
        
        // Show a fallback 3D shape
        console.log('DirectHueModel: Creating fallback 3D shape...');
        const geometry = isMobile ? 
          new THREE.SphereGeometry(1, 16, 16) : // Lower poly count for mobile
          new THREE.SphereGeometry(1, 32, 32);
        const material = new THREE.MeshStandardMaterial({ 
          color: isTalking ? 0x8B5CF6 : 0x4F46E5,
          roughness: isMobile ? 0.5 : 0.3,
          metalness: isMobile ? 0.1 : 0.1
        });
        const fallbackMesh = new THREE.Mesh(geometry, material);
        fallbackMesh.position.set(0, 0, 0);
        scene.add(fallbackMesh);
        modelRef.current = fallbackMesh;
        
        console.log('DirectHueModel: Fallback shape added to scene');
      }
    );

    // Mobile-optimized animation loop
    const clock = new THREE.Clock();
    let lastTime = 0;
    const targetFPS = isMobile ? 30 : 60; // Lower FPS for mobile
    const frameInterval = 1000 / targetFPS;
    
    const animate = (currentTime: number) => {
      frameRef.current = requestAnimationFrame(animate);

      // Throttle animation for mobile
      if (isMobile && currentTime - lastTime < frameInterval) {
        return;
      }
      lastTime = currentTime;

      const delta = clock.getDelta();

      // Update mixer
      if (mixerRef.current) {
        mixerRef.current.update(delta);
      }

      // Add subtle talking animation
      if (isTalking && modelRef.current) {
        const time = clock.getElapsedTime();
        // Gentle head bob when talking
        modelRef.current.rotation.y = Math.sin(time * 4) * 0.02;
        modelRef.current.rotation.x = Math.sin(time * 3) * 0.01;
      } else if (modelRef.current) {
        // Return to neutral position when not talking
        modelRef.current.rotation.y *= 0.95;
        modelRef.current.rotation.x *= 0.95;
      }

      // Render
      renderer.render(scene, camera);
    };
    animate(0);

    // Mobile-aware resize handler
    const handleResize = () => {
      if (mountRef.current && rendererRef.current) {
        const width = mountRef.current.offsetWidth;
        const height = mountRef.current.offsetHeight;
        
        // Update camera aspect ratio
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        
        // Update renderer size with mobile-optimized pixel ratio
        const pixelRatio = isMobile ? Math.min(window.devicePixelRatio, 2) : window.devicePixelRatio;
        rendererRef.current.setPixelRatio(pixelRatio);
        rendererRef.current.setSize(width, height);
        
        console.log('DirectHueModel: Resized for', isMobile ? 'mobile' : 'desktop', {
          width, height, pixelRatio
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      console.log('DirectHueModel: Cleaning up...');
      
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      
      if (rendererRef.current) {
        if (mountRef.current && rendererRef.current.domElement.parentNode === mountRef.current) {
          mountRef.current.removeChild(rendererRef.current.domElement);
        }
        rendererRef.current.dispose();
      }
      
      if (mixerRef.current) {
        mixerRef.current.stopAllAction();
        mixerRef.current = null;
      }

      if (sceneRef.current) {
        // Clean up scene objects
        sceneRef.current.clear();
        sceneRef.current = null;
      }

      modelRef.current = null;
      
      window.removeEventListener('resize', handleResize);
    };
  }, [isTalking]);

  return (
    <div 
      ref={mountRef} 
      className="w-full h-full relative flex items-center justify-center three-container"
      style={{ 
        background: 'transparent',
        zIndex: 9999,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {/* Loading indicator - only show while loading */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <div className="text-blue-600 text-sm font-medium">Loading Hue...</div>
            <div className="text-blue-400 text-xs mt-1">FBX Model</div>
          </div>
        </div>
      )}
      
      {/* Error indicator */}
      {loadError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 rounded-lg">
          <div className="text-center p-4">
            <div className="text-red-600 text-sm font-medium mb-2">Failed to load 3D Hue</div>
            <div className="text-red-400 text-xs mb-3">{loadError}</div>
            <button 
              onClick={() => {
                setLoadError(null);
                setIsLoading(true);
                // Trigger a reload by re-running the effect
                window.location.reload();
              }}
              className="px-3 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
