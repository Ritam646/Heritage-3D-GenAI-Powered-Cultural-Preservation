import React, { useState, useEffect, useRef } from 'react';
import { Box, ZoomIn, RotateCcw } from 'lucide-react';
import { Button } from './ui/button';
import * as THREE from 'three';

interface ModelViewerProps {
  modelUrl?: string;
  isPreview?: boolean;
  name?: string;
}

const ModelViewer: React.FC<ModelViewerProps> = ({ modelUrl, isPreview = false, name }) => {
  const [is3DMode, setIs3DMode] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  // Set up the 3D scene
  useEffect(() => {
    if (!canvasRef.current || !is3DMode) return;
    
    // Set loading state
    setIsLoading(true);
    setLoadingError(null);
    
    console.log("ModelViewer initializing with:", { name, modelUrl });
    
    try {
      // Clean up previous content
      while (canvasRef.current.firstChild) {
        canvasRef.current.removeChild(canvasRef.current.firstChild);
      }
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      
      // Create new scene
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xf0f0f0);
      
      // Create renderer
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
      canvasRef.current.appendChild(renderer.domElement);
      
      // Create camera
      const camera = new THREE.PerspectiveCamera(
        45,
        canvasRef.current.clientWidth / canvasRef.current.clientHeight,
        0.1,
        1000
      );
      camera.position.z = 5;
      
      // Add lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
      scene.add(ambientLight);
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(1, 1, 1);
      scene.add(directionalLight);
      
      const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
      directionalLight2.position.set(-1, -1, -1);
      scene.add(directionalLight2);
      
      // Add grid helper
      const gridHelper = new THREE.GridHelper(10, 10);
      scene.add(gridHelper);
      
      // Create model based on monument type - ALWAYS use our custom models
      let mainGroup = new THREE.Group();
      
      console.log("ModelViewer - Creating model for:", name, "URL:", modelUrl);
      
      // Use name for identification, fallback to modelUrl
      const modelName = name?.toLowerCase() || "";
      const modelUrlLower = modelUrl?.toLowerCase() || "";
      
      if (modelName.includes('taj mahal') || modelUrlLower.includes('taj')) {
        console.log("Creating Taj Mahal 3D model");
        createTajMahalModel(mainGroup);
      } else if (modelName.includes('qutub minar') || modelUrlLower.includes('qutub')) {
        console.log("Creating Qutub Minar 3D model");
        createQutubMinarModel(mainGroup);
      } else {
        console.log("Creating generic monument model");
        createGenericModel(mainGroup);
      }
      
      scene.add(mainGroup);
      
      // Animation function
      const animate = () => {
        mainGroup.rotation.y += 0.005;
        renderer.render(scene, camera);
        animationFrameRef.current = requestAnimationFrame(animate);
      };
      
      // Start animation
      animationFrameRef.current = requestAnimationFrame(animate);
      
      // Handle window resize
      const handleResize = () => {
        if (!canvasRef.current) return;
        
        const width = canvasRef.current.clientWidth;
        const height = canvasRef.current.clientHeight;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        
        renderer.setSize(width, height);
      };
      
      window.addEventListener('resize', handleResize);
      
      // Cleanup function
      setIsLoading(false);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }
        
        renderer.dispose();
        
        if (canvasRef.current) {
          while (canvasRef.current.firstChild) {
            canvasRef.current.removeChild(canvasRef.current.firstChild);
          }
        }
      };
    } catch (error) {
      console.error("Error creating 3D scene:", error);
      setLoadingError("Failed to initialize 3D viewer");
      setIsLoading(false);
    }
  }, [is3DMode, modelUrl, name]);
  
  // Function to create enhanced Taj Mahal model with realistic marble texture
  const createTajMahalModel = (group: THREE.Group) => {
    // Create marble material with subtle veins
    const marbleTexture = new THREE.TextureLoader().load('/api/modelfiles/taj-mahal.jpeg');
    marbleTexture.wrapS = THREE.RepeatWrapping;
    marbleTexture.wrapT = THREE.RepeatWrapping;
    marbleTexture.repeat.set(0.1, 0.1);
    console.log("Loading Taj Mahal texture");
    
    // Enhanced marble material
    const marbleMaterial = new THREE.MeshPhysicalMaterial({ 
      color: 0xfffafa,
      roughness: 0.1,
      metalness: 0.0,
      reflectivity: 0.5,
      clearcoat: 0.3,
      clearcoatRoughness: 0.2,
      envMapIntensity: 1.0
    });
    
    // Main dome with more details
    const domeGeometry = new THREE.SphereGeometry(1, 64, 64, 0, Math.PI * 2, 0, Math.PI / 2);
    const dome = new THREE.Mesh(domeGeometry, marbleMaterial);
    dome.position.y = 0.5;
    dome.castShadow = true;
    dome.receiveShadow = true;
    group.add(dome);
    
    // Decorative accent at the dome's base
    const domeRingGeometry = new THREE.TorusGeometry(1.02, 0.05, 16, 64);
    const goldMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xffd700,
      roughness: 0.3,
      metalness: 0.8
    });
    const domeRing = new THREE.Mesh(domeRingGeometry, goldMaterial);
    domeRing.position.y = 0.02;
    domeRing.rotation.x = Math.PI / 2;
    group.add(domeRing);
    
    // Dome tip
    const tipGeometry = new THREE.ConeGeometry(0.15, 0.7, 32);
    const tip = new THREE.Mesh(tipGeometry, goldMaterial);
    tip.position.y = 1.5;
    tip.castShadow = true;
    group.add(tip);
    
    // Main platform - more realistic with beveled edges
    const createBeveledCube = (width: number, height: number, depth: number, bevel: number = 0.1) => {
      const shape = new THREE.Shape();
      shape.moveTo(-width/2 + bevel, -depth/2);
      shape.lineTo(width/2 - bevel, -depth/2);
      shape.quadraticCurveTo(width/2, -depth/2, width/2, -depth/2 + bevel);
      shape.lineTo(width/2, depth/2 - bevel);
      shape.quadraticCurveTo(width/2, depth/2, width/2 - bevel, depth/2);
      shape.lineTo(-width/2 + bevel, depth/2);
      shape.quadraticCurveTo(-width/2, depth/2, -width/2, depth/2 - bevel);
      shape.lineTo(-width/2, -depth/2 + bevel);
      shape.quadraticCurveTo(-width/2, -depth/2, -width/2 + bevel, -depth/2);
      
      const extrudeSettings = {
        steps: 1,
        depth: height,
        bevelEnabled: true,
        bevelThickness: bevel,
        bevelSize: bevel,
        bevelOffset: 0,
        bevelSegments: 5
      };
      
      return new THREE.ExtrudeGeometry(shape, extrudeSettings);
    };
    
    // Main platform
    const platformGeometry = createBeveledCube(4, 0.5, 4);
    const platformMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xf5f5f5,
      specular: 0x222222,
      shininess: 30
    });
    const platform = new THREE.Mesh(platformGeometry, platformMaterial);
    platform.position.y = -0.7;
    platform.rotation.x = Math.PI / 2;
    platform.castShadow = true;
    platform.receiveShadow = true;
    group.add(platform);
    
    // Second platform
    const platform2Geometry = createBeveledCube(5, 0.4, 5);
    const platform2 = new THREE.Mesh(platform2Geometry, platformMaterial);
    platform2.position.y = -1.1;
    platform2.rotation.x = Math.PI / 2;
    platform2.castShadow = true;
    platform2.receiveShadow = true;
    group.add(platform2);
    
    // Base building with decorated facade
    const buildingGeometry = new THREE.BoxGeometry(3, 1, 3);
    const building = new THREE.Mesh(buildingGeometry, marbleMaterial);
    building.position.y = 0;
    building.castShadow = true;
    building.receiveShadow = true;
    group.add(building);
    
    // Add entrance arch
    const archWidth = 0.8;
    const archHeight = 0.6;
    const archDepth = 0.2;
    
    const archShape = new THREE.Shape();
    archShape.moveTo(-archWidth/2, 0);
    archShape.lineTo(-archWidth/2, archHeight/2);
    archShape.quadraticCurveTo(0, archHeight, archWidth/2, archHeight/2);
    archShape.lineTo(archWidth/2, 0);
    
    const archExtrudeSettings = {
      steps: 2,
      depth: archDepth,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.05,
      bevelOffset: 0,
      bevelSegments: 4
    };
    
    const archGeometry = new THREE.ExtrudeGeometry(archShape, archExtrudeSettings);
    const archMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xeeeae6,
      specular: 0x222222,
      shininess: 60
    });
    
    const arch = new THREE.Mesh(archGeometry, archMaterial);
    arch.position.set(0, -0.5, 1.5);
    arch.castShadow = true;
    group.add(arch);
    
    // Four minarets with enhanced design
    const minaretPositions = [
      { x: 2.2, z: 2.2 },
      { x: 2.2, z: -2.2 },
      { x: -2.2, z: 2.2 },
      { x: -2.2, z: -2.2 }
    ];
    
    minaretPositions.forEach(pos => {
      // Detailed minaret
      const createMinaret = (x: number, z: number) => {
        const minaretGroup = new THREE.Group();
        
        // Base
        const baseGeometry = new THREE.CylinderGeometry(0.25, 0.3, 0.4, 16);
        const base = new THREE.Mesh(baseGeometry, platformMaterial);
        base.position.y = -1.3;
        base.castShadow = true;
        minaretGroup.add(base);
        
        // Main tower with segmentation
        const segmentHeight = 0.4;
        const segments = 7;
        
        for (let i = 0; i < segments; i++) {
          const isNarrow = i % 2 === 1;
          const radius = isNarrow ? 0.15 : 0.18;
          const segGeometry = new THREE.CylinderGeometry(
            radius * 0.9,
            radius,
            segmentHeight,
            16
          );
          const segMaterial = isNarrow ? 
            new THREE.MeshPhongMaterial({ color: 0xeeeae6 }) : 
            marbleMaterial;
          
          const segment = new THREE.Mesh(segGeometry, segMaterial);
          segment.position.y = -1 + (i * segmentHeight);
          segment.castShadow = true;
          minaretGroup.add(segment);
          
          // Add decorative ring between segments
          if (i < segments - 1) {
            const ringGeometry = new THREE.TorusGeometry(radius, 0.02, 8, 32);
            const ring = new THREE.Mesh(ringGeometry, goldMaterial);
            ring.rotation.x = Math.PI / 2;
            ring.position.y = -1 + (i * segmentHeight) + segmentHeight/2;
            minaretGroup.add(ring);
          }
        }
        
        // Top dome
        const topGeometry = new THREE.SphereGeometry(0.2, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
        const top = new THREE.Mesh(topGeometry, marbleMaterial);
        top.position.y = -1 + (segments * segmentHeight) + 0.1;
        top.castShadow = true;
        minaretGroup.add(top);
        
        // Finial
        const finialGeometry = new THREE.ConeGeometry(0.05, 0.2, 16);
        const finial = new THREE.Mesh(finialGeometry, goldMaterial);
        finial.position.y = -1 + (segments * segmentHeight) + 0.3;
        finial.castShadow = true;
        minaretGroup.add(finial);
        
        minaretGroup.position.set(x, 0, z);
        return minaretGroup;
      };
      
      const minaret = createMinaret(pos.x, pos.z);
      group.add(minaret);
    });
    
    // Add garden reflection pool - typical of Taj Mahal
    const poolGeometry = new THREE.BoxGeometry(8, 0.1, 2);
    const poolMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x3a85ff,
      transparent: true,
      opacity: 0.7,
      specular: 0xffffff,
      shininess: 100
    });
    const pool = new THREE.Mesh(poolGeometry, poolMaterial);
    pool.position.set(0, -1.5, -3);
    pool.receiveShadow = true;
    group.add(pool);
    
    // Add decorative garden outlines
    const createGardenBorder = (width: number, depth: number) => {
      const borderGeometry = new THREE.BoxGeometry(width, 0.1, 0.2);
      const borderMaterial = new THREE.MeshPhongMaterial({ color: 0xc19a6b });
      const border = new THREE.Mesh(borderGeometry, borderMaterial);
      border.position.y = -1.45;
      border.position.z = -3 - depth/2;
      group.add(border);
      
      const border2 = border.clone();
      border2.position.z = -3 + depth/2;
      group.add(border2);
      
      const sideGeometry = new THREE.BoxGeometry(0.2, 0.1, depth);
      const sideBorder = new THREE.Mesh(sideGeometry, borderMaterial);
      sideBorder.position.y = -1.45;
      sideBorder.position.x = width/2;
      sideBorder.position.z = -3;
      group.add(sideBorder);
      
      const sideBorder2 = sideBorder.clone();
      sideBorder2.position.x = -width/2;
      group.add(sideBorder2);
    };
    
    createGardenBorder(8.2, 2.2);
  };
  
  // Function to create enhanced Qutub Minar model with realistic red sandstone texture
  const createQutubMinarModel = (group: THREE.Group) => {
    // Create sandstone texture
    const sandstoneTexture = new THREE.TextureLoader().load('/api/modelfiles/qutub-minar.jpg');
    sandstoneTexture.wrapS = THREE.RepeatWrapping;
    sandstoneTexture.wrapT = THREE.RepeatWrapping;
    sandstoneTexture.repeat.set(0.2, 0.2);
    console.log("Loading Qutub Minar texture");
    
    // Enhanced sandstone material with texture mapping
    const sandstoneMaterial = new THREE.MeshStandardMaterial({ 
      map: sandstoneTexture,
      color: 0xd2b48c,
      roughness: 0.7,
      metalness: 0.0
    });
    
    // Secondary material for contrast sections
    const marbleMaterial = new THREE.MeshPhysicalMaterial({ 
      color: 0xf0e6d2,
      roughness: 0.3,
      metalness: 0.0,
      reflectivity: 0.2
    });
    
    // Metallic material for decorative elements
    const metalMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xb8860b, // Dark gold
      roughness: 0.3,
      metalness: 0.8
    });
    
    // Main tower - detailed tapered structure with carvings
    const sections = 5;
    const heightPerSection = 0.9;
    const totalHeight = sections * heightPerSection;
    const baseRadius = 0.9;
    const topRadius = 0.35;
    
    // Create detailed tower sections
    for (let i = 0; i < sections; i++) {
      const sectionBaseRadius = baseRadius - ((baseRadius - topRadius) * (i / sections));
      const sectionTopRadius = baseRadius - ((baseRadius - topRadius) * ((i + 1) / sections));
      
      // Create main section cylinder
      const sectionGeometry = new THREE.CylinderGeometry(
        sectionTopRadius, 
        sectionBaseRadius, 
        heightPerSection, 
        32, 
        8, // More height segments for detail
        true // Open-ended for additional detailing
      );
      
      // Alternate materials for cultural authenticity
      const material = i % 2 === 0 ? sandstoneMaterial.clone() : marbleMaterial.clone();
      
      // Add color variation based on section
      if (i % 2 === 0) {
        material.color.setHex(0xd2b48c); // Sandstone tan
      } else {
        material.color.setHex(0xc19a6b); // Darker sandstone
      }
      
      const section = new THREE.Mesh(sectionGeometry, material);
      const yPos = (i * heightPerSection) - (totalHeight / 2) + heightPerSection/2;
      section.position.y = yPos;
      section.castShadow = true;
      section.receiveShadow = true;
      group.add(section);
      
      // Add decorative patterns to each section
      const addDecorations = (sectionIndex: number, radius: number, y: number) => {
        // Number of decorative elements based on section size
        const numDecorations = Math.floor(16 - (sectionIndex * 2));
        
        // Add intricate carvings typical of Indo-Islamic architecture
        for (let j = 0; j < numDecorations; j++) {
          const angle = (j / numDecorations) * Math.PI * 2;
          const decorSize = 0.1 - (sectionIndex * 0.01);
          
          // Carving shape - stylized arabesque pattern
          const decorShape = new THREE.Shape();
          decorShape.moveTo(0, 0);
          decorShape.lineTo(decorSize, 0);
          decorShape.lineTo(decorSize, decorSize * 3);
          decorShape.lineTo(decorSize/2, decorSize * 3.5);
          decorShape.lineTo(0, decorSize * 3);
          decorShape.lineTo(0, 0);
          
          const extrudeSettings = {
            steps: 1,
            depth: 0.05,
            bevelEnabled: true,
            bevelThickness: 0.01,
            bevelSize: 0.01,
            bevelSegments: 2
          };
          
          const decorGeometry = new THREE.ExtrudeGeometry(decorShape, extrudeSettings);
          const decorMaterial = marbleMaterial.clone();
          decorMaterial.color.setHex(0xe8dcb5); // Lighter for contrast
          
          const decoration = new THREE.Mesh(decorGeometry, decorMaterial);
          
          // Position and rotate decoration to align with the cylinder wall
          decoration.position.set(
            Math.sin(angle) * (radius + 0.01),
            y,
            Math.cos(angle) * (radius + 0.01)
          );
          decoration.rotation.y = angle + Math.PI;
          decoration.scale.set(0.7, 0.7, 0.7);
          
          decoration.castShadow = true;
          group.add(decoration);
        }
      };
      
      // Add decorative elements to alternating sections
      if (i % 2 === 0) {
        addDecorations(i, sectionBaseRadius, yPos - heightPerSection/4);
      }
      
      // Add decorative ring between sections - ornate balconies
      if (i < sections - 1) {
        // Create main ring
        const ringGeometry = new THREE.TorusGeometry(sectionTopRadius + 0.05, 0.07, 16, 48);
        const ring = new THREE.Mesh(ringGeometry, metalMaterial);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = yPos + heightPerSection/2;
        ring.castShadow = true;
        group.add(ring);
        
        // Add balcony floor
        const balconyGeometry = new THREE.CylinderGeometry(
          sectionTopRadius + 0.15, 
          sectionTopRadius + 0.15, 
          0.05, 
          32
        );
        const balcony = new THREE.Mesh(balconyGeometry, sandstoneMaterial.clone());
        balcony.position.y = yPos + heightPerSection/2 - 0.05;
        balcony.castShadow = true;
        group.add(balcony);
        
        // Add decorative railings
        const railingCount = 24;
        for (let r = 0; r < railingCount; r++) {
          const angle = (r / railingCount) * Math.PI * 2;
          const railGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.15, 8);
          const rail = new THREE.Mesh(railGeometry, marbleMaterial.clone());
          const railRadius = sectionTopRadius + 0.14;
          
          rail.position.set(
            Math.sin(angle) * railRadius,
            yPos + heightPerSection/2 + 0.05,
            Math.cos(angle) * railRadius
          );
          
          rail.castShadow = true;
          group.add(rail);
        }
      }
    }
    
    // Enhanced top finial/decoration
    const finialGroup = new THREE.Group();
    
    // Base of the finial
    const finialBaseGeometry = new THREE.CylinderGeometry(0.2, 0.3, 0.1, 16);
    const finialBase = new THREE.Mesh(finialBaseGeometry, metalMaterial);
    finialBase.position.y = 0;
    finialBase.castShadow = true;
    finialGroup.add(finialBase);
    
    // Middle part
    const midGeometry = new THREE.CylinderGeometry(0.15, 0.2, 0.3, 16);
    const midPart = new THREE.Mesh(midGeometry, metalMaterial);
    midPart.position.y = 0.2;
    midPart.castShadow = true;
    finialGroup.add(midPart);
    
    // Top cone
    const topConeGeometry = new THREE.ConeGeometry(0.15, 0.4, 16);
    const topCone = new THREE.Mesh(topConeGeometry, metalMaterial);
    topCone.position.y = 0.55;
    topCone.castShadow = true;
    finialGroup.add(topCone);
    
    finialGroup.position.y = (totalHeight / 2) + 0.25;
    group.add(finialGroup);
    
    // Enhanced base of the monument with decorative details
    const baseGroup = new THREE.Group();
    
    // Main base
    const baseGeometry = new THREE.CylinderGeometry(1.4, 1.5, 0.6, 32);
    const base = new THREE.Mesh(baseGeometry, sandstoneMaterial.clone());
    base.castShadow = true;
    base.receiveShadow = true;
    baseGroup.add(base);
    
    // Add decorative band around base
    const baseBandGeometry = new THREE.TorusGeometry(1.42, 0.05, 8, 64);
    const baseBand = new THREE.Mesh(baseBandGeometry, metalMaterial);
    baseBand.rotation.x = Math.PI / 2;
    baseBand.position.y = 0.15;
    baseGroup.add(baseBand);
    
    // Add decorative arches around base
    const archCount = 12;
    for (let a = 0; a < archCount; a++) {
      const angle = (a / archCount) * Math.PI * 2;
      
      // Create arch shape
      const archWidth = 0.3;
      const archHeight = 0.3;
      
      const archShape = new THREE.Shape();
      archShape.moveTo(-archWidth/2, 0);
      archShape.lineTo(-archWidth/2, archHeight * 0.6);
      archShape.quadraticCurveTo(0, archHeight, archWidth/2, archHeight * 0.6);
      archShape.lineTo(archWidth/2, 0);
      
      const archExtrudeSettings = {
        steps: 1,
        depth: 0.1,
        bevelEnabled: true,
        bevelThickness: 0.02,
        bevelSize: 0.02,
        bevelSegments: 3
      };
      
      const archGeometry = new THREE.ExtrudeGeometry(archShape, archExtrudeSettings);
      const archMaterial = marbleMaterial.clone();
      archMaterial.color.setHex(0xeeeae6);
      
      const arch = new THREE.Mesh(archGeometry, archMaterial);
      
      // Position the arch around the base
      arch.position.set(
        Math.sin(angle) * 1.45,
        -0.15,
        Math.cos(angle) * 1.45
      );
      arch.rotation.y = angle + Math.PI;
      arch.scale.set(0.8, 0.8, 0.8);
      
      arch.castShadow = true;
      baseGroup.add(arch);
    }
    
    baseGroup.position.y = -(totalHeight / 2) - 0.3;
    group.add(baseGroup);
    
    // Expanded surrounding area with detailed courtyard
    const surroundingGroup = new THREE.Group();
    
    // Create ground platform with detailed texturing
    const groundGeometry = new THREE.CylinderGeometry(3, 3, 0.2, 32);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xc19a6b,
      roughness: 0.9,
      metalness: 0.0
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.receiveShadow = true;
    surroundingGroup.add(ground);
    
    // Add surrounding details - small structures and ruins
    const addSurroundingDetail = () => {
      // Create small ruins scattered around
      const ruinCount = 8;
      for (let i = 0; i < ruinCount; i++) {
        const angle = (i / ruinCount) * Math.PI * 2;
        const distance = 1.8 + Math.random() * 0.8;
        
        // Create a small ruined column or structure
        const pillarHeight = 0.3 + Math.random() * 0.5;
        const pillarRadius = 0.1 + Math.random() * 0.1;
        
        const ruinGeometry = new THREE.CylinderGeometry(
          pillarRadius * 0.8, 
          pillarRadius, 
          pillarHeight, 
          16
        );
        
        const ruinMaterial = sandstoneMaterial.clone();
        ruinMaterial.color.setHex(0xd2b48c - Math.random() * 0x101010);
        
        const ruin = new THREE.Mesh(ruinGeometry, ruinMaterial);
        ruin.position.set(
          Math.sin(angle) * distance,
          pillarHeight / 2,
          Math.cos(angle) * distance
        );
        
        // Add some random rotation to make it look more like ruins
        ruin.rotation.x = (Math.random() - 0.5) * 0.2;
        ruin.rotation.z = (Math.random() - 0.5) * 0.2;
        
        ruin.castShadow = true;
        ruin.receiveShadow = true;
        surroundingGroup.add(ruin);
      }
      
      // Add some fallen/broken pieces on the ground
      const debrisCount = 12;
      for (let i = 0; i < debrisCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = 0.8 + Math.random() * 2;
        
        // Random shapes for debris
        const shapes = [
          new THREE.BoxGeometry(0.2, 0.1, 0.15),
          new THREE.CylinderGeometry(0.1, 0.1, 0.2, 8),
          new THREE.SphereGeometry(0.1, 8, 8)
        ];
        
        const debrisMaterial = sandstoneMaterial.clone();
        debrisMaterial.color.setHex(0xd2b48c);
        
        const debris = new THREE.Mesh(
          shapes[Math.floor(Math.random() * shapes.length)],
          debrisMaterial
        );
        
        debris.position.set(
          Math.sin(angle) * distance,
          0.1,
          Math.cos(angle) * distance
        );
        
        // Random rotation
        debris.rotation.set(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        );
        
        debris.castShadow = true;
        debris.receiveShadow = true;
        surroundingGroup.add(debris);
      }
    };
    
    addSurroundingDetail();
    
    surroundingGroup.position.y = -(totalHeight / 2) - 0.7;
    group.add(surroundingGroup);
  };
  
  // Function to create a generic model
  const createGenericModel = (group: THREE.Group) => {
    // Generic monument - more detailed torus knot
    const geometry = new THREE.TorusKnotGeometry(1, 0.3, 128, 32, 2, 3);
    const material = new THREE.MeshPhongMaterial({ 
      color: 0x4169e1, // Royal blue
      specular: 0x333333,
      shininess: 30
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    group.add(mesh);
  };
  
  // Get monument image for fallback
  const getMonumentImage = () => {
    if (name?.toLowerCase().includes('taj mahal') || modelUrl?.toLowerCase().includes('taj')) {
      return "/taj-mahal.jpeg";
    } else if (name?.toLowerCase().includes('qutub minar') || modelUrl?.toLowerCase().includes('qutub')) {
      return "/qutub-minar.jpg";
    } else {
      return "/qutub-minar.jpg"; // Default to Qutub Minar as fallback
    }
  };
  
  // Get monument name
  const getMonumentName = () => {
    if (name) return name;
    if (modelUrl?.toLowerCase().includes('taj')) return 'Taj Mahal';
    if (modelUrl?.toLowerCase().includes('qutub')) return 'Qutub Minar';
    return 'Heritage Monument';
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
    <div className={`w-full h-full flex flex-col overflow-hidden liquid-gradient-border rounded-lg ${
      isFullScreen ? 'fixed inset-0 z-50 bg-background p-4' : ''
    }`}>
      {/* Controls */}
      <div className="p-2 border-b flex items-center justify-between bg-muted/30">
        <div className="flex items-center space-x-2">
          <Button 
            variant={is3DMode ? "default" : "outline"} 
            size="sm" 
            onClick={() => setIs3DMode(true)}
            className={is3DMode ? "liquid-gradient-button text-white" : "liquid-gradient-border"}
          >
            <Box className={`h-4 w-4 mr-2 ${is3DMode ? "text-white" : ""}`} />
            3D View
          </Button>
          <Button 
            variant={!is3DMode ? "default" : "outline"} 
            size="sm" 
            onClick={() => setIs3DMode(false)}
            className={!is3DMode ? "liquid-gradient-button text-white" : "liquid-gradient-border"}
          >
            <ZoomIn className={`h-4 w-4 mr-2 ${!is3DMode ? "text-white" : ""}`} />
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
          <div className="h-full relative">
            <div ref={canvasRef} className="w-full h-full">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/30 backdrop-blur-sm">
                  <div className="bg-card p-4 rounded-lg shadow-lg">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                    <p className="text-sm text-center font-medium">Loading 3D Model...</p>
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
            </div>
            <div className="absolute bottom-4 right-4 flex flex-col gap-2">
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full bg-background/70 backdrop-blur-sm shadow-lg"
                title="Reset view"
                onClick={() => {
                  // Reset the scene by force-updating the component
                  setIs3DMode(false);
                  setTimeout(() => setIs3DMode(true), 10);
                }}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center p-4">
            <div className="max-w-full max-h-full relative group">
              <img
                src={getMonumentImage()}
                alt={getMonumentName()}
                className="max-h-full max-w-full object-contain rounded-lg shadow-md"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button 
                  variant="outline" 
                  onClick={() => setIs3DMode(true)} 
                  className="liquid-gradient-button text-white hover:scale-105 transition-transform"
                >
                  <Box className="h-4 w-4 mr-2 text-white" />
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
          <h3 className="text-sm font-medium">{getMonumentName()}</h3>
          <p className="text-xs text-muted-foreground">
            {is3DMode ? 'Interactive 3D Model' : 'Image View'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ModelViewer;