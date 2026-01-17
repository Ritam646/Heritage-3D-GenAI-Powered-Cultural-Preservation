import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { Button } from './ui/button';

/**
 * A component for rendering 3D OBJ models with Three.js
 */
const OBJModelViewer = ({ modelUrl }) => {
  const mountRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (!mountRef.current) return;
    
    console.log('Initializing 3D viewer with model:', modelUrl);
    
    let scene, camera, renderer, controls;
    let requestId = null;
    
    // Initialize basic Three.js setup
    const initThreeJS = () => {
      try {
        // Create scene
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf5f5f5);
        
        // Create camera
        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;
        camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.set(0, 0, 10); // Position camera a bit further back
        
        // Create renderer
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true;
        
        // Safely clear the container
        if (mountRef.current) {
          // Clear all children safely
          mountRef.current.innerHTML = '';
        }
        
        mountRef.current.appendChild(renderer.domElement);
        
        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        directionalLight.castShadow = true;
        scene.add(directionalLight);
        
        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight2.position.set(-5, -5, -5);
        scene.add(directionalLight2);
        
        // Add orbit controls
        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.25;
        controls.enableZoom = true;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.5;
        
        // Add a placeholder sphere to preview while loading
        const geometry = new THREE.SphereGeometry(1, 32, 32);
        const material = new THREE.MeshStandardMaterial({ 
          color: 0x808080,
          roughness: 0.7,
          metalness: 0.3,
          wireframe: true
        });
        const sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);
        
        // Add helpers for orientation
        const axesHelper = new THREE.AxesHelper(5);
        scene.add(axesHelper);
        
        const gridHelper = new THREE.GridHelper(10, 10);
        scene.add(gridHelper);
        
        // Animation loop for placeholder
        function animate() {
          requestId = requestAnimationFrame(animate);
          controls.update();
          renderer.render(scene, camera);
        }
        
        animate();
        
        console.log('Three.js setup complete');
        return true;
        
      } catch (err) {
        console.error('Error in Three.js setup:', err);
        setError(`WebGL initialization failed: ${err.message}`);
        setLoading(false);
        return false;
      }
    };
    
    // Successfully initialized Three.js
    if (initThreeJS()) {
      // Load model if URL provided
      if (modelUrl) {
        console.log(`Loading model from: ${modelUrl}`);
        
        try {
          const loader = new OBJLoader();
          
          // Construct the full URL if it's a relative path
          const fullModelUrl = modelUrl.startsWith('/') 
            ? window.location.origin + modelUrl 
            : modelUrl;
          
          console.log('Full model URL:', fullModelUrl);
          
          // Load the model
          loader.load(
            fullModelUrl,
            (object) => {
              try {
                console.log('Model loaded successfully, processing...', object);
                
                // Remove placeholder sphere
                scene.children = scene.children.filter(
                  child => !(child instanceof THREE.Mesh && child.geometry instanceof THREE.SphereGeometry)
                );
                
                // Get the bounding box of the loaded object
                const box = new THREE.Box3().setFromObject(object);
                if (box.isEmpty()) {
                  throw new Error('Model has no geometry or is empty');
                }
                
                const size = box.getSize(new THREE.Vector3());
                const center = box.getCenter(new THREE.Vector3());
                
                console.log('Model size:', size);
                console.log('Model center:', center);
                
                // Scale the object to fit the view
                const maxDim = Math.max(size.x, size.y, size.z);
                if (maxDim === 0 || !isFinite(maxDim)) {
                  throw new Error('Invalid model dimensions');
                }
                
                const scale = 5 / maxDim;
                object.scale.set(scale, scale, scale);
                
                // Center the object
                object.position.x = -center.x * scale;
                object.position.y = -center.y * scale;
                object.position.z = -center.z * scale;
                
                // Add the object to the scene
                scene.add(object);
                
                // Position camera to see the whole object
                const dist = Math.max(size.x, size.y, size.z) * 2;
                camera.position.set(0, 0, dist);
                camera.lookAt(0, 0, 0);
                
                setLoading(false);
                console.log('Model rendering complete');
                
              } catch (err) {
                console.error('Error processing loaded model:', err);
                setError(`Error processing model: ${err.message}`);
                setLoading(false);
              }
            },
            // Progress callback
            (xhr) => {
              if (xhr.lengthComputable) {
                const progress = Math.floor((xhr.loaded / xhr.total) * 100);
                console.log(`Loading progress: ${progress}%`);
                setLoadingProgress(progress);
              }
            },
            // Error callback
            (err) => {
              console.error('Error loading model:', err);
              setError(`Failed to load 3D model: ${err}`);
              setLoading(false);
            }
          );
        } catch (err) {
          console.error('Error initializing model loader:', err);
          setError(`Failed to initialize loader: ${err.message}`);
          setLoading(false);
        }
      } else {
        console.warn('No model URL provided');
        setError('No model URL provided');
        setLoading(false);
      }
    }
    
    // Handle window resize
    const handleResize = () => {
      if (!mountRef.current || !renderer || !camera) return;
      
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup function
    return () => {
      console.log('Cleaning up 3D viewer');
      window.removeEventListener('resize', handleResize);
      
      if (requestId) {
        cancelAnimationFrame(requestId);
      }
      
      if (controls) {
        controls.dispose();
      }
      
      if (renderer) {
        renderer.dispose();
        
        // Safe cleanup of DOM elements
        if (mountRef.current) {
          try {
            // Clear the container safely
            mountRef.current.innerHTML = '';
          } catch (e) {
            console.warn('Error cleaning up renderer container:', e);
          }
        }
      }
      
      // Clean up Three.js resources
      if (scene) {
        scene.clear();
      }
    };
  }, [modelUrl]);
  
  return (
    <div className="w-full h-full flex flex-col">
      <div 
        ref={mountRef} 
        className="w-full h-full flex-1 relative min-h-[300px]"
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <div className="flex flex-col items-center">
              <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mb-3"></div>
              <p className="text-sm font-medium mb-1">Loading 3D model...</p>
              {loadingProgress > 0 && (
                <p className="text-xs text-muted-foreground">{loadingProgress}% complete</p>
              )}
            </div>
          </div>
        )}
        
        {error && !loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/90 p-6">
            <div className="max-w-md w-full bg-card rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-destructive mb-3">
                Error Loading Model
              </h3>
              <p className="text-sm text-muted-foreground mb-4">{error}</p>
              <p className="text-xs text-muted-foreground mb-4">
                Try reloading the page or check the model file. (Details in browser console)
              </p>
              <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => window.location.reload()}
                >
                  Reload Page
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OBJModelViewer;