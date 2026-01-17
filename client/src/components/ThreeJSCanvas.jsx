import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { motion } from 'framer-motion';

const ThreeJSCanvas = ({ modelUrl, placeholder = false }) => {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    // Creating scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xf5f5f5);

    // Setting up camera
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    cameraRef.current = camera;
    camera.position.z = 5;

    // Setting up renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rendererRef.current = renderer;
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
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
    controls.enablePan = true;
    controls.enableZoom = true;

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7.5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);

    // Add a second directional light from the opposite direction
    const backLight = new THREE.DirectionalLight(0xffffff, 0.3);
    backLight.position.set(-5, 5, -5);
    scene.add(backLight);

    // Animation function
    const animate = () => {
      requestAnimationFrame(animate);
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      renderer.render(scene, camera);
    };

    // Start animation loop
    animate();

    if (placeholder) {
      // Add placeholder geometry
      const geometry = new THREE.BoxGeometry(2, 2, 2);
      const material = new THREE.MeshStandardMaterial({ color: 0x1E3A8A });
      const cube = new THREE.Mesh(geometry, material);
      cube.castShadow = true;
      cube.receiveShadow = true;
      scene.add(cube);

      // Animation for placeholder
      const rotateCube = () => {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
      };

      // Update animation loop
      renderer.setAnimationLoop(() => {
        rotateCube();
        renderer.render(scene, camera);
      });
    } else if (modelUrl) {
      setIsLoading(true);

      // Add a ground plane for shadow
      const planeGeometry = new THREE.PlaneGeometry(100, 100);
      const planeMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffff, 
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5
      });
      const plane = new THREE.Mesh(planeGeometry, planeMaterial);
      plane.rotation.x = Math.PI / 2;
      plane.position.y = -2;
      plane.receiveShadow = true;
      scene.add(plane);

      // Create OBJ loader
      const objLoader = new OBJLoader();
      console.log('Loading model from URL:', modelUrl);
      
      // Create a debug sphere to verify scene is rendering
      const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
      const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphere.position.set(0, 0, 0);
      scene.add(sphere);
      
      // Load the model
      objLoader.load(
        modelUrl,
        (object) => {
          console.log('Model loaded successfully:', object);
          // Remove debug sphere
          scene.remove(sphere);
          
          // Apply a default material to all meshes in the model
          object.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.material = new THREE.MeshStandardMaterial({
                color: 0xCCCCCC,
                metalness: 0.2,
                roughness: 0.7
              });
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });
          
          // Add model to the scene
          scene.add(object);
          
          // Calculate bounding box
          const box = new THREE.Box3().setFromObject(object);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          
          // Check if size is valid (not NaN)
          const maxDim = Math.max(size.x || 1, size.y || 1, size.z || 1);
          
          // Scale model to fit view
          const scale = 5 / maxDim;
          object.scale.set(scale, scale, scale);
          
          // Center model
          object.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
          
          setIsLoading(false);
          
          // Set camera position based on model
          camera.position.set(0, 2, 8);
          camera.lookAt(0, 0, 0);
          
          // Update controls to re-center
          controls.update();
        },
        (xhr) => {
          console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        },
        (error) => {
          console.error('An error happened while loading the model', error);
          setIsLoading(false);
        }
      );
    }

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;
      
      cameraRef.current.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (rendererRef.current) {
        if (rendererRef.current.domElement.parentElement) {
          rendererRef.current.domElement.parentElement.removeChild(rendererRef.current.domElement);
        }
        rendererRef.current.dispose();
      }
      
      // Dispose scene
      if (sceneRef.current) {
        sceneRef.current.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            if (object.geometry) {
              object.geometry.dispose();
            }
            
            if (object.material) {
              if (Array.isArray(object.material)) {
                object.material.forEach(material => material.dispose());
              } else {
                object.material.dispose();
              }
            }
          }
        });
      }
      
      renderer.setAnimationLoop(null);
    };
  }, [modelUrl, placeholder]);

  return (
    <motion.div 
      ref={mountRef} 
      className="w-full h-full rounded-lg overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      )}
    </motion.div>
  );
};

export default ThreeJSCanvas;