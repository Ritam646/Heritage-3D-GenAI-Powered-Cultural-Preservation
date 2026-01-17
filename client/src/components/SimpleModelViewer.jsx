import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Box, ZoomIn } from 'lucide-react';
import { Button } from './ui/button';

const SimpleModelViewer = ({ modelName, isPreview = false }) => {
  const [is3DMode, setIs3DMode] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const canvasRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const animationIdRef = useRef(null);

  // Initialize the scene
  useEffect(() => {
    if (!canvasRef.current || !is3DMode) return;

    // Clear previous content
    if (rendererRef.current) {
      canvasRef.current.removeChild(rendererRef.current.domElement);
      rendererRef.current.dispose();
    }

    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
    }

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
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    rendererRef.current = renderer;
    canvasRef.current.appendChild(renderer.domElement);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Add a grid helper
    const gridHelper = new THREE.GridHelper(10, 10);
    scene.add(gridHelper);

    // Create model based on name
    let model;
    
    if (modelName?.toLowerCase().includes('taj')) {
      model = createTajMahal();
    } else if (modelName?.toLowerCase().includes('qutub')) {
      model = createQutubMinar();
    } else {
      model = createGenericModel();
    }
    
    scene.add(model);

    // Animation loop
    const animate = () => {
      model.rotation.y += 0.005;
      renderer.render(scene, camera);
      animationIdRef.current = requestAnimationFrame(animate);
    };
    
    animate();

    // Handle resize
    const handleResize = () => {
      if (!canvasRef.current) return;
      
      camera.aspect = canvasRef.current.clientWidth / canvasRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      
      if (canvasRef.current && rendererRef.current) {
        canvasRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, [is3DMode, modelName]);

  // Create Taj Mahal model
  function createTajMahal() {
    const group = new THREE.Group();
    
    // Main dome
    const domeGeometry = new THREE.SphereGeometry(1, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    const domeMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xffffff,
      specular: 0x555555,
      shininess: 50
    });
    const dome = new THREE.Mesh(domeGeometry, domeMaterial);
    dome.position.y = 0.5;
    group.add(dome);
    
    // Dome tip
    const tipGeometry = new THREE.ConeGeometry(0.1, 0.5, 16);
    const tipMaterial = new THREE.MeshPhongMaterial({ color: 0xffd700 });
    const tip = new THREE.Mesh(tipGeometry, tipMaterial);
    tip.position.y = 1.5;
    group.add(tip);
    
    // Main platform
    const platformGeometry = new THREE.BoxGeometry(4, 0.4, 4);
    const platformMaterial = new THREE.MeshPhongMaterial({ color: 0xf0f0f0 });
    const platform = new THREE.Mesh(platformGeometry, platformMaterial);
    platform.position.y = -0.7;
    group.add(platform);
    
    // Second platform
    const platform2Geometry = new THREE.BoxGeometry(5, 0.3, 5);
    const platform2 = new THREE.Mesh(platform2Geometry, platformMaterial);
    platform2.position.y = -1.1;
    group.add(platform2);
    
    // Base building
    const buildingGeometry = new THREE.BoxGeometry(3, 1, 3);
    const buildingMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xfffafa,
      specular: 0x222222,
      shininess: 10
    });
    const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
    building.position.y = 0;
    group.add(building);
    
    // Four minarets
    const minaretPositions = [
      { x: 2.2, z: 2.2 },
      { x: 2.2, z: -2.2 },
      { x: -2.2, z: 2.2 },
      { x: -2.2, z: -2.2 }
    ];
    
    minaretPositions.forEach(pos => {
      // Main tower
      const minaretGeometry = new THREE.CylinderGeometry(0.15, 0.2, 3, 16);
      const minaretMaterial = new THREE.MeshPhongMaterial({ color: 0xf5f5f5 });
      const minaret = new THREE.Mesh(minaretGeometry, minaretMaterial);
      minaret.position.set(pos.x, 0.4, pos.z);
      group.add(minaret);
      
      // Top dome
      const topGeometry = new THREE.SphereGeometry(0.2, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
      const top = new THREE.Mesh(topGeometry, minaretMaterial);
      top.position.set(pos.x, 2, pos.z);
      group.add(top);
      
      // Small platform under minaret
      const minaretBaseGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16);
      const minaretBase = new THREE.Mesh(minaretBaseGeometry, platformMaterial);
      minaretBase.position.set(pos.x, -1, pos.z);
      group.add(minaretBase);
    });
    
    return group;
  }

  // Create Qutub Minar model
  function createQutubMinar() {
    const group = new THREE.Group();
    
    // Main tower - tapered
    const sections = 5;
    const heightPerSection = 0.8;
    const totalHeight = sections * heightPerSection;
    const baseRadius = 0.8;
    const topRadius = 0.35;
    
    // Create the tower in sections
    for (let i = 0; i < sections; i++) {
      const sectionBaseRadius = baseRadius - ((baseRadius - topRadius) * (i / sections));
      const sectionTopRadius = baseRadius - ((baseRadius - topRadius) * ((i + 1) / sections));
      
      const sectionGeometry = new THREE.CylinderGeometry(
        sectionTopRadius, 
        sectionBaseRadius, 
        heightPerSection, 
        32
      );
      
      const color = i % 2 === 0 ? 0xd2b48c : 0xc19a6b; // Alternating colors
      const sectionMaterial = new THREE.MeshPhongMaterial({ 
        color: color,
        specular: 0x222222,
        shininess: 20
      });
      
      const section = new THREE.Mesh(sectionGeometry, sectionMaterial);
      const yPos = (i * heightPerSection) - (totalHeight / 2) + heightPerSection/2;
      section.position.y = yPos;
      group.add(section);
      
      // Add decorative ring between sections
      if (i < sections - 1) {
        const ringGeometry = new THREE.TorusGeometry(sectionTopRadius + 0.05, 0.05, 8, 32);
        const ringMaterial = new THREE.MeshPhongMaterial({ color: 0xb8860b });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = yPos + heightPerSection/2;
        group.add(ring);
      }
    }
    
    // Top finial/decoration
    const finialGeometry = new THREE.ConeGeometry(0.15, 0.5, 16);
    const finialMaterial = new THREE.MeshPhongMaterial({ color: 0xb8860b });
    const finial = new THREE.Mesh(finialGeometry, finialMaterial);
    finial.position.y = (totalHeight / 2) + 0.25;
    group.add(finial);
    
    // Base of the monument
    const baseGeometry = new THREE.CylinderGeometry(1.2, 1.2, 0.5, 32);
    const baseMaterial = new THREE.MeshPhongMaterial({ color: 0xd2b48c });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = -(totalHeight / 2) - 0.25;
    group.add(base);
    
    // Ground platform
    const groundGeometry = new THREE.CylinderGeometry(2, 2, 0.2, 32);
    const groundMaterial = new THREE.MeshPhongMaterial({ color: 0xc19a6b });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.position.y = -(totalHeight / 2) - 0.6;
    group.add(ground);
    
    return group;
  }

  // Create a generic model
  function createGenericModel() {
    const geometry = new THREE.TorusKnotGeometry(1, 0.3, 128, 32, 2, 3);
    const material = new THREE.MeshPhongMaterial({ 
      color: 0x4169e1,
      specular: 0x333333,
      shininess: 30
    });
    
    return new THREE.Mesh(geometry, material);
  }

  // Get monument image for fallback
  const getMonumentImage = () => {
    if (modelName?.toLowerCase().includes('taj')) {
      return "/images/photo-1564507592333-c60657eea523.jpeg";
    } else if (modelName?.toLowerCase().includes('qutub')) {
      return "/images/qutub1_042717100950.jpg";
    } else {
      return "/images/photo-1564507592333-c60657eea523.jpeg"; // Default to Taj Mahal
    }
  };

  // For preview mode (in grid cards)
  if (isPreview) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <div className="w-16 h-16 flex items-center justify-center bg-primary/10 rounded-full mb-2">
          <Box className="h-8 w-8 text-primary" />
        </div>
        <p className="text-xs text-center text-muted-foreground">
          Interactive 3D Model<br/>Available
        </p>
      </div>
    );
  }

  return (
    <div className={`w-full h-full flex flex-col overflow-hidden ${
      isFullScreen ? 'fixed inset-0 z-50 bg-background p-4' : ''
    }`}>
      {/* Controls */}
      <div className="p-2 border-b flex items-center justify-between bg-muted/30">
        <div className="flex items-center space-x-2">
          <Button 
            variant={is3DMode ? "default" : "outline"} 
            size="sm" 
            onClick={() => setIs3DMode(true)}
            className={is3DMode ? "bg-primary text-primary-foreground" : ""}
          >
            <Box className="h-4 w-4 mr-2" />
            3D View
          </Button>
          <Button 
            variant={!is3DMode ? "default" : "outline"} 
            size="sm" 
            onClick={() => setIs3DMode(false)}
            className={!is3DMode ? "bg-primary text-primary-foreground" : ""}
          >
            <ZoomIn className="h-4 w-4 mr-2" />
            Image View
          </Button>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsFullScreen(!isFullScreen)}
          className="rounded-full"
        >
          {isFullScreen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="4 14 10 14 10 20"></polyline>
              <polyline points="20 10 14 10 14 4"></polyline>
              <line x1="14" y1="10" x2="21" y2="3"></line>
              <line x1="3" y1="21" x2="10" y2="14"></line>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 3 21 3 21 9"></polyline>
              <polyline points="9 21 3 21 3 15"></polyline>
              <line x1="21" y1="3" x2="14" y2="10"></line>
              <line x1="3" y1="21" x2="10" y2="14"></line>
            </svg>
          )}
        </Button>
      </div>
      
      {/* Content Area */}
      <div className="flex-1 relative overflow-hidden">
        {is3DMode ? (
          <div ref={canvasRef} className="w-full h-full"></div>
        ) : (
          <div className="h-full flex items-center justify-center p-4">
            <div className="max-w-full max-h-full relative group">
              <img
                src={getMonumentImage()}
                alt={modelName || "Heritage Monument"}
                className="max-h-full max-w-full object-contain rounded-lg shadow-md"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button 
                  variant="outline" 
                  onClick={() => setIs3DMode(true)} 
                  className="bg-background/80 hover:bg-background/100"
                >
                  <Box className="h-4 w-4 mr-2" />
                  View in 3D
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Monument Name */}
      <div className="p-2 border-t bg-muted/30 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium">{modelName || "Heritage Monument"}</h3>
          <p className="text-xs text-muted-foreground">
            {is3DMode ? 'Interactive 3D Model' : 'Image View'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SimpleModelViewer;