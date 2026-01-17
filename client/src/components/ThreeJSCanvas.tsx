import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';

// Add typescript declarations for missing modules
declare module 'three/examples/jsm/controls/OrbitControls' {
  export class OrbitControls {
    constructor(camera: THREE.Camera, domElement: HTMLElement);
    update(): void;
    enableDamping: boolean;
    dampingFactor: number;
    enableZoom: boolean;
  }
}

declare module 'three/examples/jsm/loaders/OBJLoader' {
  export class OBJLoader {
    constructor();
    load(
      url: string,
      onLoad: (object: THREE.Object3D) => void,
      onProgress?: (event: ProgressEvent) => void,
      onError?: (event: ErrorEvent) => void
    ): void;
  }
}

interface ThreeJSCanvasProps {
  modelUrl?: string;
  placeholder?: boolean;
}

const ThreeJSCanvas = ({ modelUrl, placeholder = false }: ThreeJSCanvasProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  
  // Setup and animation will be handled in this effect
  useEffect(() => {
    if (!mountRef.current) return;

    // Dynamically import the required modules
    const importModules = async () => {
      try {
        // Track whether the component is still mounted
        let isMounted = true;
        
        // Instead of dynamic imports that cause TS errors, use top-level imports
        // We're just using these type annotations for better type safety
        type OrbitControlsType = any;
        type OBJLoaderType = any;
        
        // Create placeholders for the modules we'll load
        let OrbitControls: OrbitControlsType;
        let OBJLoader: OBJLoaderType;
        
        // Load modules
        try {
          const OrbitControlsModule = await import('three/examples/jsm/controls/OrbitControls');
          const OBJLoaderModule = await import('three/examples/jsm/loaders/OBJLoader');
          
          OrbitControls = OrbitControlsModule.OrbitControls;
          OBJLoader = OBJLoaderModule.OBJLoader;
        } catch (e) {
          console.error("Failed to load Three.js modules:", e);
          // Fallback to global THREE if available
          OrbitControls = (window as any).THREE?.OrbitControls;
          OBJLoader = (window as any).THREE?.OBJLoader;
          
          if (!OrbitControls || !OBJLoader) {
            throw new Error("Required Three.js modules could not be loaded");
          }
        }
        
        // Create scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf0f0f0);
        
        // Ensure mountRef is still available
        if (!mountRef.current) {
          throw new Error("Mount element no longer available");
        }
        
        // Set up renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        
        // Clear previous canvas if any
        while (mountRef.current.firstChild) {
          mountRef.current.removeChild(mountRef.current.firstChild);
        }
        
        // Add renderer to DOM
        mountRef.current.appendChild(renderer.domElement);
        
        // Set up camera
        const camera = new THREE.PerspectiveCamera(
          45,
          mountRef.current.clientWidth / mountRef.current.clientHeight,
          0.1,
          1000
        );
        camera.position.z = 5;
        
        // Add orbital controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.1;
        controls.enableZoom = true;
        
        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 1);
        scene.add(directionalLight);
        
        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight2.position.set(-1, -1, -1);
        scene.add(directionalLight2);
        
        // Create and add grid helper
        const gridHelper = new THREE.GridHelper(10, 10);
        scene.add(gridHelper);
        
        // Animation loop
        const animate = () => {
          if (!isMounted) return;
          
          requestAnimationFrame(animate);
          controls.update();
          renderer.render(scene, camera);
        };
        
        // Handle placeholder display (cube)
        if (placeholder) {
          const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
          const boxMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x3366cc,
            specular: 0x111111, 
            shininess: 30 
          });
          
          const cube = new THREE.Mesh(boxGeometry, boxMaterial);
          scene.add(cube);
          
          // Rotate the cube continuously
          const rotateCube = () => {
            if (!isMounted) return;
            
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
            
            requestAnimationFrame(rotateCube);
          };
          
          rotateCube();
          animate();
        } 
        // Handle model loading
        else if (modelUrl) {
          setIsLoading(true);
          
          // Show a temporary placeholder while loading
          const geometry = new THREE.SphereGeometry(0.5, 16, 16);
          const material = new THREE.MeshBasicMaterial({ 
            color: 0x999999,
            wireframe: true
          });
          const loadingSphere = new THREE.Mesh(geometry, material);
          scene.add(loadingSphere);
          
          // Animate the loading sphere
          const rotateSphere = () => {
            if (!isMounted) return;
            
            loadingSphere.rotation.y += 0.02;
            requestAnimationFrame(rotateSphere);
          };
          
          rotateSphere();
          animate();
          
          // Load the model
          const loader = new OBJLoader();
          
          // Adjust path for model loading - try with and without leading slash
          const adjustedModelUrl = modelUrl.startsWith('/') 
            ? modelUrl.substring(1) // Remove leading slash if present
            : modelUrl;
          
          console.log('Loading 3D model from:', adjustedModelUrl);
          
          loader.load(
            adjustedModelUrl,
            // Success callback
            (object: THREE.Object3D) => {
              if (!isMounted) return;
              
              // Remove loading placeholder
              scene.remove(loadingSphere);
              
              // Calculate model size and center
              const box = new THREE.Box3().setFromObject(object);
              const size = box.getSize(new THREE.Vector3());
              const center = box.getCenter(new THREE.Vector3());
              
              // Scale model to fit the view
              const maxDimension = Math.max(size.x, size.y, size.z);
              const scale = 2 / maxDimension;
              object.scale.set(scale, scale, scale);
              
              // Center the model
              object.position.x = -center.x * scale;
              object.position.y = -center.y * scale;
              object.position.z = -center.z * scale;
              
              // Update material to be more visible
              object.traverse((child: THREE.Object3D) => {
                if (child instanceof THREE.Mesh) {
                  child.material = new THREE.MeshPhongMaterial({
                    color: 0xf5f5f5,
                    specular: 0x333333,
                    shininess: 30,
                    flatShading: true
                  });
                }
              });
              
              // Add to scene
              scene.add(object);
              
              // Add simple rotation
              const rotateModel = () => {
                if (!isMounted) return;
                
                object.rotation.y += 0.005;
                requestAnimationFrame(rotateModel);
              };
              
              rotateModel();
              setIsLoading(false);
            },
            // Progress callback
            (xhr: ProgressEvent) => {
              if (!isMounted) return;
              const total = xhr.total || 1; // Prevent division by zero
              console.log((xhr.loaded / total * 100) + '% loaded');
            },
            // Error callback
            (error: ErrorEvent) => {
              if (!isMounted) return;
              
              console.error('Error loading model:', error);
              console.error('Model URL that failed:', modelUrl);
              setLoadingError(`Failed to load the 3D model: ${modelUrl}. Please try again later.`);
              setIsLoading(false);
              
              // Remove loading sphere
              scene.remove(loadingSphere);
              
              // Add error indicator cube
              const errorGeometry = new THREE.BoxGeometry(1, 1, 1);
              const errorMaterial = new THREE.MeshBasicMaterial({ 
                color: 0xff0000,
                wireframe: true
              });
              
              const errorCube = new THREE.Mesh(errorGeometry, errorMaterial);
              scene.add(errorCube);
              
              // Rotate the error cube
              const rotateErrorCube = () => {
                if (!isMounted) return;
                
                errorCube.rotation.x += 0.01;
                errorCube.rotation.y += 0.01;
                
                requestAnimationFrame(rotateErrorCube);
              };
              
              rotateErrorCube();
            }
          );
        } 
        // No model URL, add a default scene
        else {
          // Create and add a torus knot
          const geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
          const material = new THREE.MeshPhongMaterial({ 
            color: 0x3366cc,
            specular: 0x111111,
            shininess: 30
          });
          
          const torusKnot = new THREE.Mesh(geometry, material);
          scene.add(torusKnot);
          
          // Rotate the torus knot continuously
          const rotateTorus = () => {
            if (!isMounted) return;
            
            torusKnot.rotation.x += 0.01;
            torusKnot.rotation.y += 0.01;
            
            requestAnimationFrame(rotateTorus);
          };
          
          rotateTorus();
          animate();
        }
        
        // Handle window resize
        const handleResize = () => {
          if (!mountRef.current || !isMounted) return;
          
          camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        };
        
        window.addEventListener('resize', handleResize);
        
        // Clean up on unmount
        return () => {
          isMounted = false;
          window.removeEventListener('resize', handleResize);
          
          // Dispose of scene resources
          renderer.dispose();
          
          // Remove DOM elements
          if (mountRef.current) {
            while (mountRef.current.firstChild) {
              mountRef.current.removeChild(mountRef.current.firstChild);
            }
          }
        };
      } catch (error) {
        console.error("Failed to load Three.js modules:", error);
        setLoadingError("Could not initialize 3D viewer. Please try again later.");
        setIsLoading(false);
      }
    };
    
    importModules();
  }, [modelUrl, placeholder]);
  
  return (
    <motion.div
      ref={mountRef}
      className="w-full h-full rounded-lg liquid-gradient-border relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/30 backdrop-blur-sm">
          <div className="bg-card p-4 rounded-lg shadow-lg">
            <div className="animate-spin h-8 w-8 border-4 liquid-gradient border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-sm text-center font-medium liquid-gradient">Loading 3D Model...</p>
          </div>
        </div>
      )}
      
      {loadingError && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/30 backdrop-blur-sm">
          <div className="bg-destructive/10 text-destructive p-4 rounded-md max-w-xs text-center">
            <p className="font-medium mb-1">Error Loading Model</p>
            <p className="text-sm">{loadingError}</p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ThreeJSCanvas;
