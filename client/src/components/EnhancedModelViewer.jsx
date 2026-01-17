import React, { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Button } from './ui/button';
import { Loader2, RotateCw, Download, Share2, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

const EnhancedModelViewer = ({ modelName }) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Animation and control states
  const [isRotating, setIsRotating] = useState(true);
  const [viewMode, setViewMode] = useState('3d'); // '3d', 'top', 'side', 'front'
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const animationRef = useRef(null);

  // Model loading state
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [modelDetails, setModelDetails] = useState(null);
  
  // Setup scene and model
  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    // Setup loading simulation
    const simulateLoading = () => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 10) + 1;
        if (progress > 100) {
          progress = 100;
          clearInterval(interval);
          
          // After "loading" add slight delay for UX
          setTimeout(() => {
            initScene();
          }, 500);
        }
        setLoadingProgress(progress);
      }, 200);
    };
    
    // Simulate loading progress
    simulateLoading();
    
    // Initialize 3D scene
    const initScene = () => {
      try {
        // Scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf7f7f7);
        sceneRef.current = scene;
        
        // Add subtle fog for depth
        scene.fog = new THREE.FogExp2(0xf7f7f7, 0.035);
        
        // Camera 
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.set(0, 2, 8);
        cameraRef.current = camera;
        
        // Renderer
        const renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        rendererRef.current = renderer;
        
        // Clear container and append renderer
        if (canvasRef.current) {
          canvasRef.current.appendChild(renderer.domElement);
        }
        
        // Lighting
        setupLighting(scene);
        
        // Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.rotateSpeed = 0.7;
        controls.autoRotate = isRotating;
        controls.autoRotateSpeed = 2.0;
        controls.minDistance = 3;
        controls.maxDistance = 20;
        controls.enablePan = false;
        controlsRef.current = controls;
        
        // Environment
        createEnvironment(scene);
        
        // Create specified model
        createModel(scene, modelName);
        
        // Animation loop
        const animate = () => {
          animationRef.current = requestAnimationFrame(animate);
          
          // Update controls
          if (controlsRef.current) {
            controlsRef.current.update();
          }
          
          // Model-specific animations
          animateModel();
          
          // Render scene
          renderer.render(scene, camera);
        };
        
        // Start animation
        animate();
        
        // Handle window resize
        const handleResize = () => {
          if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
          
          const width = containerRef.current.clientWidth;
          const height = containerRef.current.clientHeight;
          
          cameraRef.current.aspect = width / height;
          cameraRef.current.updateProjectionMatrix();
          
          rendererRef.current.setSize(width, height);
        };
        
        window.addEventListener('resize', handleResize);
        
        // Set loading state to false
        setLoading(false);
        
        // Return cleanup function
        return () => {
          window.removeEventListener('resize', handleResize);
          
          if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
          }
          
          if (controlsRef.current) {
            controlsRef.current.dispose();
          }
          
          if (rendererRef.current) {
            rendererRef.current.dispose();
          }
          
          if (canvasRef.current && rendererRef.current) {
            try {
              canvasRef.current.removeChild(rendererRef.current.domElement);
            } catch (e) {
              console.warn('Error cleaning up renderer:', e);
            }
          }
        };
      } catch (err) {
        console.error('Error initializing 3D viewer:', err);
        setError('Failed to initialize 3D viewer: ' + err.message);
        setLoading(false);
      }
    };
    
    // Setup lighting for the scene
    const setupLighting = (scene) => {
      // Ambient light for general illumination
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);
      
      // Directional main light with shadows
      const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
      mainLight.position.set(5, 10, 7);
      mainLight.castShadow = true;
      mainLight.shadow.mapSize.width = 1024;
      mainLight.shadow.mapSize.height = 1024;
      mainLight.shadow.camera.near = 0.5;
      mainLight.shadow.camera.far = 50;
      mainLight.shadow.camera.left = -10;
      mainLight.shadow.camera.right = 10;
      mainLight.shadow.camera.top = 10;
      mainLight.shadow.camera.bottom = -10;
      scene.add(mainLight);
      
      // Softer fill light from opposite direction
      const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
      fillLight.position.set(-5, 5, -5);
      scene.add(fillLight);
      
      // Soft rim light for edge highlighting
      const rimLight = new THREE.DirectionalLight(0xffffff, 0.2);
      rimLight.position.set(0, -5, 0);
      scene.add(rimLight);
    };
    
    // Create environment elements (ground, sky, etc.)
    const createEnvironment = (scene) => {
      // Ground plane
      const groundGeometry = new THREE.CircleGeometry(20, 32);
      const groundMaterial = new THREE.MeshStandardMaterial({
        color: 0xeeeeee,
        roughness: 0.8,
        metalness: 0.1,
      });
      const ground = new THREE.Mesh(groundGeometry, groundMaterial);
      ground.rotation.x = -Math.PI / 2;
      ground.position.y = -1.5;
      ground.receiveShadow = true;
      scene.add(ground);
      
      // Subtle grid for scale reference
      const gridHelper = new THREE.GridHelper(40, 40, 0xaaaaaa, 0xdddddd);
      gridHelper.position.y = -1.49;
      gridHelper.material.opacity = 0.15;
      gridHelper.material.transparent = true;
      scene.add(gridHelper);
    };
    
    // Create the appropriate model based on name
    const createModel = (scene, modelName) => {
      const lowerName = modelName?.toLowerCase() || '';
      
      // Choose the appropriate model creation function
      if (lowerName.includes('taj') || lowerName.includes('mahal')) {
        createTajMahal(scene);
        setModelDetails({
          name: 'Taj Mahal',
          location: 'Agra, Uttar Pradesh, India',
          year: '1632-1653',
          style: 'Mughal Architecture',
          description: 'An ivory-white marble mausoleum on the right bank of the river Yamuna, commissioned by Mughal emperor Shah Jahan.'
        });
      } else if (lowerName.includes('qutub') || lowerName.includes('minar')) {
        createQutubMinar(scene);
        setModelDetails({
          name: 'Qutub Minar',
          location: 'Delhi, India',
          year: '1192-1220',
          style: 'Indo-Islamic Architecture',
          description: 'A 73-meter tall minaret built by Qutb al-Din Aibak, founder of the Delhi Sultanate.'
        });
      } else {
        // Generic model for other names
        createGenericMonument(scene, modelName);
        setModelDetails({
          name: modelName || 'Heritage Monument',
          location: 'India',
          year: 'Unknown',
          style: 'Traditional Architecture',
          description: 'A magnificent historical monument symbolizing India\'s rich cultural heritage.'
        });
      }
    };
    
    // Create Taj Mahal model
    const createTajMahal = (scene) => {
      // Main dome
      const domeGeometry = new THREE.SphereGeometry(1, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
      const domeMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xfffaf0, 
        roughness: 0.3,
        metalness: 0.1
      });
      const dome = new THREE.Mesh(domeGeometry, domeMaterial);
      dome.position.set(0, 1.5, 0);
      dome.castShadow = true;
      scene.add(dome);
      
      // Dome finial/spire
      const spireGeometry = new THREE.CylinderGeometry(0.05, 0.02, 0.5, 8);
      const spireMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffd700, 
        roughness: 0.2,
        metalness: 0.8
      });
      const spire = new THREE.Mesh(spireGeometry, spireMaterial);
      spire.position.set(0, 2.25, 0);
      spire.castShadow = true;
      scene.add(spire);
      
      // Main base (platform)
      const baseGeometry = new THREE.BoxGeometry(4, 0.5, 4);
      const baseMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xfffaf0, 
        roughness: 0.5,
        metalness: 0
      });
      const base = new THREE.Mesh(baseGeometry, baseMaterial);
      base.position.set(0, -1, 0);
      base.castShadow = true;
      base.receiveShadow = true;
      scene.add(base);
      
      // Main structure below dome
      const structureGeometry = new THREE.BoxGeometry(2.5, 2, 2.5);
      const structureMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xfffaf0, 
        roughness: 0.4,
        metalness: 0.1
      });
      const structure = new THREE.Mesh(structureGeometry, structureMaterial);
      structure.position.set(0, 0, 0);
      structure.castShadow = true;
      structure.receiveShadow = true;
      scene.add(structure);
      
      // Create minarets at corners
      const createMinaret = (x, z) => {
        const minaretGroup = new THREE.Group();
        
        // Minaret body
        const minaretGeometry = new THREE.CylinderGeometry(0.2, 0.25, 3, 16);
        const minaretMaterial = new THREE.MeshStandardMaterial({ 
          color: 0xfffaf0, 
          roughness: 0.4,
          metalness: 0
        });
        const minaret = new THREE.Mesh(minaretGeometry, minaretMaterial);
        minaret.castShadow = true;
        minaretGroup.add(minaret);
        
        // Minaret top
        const topGeometry = new THREE.ConeGeometry(0.25, 0.5, 16);
        const topMaterial = new THREE.MeshStandardMaterial({ 
          color: 0xfffaf0, 
          roughness: 0.3,
          metalness: 0.1
        });
        const top = new THREE.Mesh(topGeometry, topMaterial);
        top.position.y = 1.75;
        top.castShadow = true;
        minaretGroup.add(top);
        
        // Position the minaret group
        minaretGroup.position.set(x, -0.25, z);
        scene.add(minaretGroup);
      };
      
      // Add minarets at each corner
      createMinaret(1.75, 1.75);
      createMinaret(-1.75, 1.75);
      createMinaret(1.75, -1.75);
      createMinaret(-1.75, -1.75);
      
      // Small decorative domes
      const createSmallDome = (x, z) => {
        const smallDomeGeometry = new THREE.SphereGeometry(0.2, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
        const smallDomeMaterial = new THREE.MeshStandardMaterial({ 
          color: 0xfffaf0, 
          roughness: 0.3,
          metalness: 0.1
        });
        const smallDome = new THREE.Mesh(smallDomeGeometry, smallDomeMaterial);
        smallDome.position.set(x, 1.25, z);
        smallDome.castShadow = true;
        scene.add(smallDome);
      };
      
      // Add small domes
      createSmallDome(0.75, 0.75);
      createSmallDome(-0.75, 0.75);
      createSmallDome(0.75, -0.75);
      createSmallDome(-0.75, -0.75);
      
      // Position camera to view the monument
      if (cameraRef.current) {
        cameraRef.current.position.set(0, 2, 8);
        cameraRef.current.lookAt(0, 0, 0);
      }
    };
    
    // Create Qutub Minar model
    const createQutubMinar = (scene) => {
      const towerGroup = new THREE.Group();
      
      // Base section
      const baseGeometry = new THREE.CylinderGeometry(0.9, 1.1, 1, 32);
      const baseMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xbb6633, 
        roughness: 0.7,
        metalness: 0.1
      });
      const base = new THREE.Mesh(baseGeometry, baseMaterial);
      base.position.y = -3;
      base.castShadow = true;
      base.receiveShadow = true;
      towerGroup.add(base);
      
      // Main tower sections (tapered)
      const createTowerSection = (bottomRadius, topRadius, height, yPos, materialProps) => {
        const geometry = new THREE.CylinderGeometry(topRadius, bottomRadius, height, 32);
        const material = new THREE.MeshStandardMaterial(materialProps);
        const section = new THREE.Mesh(geometry, material);
        section.position.y = yPos;
        section.castShadow = true;
        section.receiveShadow = true;
        towerGroup.add(section);
        
        // Add decorative rings
        const ringCount = Math.floor(height / 0.5);
        for (let i = 0; i < ringCount; i++) {
          if (i % 3 === 0) { // Only add some rings for performance
            const ringGeometry = new THREE.TorusGeometry(
              bottomRadius - (i * ((bottomRadius - topRadius) / ringCount)) + 0.05, 
              0.05, 8, 32
            );
            const ringMaterial = new THREE.MeshStandardMaterial({ 
              color: 0x995522, 
              roughness: 0.6,
              metalness: 0.2
            });
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.position.y = yPos - height/2 + (i * height/ringCount);
            ring.rotation.x = Math.PI / 2;
            ring.castShadow = true;
            towerGroup.add(ring);
          }
        }
      };
      
      // Add tower sections (from bottom to top)
      createTowerSection(0.8, 0.7, 3, -1, { 
        color: 0xbb6633, 
        roughness: 0.7,
        metalness: 0.1
      });
      
      createTowerSection(0.7, 0.55, 2.5, 1.25, { 
        color: 0xaa5522, 
        roughness: 0.6,
        metalness: 0.15
      });
      
      createTowerSection(0.55, 0.4, 2, 3.5, { 
        color: 0xcc7744, 
        roughness: 0.5,
        metalness: 0.2
      });
      
      createTowerSection(0.4, 0.3, 1.5, 5.25, { 
        color: 0xaa5522, 
        roughness: 0.6,
        metalness: 0.15
      });
      
      // Top section
      const topGeometry = new THREE.CylinderGeometry(0.2, 0.3, 0.8, 32);
      const topMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xcc7744, 
        roughness: 0.5,
        metalness: 0.2
      });
      const top = new THREE.Mesh(topGeometry, topMaterial);
      top.position.y = 6.4;
      top.castShadow = true;
      towerGroup.add(top);
      
      // Top decoration
      const topDecorGeometry = new THREE.SphereGeometry(0.25, 16, 16);
      const topDecorMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xcc8855, 
        roughness: 0.4,
        metalness: 0.3
      });
      const topDecor = new THREE.Mesh(topDecorGeometry, topDecorMaterial);
      topDecor.position.y = 7;
      topDecor.castShadow = true;
      towerGroup.add(topDecor);
      
      // Move the entire tower up slightly to sit on ground
      towerGroup.position.y = 1.5;
      scene.add(towerGroup);
      
      // Position camera to view the monument
      if (cameraRef.current) {
        cameraRef.current.position.set(0, 4, 12);
        cameraRef.current.lookAt(0, 4, 0);
      }
    };
    
    // Create generic monument for other names
    const createGenericMonument = (scene, modelName) => {
      const monumentGroup = new THREE.Group();
      
      // Main structure
      const baseGeometry = new THREE.BoxGeometry(3, 1, 3);
      const baseMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xdddddd, 
        roughness: 0.6,
        metalness: 0.1
      });
      const base = new THREE.Mesh(baseGeometry, baseMaterial);
      base.position.y = -1;
      base.castShadow = true;
      base.receiveShadow = true;
      monumentGroup.add(base);
      
      // Middle structure
      const midGeometry = new THREE.BoxGeometry(2.5, 3, 2.5);
      const midMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xdddddd, 
        roughness: 0.5,
        metalness: 0.1
      });
      const mid = new THREE.Mesh(midGeometry, midMaterial);
      mid.position.y = 1;
      mid.castShadow = true;
      mid.receiveShadow = true;
      monumentGroup.add(mid);
      
      // Top structure
      const topGeometry = new THREE.ConeGeometry(1.5, 2, 4);
      const topMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xeeeeee, 
        roughness: 0.4,
        metalness: 0.2
      });
      const top = new THREE.Mesh(topGeometry, topMaterial);
      top.position.y = 3.5;
      top.rotation.y = Math.PI / 4;
      top.castShadow = true;
      top.receiveShadow = true;
      monumentGroup.add(top);
      
      // Add decorative elements
      const pillarGeometry = new THREE.CylinderGeometry(0.2, 0.2, 3, 16);
      const pillarMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xdddddd, 
        roughness: 0.5,
        metalness: 0.1
      });
      
      // Add pillars at corners
      const createPillar = (x, z) => {
        const pillar = new THREE.Mesh(pillarGeometry, pillarMaterial);
        pillar.position.set(x, 1, z);
        pillar.castShadow = true;
        pillar.receiveShadow = true;
        monumentGroup.add(pillar);
        
        // Add small decorative top
        const topGeometry = new THREE.SphereGeometry(0.25, 16, 16);
        const top = new THREE.Mesh(topGeometry, pillarMaterial);
        top.position.set(x, 2.75, z);
        top.castShadow = true;
        monumentGroup.add(top);
      };
      
      createPillar(1.5, 1.5);
      createPillar(-1.5, 1.5);
      createPillar(1.5, -1.5);
      createPillar(-1.5, -1.5);
      
      scene.add(monumentGroup);
      
      // Position camera to view the monument
      if (cameraRef.current) {
        cameraRef.current.position.set(0, 2, 8);
        cameraRef.current.lookAt(0, 1.5, 0);
      }
    };
    
    // Animate models (can be customized for each model)
    const animateModel = () => {
      // This function can be used to add custom animations
      // For example, subtle movements or effects
    };
    
  }, [modelName, isRotating, viewMode]);
  
  // Toggle rotation
  const toggleRotation = () => {
    setIsRotating(!isRotating);
    if (controlsRef.current) {
      controlsRef.current.autoRotate = !isRotating;
    }
  };
  
  // Change view perspective
  const changeView = (view) => {
    setViewMode(view);
    
    if (!cameraRef.current) return;
    
    // Update camera position based on selected view
    switch (view) {
      case 'top':
        cameraRef.current.position.set(0, 10, 0);
        cameraRef.current.lookAt(0, 0, 0);
        break;
      case 'front':
        cameraRef.current.position.set(0, 2, 8);
        cameraRef.current.lookAt(0, 0, 0);
        break;
      case 'side':
        cameraRef.current.position.set(8, 2, 0);
        cameraRef.current.lookAt(0, 0, 0);
        break;
      default: // '3d' view
        cameraRef.current.position.set(5, 3, 5);
        cameraRef.current.lookAt(0, 0, 0);
    }
  };
  
  // Handle zoom
  const handleZoom = (zoomIn) => {
    if (!cameraRef.current || !controlsRef.current) return;
    
    const delta = zoomIn ? -1 : 1;
    const newPosition = cameraRef.current.position.clone();
    newPosition.multiplyScalar(1 + (delta * 0.1));
    
    // Check if within bounds
    const distance = newPosition.length();
    if (distance > controlsRef.current.minDistance && 
        distance < controlsRef.current.maxDistance) {
      cameraRef.current.position.copy(newPosition);
    }
  };
  
  // Fake download and share functions
  const handleDownload = () => {
    alert('3D model download feature coming soon!');
  };
  
  const handleShare = () => {
    alert('Sharing feature coming soon!');
  };

  return (
    <div className="relative w-full h-full min-h-[400px] bg-gradient-to-b from-gray-50 to-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
      {/* Main container */}
      <div 
        ref={containerRef} 
        className="absolute inset-0"
      >
        {/* Canvas container */}
        <div 
          ref={canvasRef}
          className="absolute inset-0"
        ></div>
        
        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <h3 className="text-lg font-medium mb-1">Loading 3D Model</h3>
            <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-muted-foreground">
              {loadingProgress}% complete
            </p>
          </div>
        )}
        
        {/* Error message */}
        {error && !loading && (
          <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center p-6 z-10">
            <div className="max-w-md text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
                <span className="text-red-500 text-2xl">!</span>
              </div>
              <h3 className="text-lg font-medium text-red-500 mb-2">
                Error Loading Model
              </h3>
              <p className="text-sm text-gray-600 mb-4">{error}</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={() => window.location.reload()}
              >
                <RotateCw className="h-4 w-4" />
                Reload Page
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {/* Controls overlay */}
      {!loading && !error && (
        <>
          {/* Top info bar */}
          <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-white/80 to-transparent backdrop-blur-sm flex justify-between items-center">
            <div>
              <h3 className="font-medium text-lg">{modelDetails?.name || modelName}</h3>
              <p className="text-sm text-muted-foreground">{modelDetails?.location}</p>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 w-8 p-0"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4" />
                <span className="sr-only">Download</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 w-8 p-0"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4" />
                <span className="sr-only">Share</span>
              </Button>
            </div>
          </div>
          
          {/* Control buttons */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md">
            <Button
              variant={viewMode === '3d' ? 'default' : 'outline'}
              size="sm"
              className="h-8 px-3"
              onClick={() => changeView('3d')}
            >
              3D
            </Button>
            <Button
              variant={viewMode === 'front' ? 'default' : 'outline'}
              size="sm"
              className="h-8 px-3"
              onClick={() => changeView('front')}
            >
              Front
            </Button>
            <Button
              variant={viewMode === 'side' ? 'default' : 'outline'}
              size="sm"
              className="h-8 px-3"
              onClick={() => changeView('side')}
            >
              Side
            </Button>
            <Button
              variant={viewMode === 'top' ? 'default' : 'outline'}
              size="sm"
              className="h-8 px-3"
              onClick={() => changeView('top')}
            >
              Top
            </Button>
          </div>
          
          {/* Right control buttons */}
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 bg-white/80"
              onClick={() => handleZoom(true)}
            >
              <ZoomIn className="h-4 w-4" />
              <span className="sr-only">Zoom In</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 bg-white/80"
              onClick={() => handleZoom(false)}
            >
              <ZoomOut className="h-4 w-4" />
              <span className="sr-only">Zoom Out</span>
            </Button>
            <Button
              variant={isRotating ? 'default' : 'outline'}
              size="sm"
              className="h-8 w-8 p-0 bg-white/80"
              onClick={toggleRotation}
            >
              <RotateCcw className="h-4 w-4" />
              <span className="sr-only">Toggle Rotation</span>
            </Button>
          </div>
          
          {/* Bottom info */}
          <div className="absolute bottom-16 left-4 right-4 bg-white/80 backdrop-blur-sm p-3 rounded-lg shadow-sm border border-gray-200">
            <div className="text-xs text-muted-foreground mb-1">
              <span className="inline-block px-2 py-0.5 bg-primary/10 text-primary rounded-full text-[10px] mr-2">
                {modelDetails?.style}
              </span>
              <span>{modelDetails?.year}</span>
            </div>
            <p className="text-sm line-clamp-2">{modelDetails?.description}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default EnhancedModelViewer;