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

function SimpleModelViewer() {
  const [selectedModel, setSelectedModel] = useState(null);
  const canvasRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const activeModelRef = useRef(null);
  
  // Initialize Three.js scene
  useEffect(() => {
    // Create scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xf5f5f5);
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(
      75, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000
    );
    cameraRef.current = camera;
    camera.position.set(0, 2, 8);
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    rendererRef.current = renderer;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    
    // Append to DOM
    canvasRef.current.innerHTML = '';
    canvasRef.current.appendChild(renderer.domElement);
    
    // Add controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7.5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    // Add a ground plane
    const planeGeometry = new THREE.PlaneGeometry(100, 100);
    const planeMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xeeeeee, 
      side: THREE.DoubleSide
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = Math.PI / 2;
    plane.position.y = -2;
    plane.receiveShadow = true;
    scene.add(plane);
    
    // Handle resize
    const handleResize = () => {
      if (!canvasRef.current) return;
      
      const width = canvasRef.current.clientWidth;
      const height = canvasRef.current.clientHeight;
      
      if (cameraRef.current) {
        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();
      }
      
      if (rendererRef.current) {
        rendererRef.current.setSize(width, height);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      renderer.render(scene, camera);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, []);
  
  // Load model when selection changes
  useEffect(() => {
    if (!selectedModel || !sceneRef.current) return;
    
    setIsLoading(true);
    
    // Remove previous model if exists
    if (activeModelRef.current) {
      sceneRef.current.remove(activeModelRef.current);
      activeModelRef.current = null;
    }
    
    // Create loader
    const objLoader = new OBJLoader();
    
    // Load model
    objLoader.load(
      selectedModel.modelUrl,
      (object) => {
        // Center model
        const box = new THREE.Box3().setFromObject(object);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 5 / maxDim;
        
        object.scale.set(scale, scale, scale);
        object.position.sub(center.multiplyScalar(scale));
        
        // Set materials
        object.traverse(child => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            
            if (!child.material) {
              child.material = new THREE.MeshStandardMaterial({
                color: 0xD1D5DB,
                metalness: 0.1,
                roughness: 0.8
              });
            }
          }
        });
        
        // Add to scene
        sceneRef.current.add(object);
        activeModelRef.current = object;
        
        // Reset camera
        if (cameraRef.current) {
          cameraRef.current.position.set(0, 2, 8);
          cameraRef.current.lookAt(0, 0, 0);
        }
        
        setIsLoading(false);
      },
      (xhr) => {
        // Loading progress
        if (Math.round((xhr.loaded / xhr.total) * 100) % 10 === 0) {
          console.log(`${Math.round((xhr.loaded / xhr.total) * 100)}% loaded`);
        }
      },
      (error) => {
        console.error('Error loading model:', error);
        setIsLoading(false);
      }
    );
  }, [selectedModel]);
  
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
        <div ref={canvasRef} className="w-full h-full"></div>
        
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

export default SimpleModelViewer;