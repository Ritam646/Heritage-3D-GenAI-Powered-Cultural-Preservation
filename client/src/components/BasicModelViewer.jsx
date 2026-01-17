import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Button } from './ui/button';
import { Loader2, RotateCw } from 'lucide-react';

const BasicModelViewer = ({ modelName }) => {
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const frameIdRef = useRef(null);

  // Setup function
  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Main setup
    const setup = () => {
      try {
        console.log('Setting up basic 3D viewer for:', modelName);
        
        // Create scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf0f0f0);
        sceneRef.current = scene;
        
        // Create camera
        const camera = new THREE.PerspectiveCamera(
          45, 
          canvasRef.current.clientWidth / canvasRef.current.clientHeight, 
          0.1, 
          1000
        );
        camera.position.z = 5;
        cameraRef.current = camera;
        
        // Create renderer
        const renderer = new THREE.WebGLRenderer({ 
          canvas: canvasRef.current,
          antialias: true 
        });
        renderer.setSize(
          canvasRef.current.clientWidth, 
          canvasRef.current.clientHeight
        );
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        rendererRef.current = renderer;
        
        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);
        
        // Add controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 1;
        controlsRef.current = controls;
        
        // Create model based on name
        createModel(scene, modelName);
        
        // Start animation
        const animate = () => {
          frameIdRef.current = requestAnimationFrame(animate);
          controls.update();
          renderer.render(scene, camera);
        };
        
        animate();
        setLoading(false);
        
        return true;
      } catch (err) {
        console.error('Error setting up 3D viewer:', err);
        setError(`Failed to setup 3D viewer: ${err.message}`);
        setLoading(false);
        return false;
      }
    };
    
    // Create appropriate model
    const createModel = (scene, modelName) => {
      if (modelName.toLowerCase().includes('taj') || modelName.toLowerCase().includes('mahal')) {
        createTajMahal(scene);
      } else if (modelName.toLowerCase().includes('qutub') || modelName.toLowerCase().includes('minar')) {
        createQutubMinar(scene);
      } else {
        createGenericMonument(scene);
      }
      
      // Add ground
      const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(10, 10),
        new THREE.MeshStandardMaterial({ 
          color: 0xeeeeee,
          roughness: 0.9
        })
      );
      ground.rotation.x = -Math.PI / 2;
      ground.position.y = -1.5;
      scene.add(ground);
    };
    
    // Create Taj Mahal simplified model
    const createTajMahal = (scene) => {
      // Main dome
      const dome = new THREE.Mesh(
        new THREE.SphereGeometry(0.8, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2),
        new THREE.MeshStandardMaterial({ 
          color: 0xffffff,
          roughness: 0.3
        })
      );
      dome.position.y = 0.8;
      scene.add(dome);
      
      // Dome spike
      const spike = new THREE.Mesh(
        new THREE.ConeGeometry(0.1, 0.5, 16),
        new THREE.MeshStandardMaterial({ 
          color: 0xffd700,
          metalness: 0.8
        })
      );
      spike.position.y = 1.5;
      scene.add(spike);
      
      // Base structure
      const base = new THREE.Mesh(
        new THREE.BoxGeometry(2, 0.8, 2),
        new THREE.MeshStandardMaterial({ 
          color: 0xffffff,
          roughness: 0.5
        })
      );
      base.position.y = -0.4;
      scene.add(base);
      
      // Small domes
      const createSmallDome = (x, z) => {
        const smallDome = new THREE.Mesh(
          new THREE.SphereGeometry(0.2, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2),
          new THREE.MeshStandardMaterial({ 
            color: 0xffffff,
            roughness: 0.3
          })
        );
        smallDome.position.set(x, 0.2, z);
        scene.add(smallDome);
      };
      
      createSmallDome(0.7, 0.7);
      createSmallDome(-0.7, 0.7);
      createSmallDome(0.7, -0.7);
      createSmallDome(-0.7, -0.7);
    };
    
    // Create Qutub Minar simplified model
    const createQutubMinar = (scene) => {
      // Main tower
      const tower = new THREE.Mesh(
        new THREE.CylinderGeometry(0.3, 0.6, 3, 32),
        new THREE.MeshStandardMaterial({ 
          color: 0xbb6633,
          roughness: 0.7
        })
      );
      tower.position.y = 0;
      scene.add(tower);
      
      // Top section
      const top = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.3, 0.5, 32),
        new THREE.MeshStandardMaterial({ 
          color: 0xaa5522,
          roughness: 0.6
        })
      );
      top.position.y = 1.75;
      scene.add(top);
      
      // Base
      const base = new THREE.Mesh(
        new THREE.CylinderGeometry(0.8, 0.9, 0.4, 32),
        new THREE.MeshStandardMaterial({ 
          color: 0xcc7744,
          roughness: 0.8
        })
      );
      base.position.y = -1.5;
      scene.add(base);
      
      // Add texture details (rings)
      for (let i = 0; i < 5; i++) {
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(0.45 - (i * 0.05), 0.05, 8, 24),
          new THREE.MeshStandardMaterial({ 
            color: 0x995522,
            roughness: 0.5
          })
        );
        ring.position.y = -1 + (i * 0.5);
        ring.rotation.x = Math.PI / 2;
        scene.add(ring);
      }
    };
    
    // Create generic monument
    const createGenericMonument = (scene) => {
      const monument = new THREE.Mesh(
        new THREE.BoxGeometry(1.5, 2, 1.5),
        new THREE.MeshStandardMaterial({ 
          color: 0xcccccc,
          roughness: 0.7
        })
      );
      monument.position.y = 0;
      scene.add(monument);
      
      // Add top
      const top = new THREE.Mesh(
        new THREE.ConeGeometry(1, 1, 4),
        new THREE.MeshStandardMaterial({ 
          color: 0xdddddd,
          roughness: 0.6
        })
      );
      top.position.y = 1.5;
      scene.add(top);
    };
    
    const handleResize = () => {
      if (!canvasRef.current || !cameraRef.current || !rendererRef.current) return;
      
      const width = canvasRef.current.clientWidth;
      const height = canvasRef.current.clientHeight;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      
      rendererRef.current.setSize(width, height);
    };
    
    // Resize handling
    window.addEventListener('resize', handleResize);
    
    // Start setup
    setup();
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
      
      if (controlsRef.current) {
        controlsRef.current.dispose();
      }
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      
      if (sceneRef.current) {
        // Clear all objects from scene
        while(sceneRef.current.children.length > 0) { 
          sceneRef.current.remove(sceneRef.current.children[0]); 
        }
      }
    };
  }, [modelName]);
  
  return (
    <div className="relative w-full h-full min-h-[300px]">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: loading || error ? 'none' : 'block' }}
      />
      
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <p className="text-sm text-foreground">Building 3D preview...</p>
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
  );
};

export default BasicModelViewer;