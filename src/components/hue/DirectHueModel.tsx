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

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = null; // Transparent background
    sceneRef.current = scene;

    // Camera setup - simple centered view
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.offsetWidth / mountRef.current.offsetHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 3);
    camera.lookAt(0, 0, 0);
    
    console.log('DirectHueModel: Camera setup:', {
      position: camera.position,
      aspect: camera.aspect,
      fov: camera.fov
    });

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true 
    });
    renderer.setSize(mountRef.current.offsetWidth, mountRef.current.offsetHeight);
    renderer.setClearColor(0x000000, 0); // Transparent background
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Enhanced lighting for better visibility
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

    // Load FBX model
    const loader = new FBXLoader();
    console.log('DirectHueModel: FBXLoader created:', loader);
    console.log('DirectHueModel: Starting FBX load from /models/hue.fbx');
    
    // Test if file is accessible first
    fetch('/models/hue.fbx', { method: 'HEAD' })
      .then(response => {
        console.log('DirectHueModel: FBX file accessibility test:', response.status, response.statusText);
      })
      .catch(error => {
        console.error('DirectHueModel: FBX file not accessible:', error);
      });

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
        
        // Scale based on the largest dimension to fit in view
        const maxDimension = Math.max(size.x, size.y, size.z);
        const scale = 2.5 / maxDimension; // Adjust this value to change model size
        object.scale.setScalar(scale);
        
        // Center the model
        object.position.sub(center.multiplyScalar(scale));
        object.position.y -= size.y * scale * 0.1; // Move it up slightly
        object.position.x -= 0.8; // Move it to the left
        
        // Face forward
        object.rotation.y = 0;
        
        // Ensure materials are properly set up
        object.traverse((child) => {
          if (child.isMesh) {
            const mesh = child as THREE.Mesh;
            
            // Enable shadows
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            
            // Ensure materials are properly configured
            if (mesh.material) {
              if (Array.isArray(mesh.material)) {
                mesh.material.forEach(mat => {
                  if (mat instanceof THREE.MeshStandardMaterial) {
                    mat.needsUpdate = true;
                  }
                });
              } else if (mesh.material instanceof THREE.MeshStandardMaterial) {
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
        setLoadError(`Failed to load FBX model: ${error.message || error}`);
        setIsLoading(false);
        
        // Show a fallback 3D shape
        console.log('DirectHueModel: Creating fallback 3D shape...');
        const geometry = new THREE.SphereGeometry(1, 32, 32);
        const material = new THREE.MeshStandardMaterial({ 
          color: isTalking ? 0x8B5CF6 : 0x4F46E5,
          roughness: 0.3,
          metalness: 0.1
        });
        const fallbackMesh = new THREE.Mesh(geometry, material);
        fallbackMesh.position.set(0, 0, 0);
        scene.add(fallbackMesh);
        modelRef.current = fallbackMesh;
        
        console.log('DirectHueModel: Fallback shape added to scene');
      }
    );

    // Animation loop
    const clock = new THREE.Clock();
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);

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
    animate();

    // Handle resize
    const handleResize = () => {
      if (mountRef.current && rendererRef.current) {
        const width = mountRef.current.offsetWidth;
        const height = mountRef.current.offsetHeight;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        
        rendererRef.current.setSize(width, height);
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
      className="w-full h-full relative flex items-center justify-center"
      style={{ 
        background: 'transparent',
        zIndex: 9999,
        position: 'relative'
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
