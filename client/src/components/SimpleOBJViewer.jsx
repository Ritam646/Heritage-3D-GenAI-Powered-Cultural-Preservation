import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Button } from './ui/button';
import { Loader2, RotateCw } from 'lucide-react';

/**
 * A simpler 3D model viewer that displays a basic 3D shape
 * representing the monument as a placeholder
 */
const SimpleOBJViewer = ({ modelName }) => {
  const mountRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (!mountRef.current) return;
    
    console.log('Initializing simple 3D viewer for:', modelName);
    let scene, camera, renderer, controls;
    let requestId = null;
    
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);
    
    // Create camera
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;
    camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 5;
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    
    // Clear container
    if (mountRef.current) {
      mountRef.current.innerHTML = '';
    }
    
    mountRef.current.appendChild(renderer.domElement);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
    directionalLight2.position.set(-5, -5, -5);
    scene.add(directionalLight2);
    
    // Add controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1;
    
    // Create appropriate geometry based on model name
    let geometry, material, mesh;
    
    // Create different geometries based on the monument name
    if (modelName.toLowerCase().includes('taj') || modelName.toLowerCase().includes('mahal')) {
      // For Taj Mahal, create a dome-like structure
      geometry = new THREE.ConeGeometry(1, 2, 32);
      material = new THREE.MeshStandardMaterial({ 
        color: 0xffffff, 
        metalness: 0.2,
        roughness: 0.3
      });
      mesh = new THREE.Mesh(geometry, material);
      mesh.position.y = 0.25;
      scene.add(mesh);
      
      // Add base
      const baseGeometry = new THREE.BoxGeometry(2, 0.5, 2);
      const baseMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xf5f5f5, 
        metalness: 0,
        roughness: 0.5
      });
      const base = new THREE.Mesh(baseGeometry, baseMaterial);
      base.position.y = -0.75;
      scene.add(base);
      
    } else if (modelName.toLowerCase().includes('qutub') || modelName.toLowerCase().includes('minar')) {
      // For Qutub Minar, create a tower-like structure
      geometry = new THREE.CylinderGeometry(0.5, 0.8, 3, 32);
      material = new THREE.MeshStandardMaterial({ 
        color: 0xbb6633, 
        metalness: 0.1,
        roughness: 0.8
      });
      mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
      
    } else {
      // Default shape for other monuments
      geometry = new THREE.BoxGeometry(2, 2, 2);
      material = new THREE.MeshStandardMaterial({ 
        color: 0xaaaaaa,
        wireframe: true
      });
      mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
    }
    
    // Add a ground plane
    const groundGeometry = new THREE.PlaneGeometry(10, 10);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xeeeeee,
      roughness: 1,
      metalness: 0
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1.75;
    ground.receiveShadow = true;
    scene.add(ground);
    
    // Animation loop
    function animate() {
      requestId = requestAnimationFrame(animate);
      if (controls) controls.update();
      if (renderer && scene && camera) renderer.render(scene, camera);
    }
    
    animate();
    setLoading(false);
    
    // Handle window resize
    const handleResize = () => {
      if (!mountRef.current) return;
      
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (requestId) {
        cancelAnimationFrame(requestId);
      }
      
      if (controls) {
        controls.dispose();
      }
      
      if (renderer) {
        renderer.dispose();
      }
      
      if (mountRef.current) {
        mountRef.current.innerHTML = '';
      }
    };
  }, [modelName]);
  
  return (
    <div className="w-full h-full">
      <div 
        ref={mountRef} 
        className="w-full h-full min-h-[300px] relative"
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
              <p className="text-sm text-foreground">Loading preview...</p>
            </div>
          </div>
        )}
        
        {error && !loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/90 p-4">
            <p className="text-sm text-destructive mb-2">{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={() => window.location.reload()}
            >
              <RotateCw className="h-4 w-4" />
              Reload
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleOBJViewer;