import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

const models = [
  {
    id: 1,
    name: "Taj Mahal",
    description: "Built by Emperor Shah Jahan in memory of his wife Mumtaz Mahal.",
    modelUrl: "/models/Tajmahal_model_2.obj"
  },
  {
    id: 2,
    name: "Qutub Minar",
    description: "A soaring 73-meter minaret built in the early 13th century.",
    modelUrl: "/models/Qutub_Minar_3d_Model.obj"
  }
];

function ModelViewerTest() {
  const [selectedModel, setSelectedModel] = useState(null);
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  // Setup scene, camera, renderer
  useEffect(() => {
    if (!mountRef.current) return;

    // Create scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xf5f5f5);

    // Create camera
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    cameraRef.current = camera;
    camera.position.z = 5;

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    rendererRef.current = renderer;
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    
    // Clear previous canvas if any
    if (mountRef.current.firstChild) {
      mountRef.current.removeChild(mountRef.current.firstChild);
    }
    
    mountRef.current.appendChild(renderer.domElement);

    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7.5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Add a ground plane for shadow
    const planeGeometry = new THREE.PlaneGeometry(100, 100);
    const planeMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xeeeeee, 
      side: THREE.DoubleSide,
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = Math.PI / 2;
    plane.position.y = -2;
    plane.receiveShadow = true;
    scene.add(plane);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;
      
      cameraRef.current.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup - improved to fully dispose of Three.js resources
    return () => {
      window.removeEventListener('resize', handleResize);
      
      // Stop animation loop
      if (rendererRef.current) {
        rendererRef.current.setAnimationLoop(null);
      }
      
      // Dispose all meshes, materials, and geometries
      if (sceneRef.current) {
        // First, remove all objects
        while(sceneRef.current.children.length > 0) { 
          const object = sceneRef.current.children[0];
          
          // Recursively dispose resources
          if (object instanceof THREE.Mesh) {
            if (object.geometry) object.geometry.dispose();
            
            if (object.material) {
              if (Array.isArray(object.material)) {
                object.material.forEach(material => {
                  Object.keys(material).forEach(prop => {
                    if (material[prop] && material[prop].dispose) {
                      material[prop].dispose();
                    }
                  });
                  material.dispose();
                });
              } else {
                // Only dispose of maps/textures
                if (object.material.map) object.material.map.dispose();
                if (object.material.lightMap) object.material.lightMap.dispose();
                if (object.material.bumpMap) object.material.bumpMap.dispose();
                if (object.material.normalMap) object.material.normalMap.dispose();
                if (object.material.specularMap) object.material.specularMap.dispose();
                if (object.material.envMap) object.material.envMap.dispose();
                object.material.dispose();
              }
            }
          }
          
          sceneRef.current.remove(object);
        }
      }
      
      // Dispose renderer
      if (rendererRef.current) {
        if (rendererRef.current.domElement.parentElement) {
          rendererRef.current.domElement.parentElement.removeChild(rendererRef.current.domElement);
        }
        rendererRef.current.dispose();
        rendererRef.current = null;
      }
      
      // Clear references
      if (controlsRef.current) {
        controlsRef.current.dispose();
        controlsRef.current = null;
      }
      
      cameraRef.current = null;
      sceneRef.current = null;
    };
  }, []);

  // Cache to store loaded models
  const [modelCache, setModelCache] = useState({});

  // Load model when selected model changes
  useEffect(() => {
    if (!selectedModel || !sceneRef.current) return;
    
    setIsLoading(true);
    
    // Completely clear previous models from scene
    // Find and remove all model objects
    const modelsToRemove = [];
    sceneRef.current.traverse((object) => {
      if (object.userData && object.userData.isModel) {
        modelsToRemove.push(object);
      }
    });
    
    // Remove all found models
    modelsToRemove.forEach(object => {
      // Dispose materials and geometries
      if (object instanceof THREE.Mesh) {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      }
      // Remove from scene
      object.parent.remove(object);
    });

    // Check if we have this model in cache
    if (modelCache[selectedModel.id]) {
      try {
        // Use cached model - make a proper deep clone
        const cachedObject = modelCache[selectedModel.id].clone();
        
        // Make sure the clone is properly marked as a model
        cachedObject.userData.isModel = true;
        
        // Also ensure all children of the clone have the proper materials
        cachedObject.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            // Ensure the child is also marked for proper cleanup
            child.userData.isModel = true;
          }
        });
        
        sceneRef.current.add(cachedObject);
        setIsLoading(false);
        
        // Reset camera
        if (cameraRef.current) {
          cameraRef.current.position.set(0, 2, 8);
          cameraRef.current.lookAt(0, 0, 0);
          if (controlsRef.current) controlsRef.current.update();
        }
        return;
      } catch (err) {
        console.error("Error using cached model:", err);
        // If there's an error with the cached model, continue to load it again
      }
    }
    
    // Create OBJ loader with appropriate error handling
    const objLoader = new OBJLoader();
    
    try {
      // Load the model
      objLoader.load(
        selectedModel.modelUrl,
        (object) => {
          try {
            // Center the model
            const box = new THREE.Box3().setFromObject(object);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            
            // Normalize size
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 5 / maxDim;
            object.scale.set(scale, scale, scale);
            
            // Center model
            object.position.sub(center.multiplyScalar(scale));
            
            // Mark as model for cleanup
            object.userData.isModel = true;
            
            // Set material for the model if it doesn't have one
            object.traverse((child) => {
              if (child instanceof THREE.Mesh) {
                if (!child.material) {
                  child.material = new THREE.MeshStandardMaterial({
                    color: 0xD1D5DB,
                    metalness: 0.1,
                    roughness: 0.8
                  });
                }
                child.castShadow = true;
                child.receiveShadow = true;
              }
            });
            
            // Add to scene and cache
            sceneRef.current.add(object);
            setModelCache(prev => ({
              ...prev,
              [selectedModel.id]: object.clone()
            }));
            
            setIsLoading(false);
            
            // Reset camera position
            if (cameraRef.current) {
              cameraRef.current.position.set(0, 2, 8);
              cameraRef.current.lookAt(0, 0, 0);
            }
            
            // Update controls
            if (controlsRef.current) {
              controlsRef.current.update();
            }
          } catch (err) {
            console.error('Error processing loaded model:', err);
            setIsLoading(false);
          }
        },
        (xhr) => {
          // Only log every 10% to reduce console spam
          if (Math.round((xhr.loaded / xhr.total) * 100) % 10 === 0) {
            console.log(`${Math.round((xhr.loaded / xhr.total) * 100)}% loaded`);
          }
        },
        (error) => {
          console.error('Error loading model:', error);
          setIsLoading(false);
        }
      );
    } catch (err) {
      console.error('Fatal error loading model:', err);
      setIsLoading(false);
    }
  }, [selectedModel, modelCache]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">3D Monument Viewer</h1>
      
      <div className="flex gap-4 mb-6">
        {models.map(model => (
          <Button 
            key={model.id}
            onClick={() => setSelectedModel(model)}
            variant={selectedModel?.id === model.id ? "default" : "outline"}
          >
            {model.name}
          </Button>
        ))}
      </div>
      
      <div className="w-full h-[600px] bg-muted rounded-lg overflow-hidden relative">
        <div ref={mountRef} className="w-full h-full"></div>
        
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        )}
      </div>
      
      <div className="mt-4">
        {selectedModel ? (
          <div>
            <h2 className="text-xl font-semibold">{selectedModel.name}</h2>
            <p className="text-muted-foreground">{selectedModel.description}</p>
            
            <div className="mt-2 text-sm text-muted-foreground">
              <p>You can interact with the model using your mouse:</p>
              <ul className="list-disc ml-6 mt-1">
                <li>Left click + drag: Rotate the model</li>
                <li>Right click + drag: Pan the view</li>
                <li>Scroll: Zoom in/out</li>
              </ul>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground">Select a monument above to view its 3D model</p>
        )}
      </div>
    </div>
  );
}

export default ModelViewerTest;