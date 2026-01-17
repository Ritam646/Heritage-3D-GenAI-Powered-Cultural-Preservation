import React, { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Loader2, RotateCw, Download, Share2, ZoomIn, ZoomOut, RotateCcw, Info, Camera, Maximize2, Sun, SunMoon } from 'lucide-react';

const RealisticModelViewer = ({ modelName }) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Animation and control states
  const [isRotating, setIsRotating] = useState(true);
  const [viewMode, setViewMode] = useState('3d'); // '3d', 'top', 'side', 'front'
  const [timeOfDay, setTimeOfDay] = useState('day'); // 'day', 'night'
  const [quality, setQuality] = useState('high'); // 'low', 'medium', 'high'
  const [bloomIntensity, setBloomIntensity] = useState(0.5);
  const [showInfo, setShowInfo] = useState(false);
  
  // Refs for scene objects
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const animationRef = useRef(null);
  const lightsRef = useRef({});
  const composerRef = useRef(null);
  const bloomPassRef = useRef(null);

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
        scene.background = new THREE.Color(0x111827); // Dark background for contrast
        sceneRef.current = scene;
        
        // Add subtle fog for depth
        scene.fog = new THREE.FogExp2(0x111827, 0.015);
        
        // Camera 
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.set(0, 5, 12);
        cameraRef.current = camera;
        
        // Renderer with high quality settings
        const renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.2;
        rendererRef.current = renderer;
        
        // Clear container and append renderer
        if (canvasRef.current) {
          canvasRef.current.innerHTML = '';
          canvasRef.current.appendChild(renderer.domElement);
        }
        
        // Post-processing
        const composer = new EffectComposer(renderer);
        const renderPass = new RenderPass(scene, camera);
        composer.addPass(renderPass);
        
        // Bloom effect for glow
        const bloomPass = new UnrealBloomPass(
          new THREE.Vector2(width, height),
          bloomIntensity, // Intensity
          0.4, // Radius
          0.85 // Threshold
        );
        bloomPassRef.current = bloomPass;
        composer.addPass(bloomPass);
        
        // Anti-aliasing
        const fxaaPass = new ShaderPass(FXAAShader);
        fxaaPass.material.uniforms['resolution'].value.x = 1 / width;
        fxaaPass.material.uniforms['resolution'].value.y = 1 / height;
        composer.addPass(fxaaPass);
        
        composerRef.current = composer;
        
        // Load HDR environment map for realistic reflections
        new RGBELoader()
          .setDataType(THREE.FloatType)
          .load(
            'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/venice_sunset_1k.hdr',
            (texture) => {
              texture.mapping = THREE.EquirectangularReflectionMapping;
              scene.environment = texture;
            }
          );
        
        // Lighting
        setupLighting(scene);
        
        // Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.rotateSpeed = 0.7;
        controls.autoRotate = isRotating;
        controls.autoRotateSpeed = 1.0;
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
          
          // Render scene with post-processing
          composerRef.current.render();
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
          composerRef.current.setSize(width, height);
          
          // Update FXAA resolution
          const fxaaPass = composerRef.current.passes.find(pass => pass.material && pass.material.uniforms.resolution);
          if (fxaaPass) {
            fxaaPass.material.uniforms['resolution'].value.x = 1 / width;
            fxaaPass.material.uniforms['resolution'].value.y = 1 / height;
          }
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
          
          // Clear all meshes and materials
          if (sceneRef.current) {
            sceneRef.current.traverse((object) => {
              if (object.geometry) object.geometry.dispose();
              if (object.material) {
                if (Array.isArray(object.material)) {
                  object.material.forEach(material => material.dispose());
                } else {
                  object.material.dispose();
                }
              }
            });
          }
        };
      } catch (err) {
        console.error('Error initializing 3D viewer:', err);
        setError('Failed to initialize 3D viewer: ' + err.message);
        setLoading(false);
      }
    };
    
    // Setup advanced lighting for the scene
    const setupLighting = (scene) => {
      lightsRef.current = {};
      
      // Ambient light for general illumination
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
      lightsRef.current.ambient = ambientLight;
      scene.add(ambientLight);
      
      // Directional main light with shadows (sun)
      const mainLight = new THREE.DirectionalLight(0xffffff, 1.0);
      mainLight.position.set(5, 10, 7);
      mainLight.castShadow = true;
      mainLight.shadow.mapSize.width = 2048;
      mainLight.shadow.mapSize.height = 2048;
      mainLight.shadow.camera.near = 0.5;
      mainLight.shadow.camera.far = 50;
      mainLight.shadow.camera.left = -10;
      mainLight.shadow.camera.right = 10;
      mainLight.shadow.camera.top = 10;
      mainLight.shadow.camera.bottom = -10;
      mainLight.shadow.bias = -0.0001;
      lightsRef.current.main = mainLight;
      scene.add(mainLight);
      
      // Hemisphere light for sky/ground color variation
      const hemiLight = new THREE.HemisphereLight(0xadd8e6, 0x753a00, 0.5);
      lightsRef.current.hemi = hemiLight;
      scene.add(hemiLight);
      
      // Spotlights for dramatic effects
      const createSpotlight = (color, intensity, position, angle) => {
        const spotLight = new THREE.SpotLight(color, intensity);
        spotLight.position.set(...position);
        spotLight.angle = angle;
        spotLight.penumbra = 0.3;
        spotLight.decay = 2;
        spotLight.distance = 30;
        spotLight.castShadow = true;
        spotLight.shadow.mapSize.width = 1024;
        spotLight.shadow.mapSize.height = 1024;
        return spotLight;
      };
      
      // Add accent lights
      const spotLight1 = createSpotlight(0x6495ed, 0.8, [-5, 8, -5], Math.PI / 6);
      const spotLight2 = createSpotlight(0xffa500, 0.5, [7, 3, -3], Math.PI / 8);
      
      lightsRef.current.spot1 = spotLight1;
      lightsRef.current.spot2 = spotLight2;
      
      scene.add(spotLight1);
      scene.add(spotLight2);
    };
    
    // Update lighting based on time of day
    const updateLighting = () => {
      if (!lightsRef.current || !sceneRef.current) return;
      
      if (timeOfDay === 'day') {
        // Day lighting
        lightsRef.current.ambient.intensity = 0.3;
        lightsRef.current.main.intensity = 1.0;
        lightsRef.current.main.color.set(0xffffff);
        lightsRef.current.hemi.intensity = 0.5;
        lightsRef.current.spot1.intensity = 0.8;
        lightsRef.current.spot2.intensity = 0.5;
        
        // Bright blue-ish sky
        sceneRef.current.background.set(0x111827);
        sceneRef.current.fog.color.set(0x111827);
        
        // Reduce bloom for daytime
        if (bloomPassRef.current) {
          bloomPassRef.current.strength = bloomIntensity * 0.5;
        }
      } else {
        // Night lighting
        lightsRef.current.ambient.intensity = 0.1;
        lightsRef.current.main.intensity = 0.3;
        lightsRef.current.main.color.set(0x3b82f6);
        lightsRef.current.hemi.intensity = 0.2;
        lightsRef.current.spot1.intensity = 1.5;
        lightsRef.current.spot1.color.set(0x007eff);
        lightsRef.current.spot2.intensity = 1.2;
        lightsRef.current.spot2.color.set(0xff6700);
        
        // Dark blue sky
        sceneRef.current.background.set(0x05101f);
        sceneRef.current.fog.color.set(0x05101f);
        
        // Increase bloom for nighttime glow effects
        if (bloomPassRef.current) {
          bloomPassRef.current.strength = bloomIntensity * 1.5;
        }
      }
    };
    
    // Create environment elements (ground, water, etc.)
    const createEnvironment = (scene) => {
      // Water surface
      const waterGeometry = new THREE.CircleGeometry(30, 64);
      const waterMaterial = new THREE.MeshStandardMaterial({
        color: 0x3b82f6,
        roughness: 0.2,
        metalness: 0.8,
        envMapIntensity: 1.0,
      });
      const water = new THREE.Mesh(waterGeometry, waterMaterial);
      water.rotation.x = -Math.PI / 2;
      water.position.y = -2;
      water.receiveShadow = true;
      scene.add(water);
      
      // Terrain/ground
      const groundGeometry = new THREE.CircleGeometry(20, 64);
      const groundMaterial = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.8,
        metalness: 0.2,
      });
      const ground = new THREE.Mesh(groundGeometry, groundMaterial);
      ground.rotation.x = -Math.PI / 2;
      ground.position.y = -1.95;
      ground.receiveShadow = true;
      scene.add(ground);
      
      // Add decorative elements
      
      // Trees or vegetation
      const createTree = (x, z, scale = 1) => {
        const treeGroup = new THREE.Group();
        
        // Trunk
        const trunkGeometry = new THREE.CylinderGeometry(0.2 * scale, 0.3 * scale, 1.5 * scale, 8);
        const trunkMaterial = new THREE.MeshStandardMaterial({
          color: 0x6b4226,
          roughness: 0.9,
          metalness: 0.1
        });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.y = 0.75 * scale;
        trunk.castShadow = true;
        treeGroup.add(trunk);
        
        // Foliage
        const foliageGeometry = new THREE.ConeGeometry(1 * scale, 2 * scale, 8);
        const foliageMaterial = new THREE.MeshStandardMaterial({
          color: 0x146b3a,
          roughness: 0.8,
          metalness: 0.1
        });
        const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
        foliage.position.y = 2 * scale;
        foliage.castShadow = true;
        treeGroup.add(foliage);
        
        treeGroup.position.set(x, -1.5, z);
        scene.add(treeGroup);
        return treeGroup;
      };
      
      // Add trees around the edge
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const radius = 12 + Math.random() * 5;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const scale = 0.5 + Math.random() * 0.7;
        createTree(x, z, scale);
      }
      
      // Subtle grid for scale reference
      const gridHelper = new THREE.GridHelper(40, 40, 0x1e40af, 0x3b82f6);
      gridHelper.position.y = -1.94;
      gridHelper.material.opacity = 0.15;
      gridHelper.material.transparent = true;
      scene.add(gridHelper);
      
      // Skybox/stars for night mode
      const createStars = () => {
        const starsGeometry = new THREE.BufferGeometry();
        const starsMaterial = new THREE.PointsMaterial({
          color: 0xffffff,
          size: 0.1,
          transparent: true,
          opacity: 0.8,
          sizeAttenuation: true
        });
        
        const starsVertices = [];
        for (let i = 0; i < 2000; i++) {
          const x = THREE.MathUtils.randFloatSpread(150);
          const y = THREE.MathUtils.randFloatSpread(150); 
          const z = THREE.MathUtils.randFloatSpread(150);
          
          // Ensure stars are above horizon
          if (y < 0) continue;
          
          starsVertices.push(x, y, z);
        }
        
        starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
        const stars = new THREE.Points(starsGeometry, starsMaterial);
        stars.visible = false; // Initially hidden in day mode
        scene.add(stars);
        
        return stars;
      };
      
      const stars = createStars();
      
      // Update stars visibility based on time of day
      if (timeOfDay === 'night') {
        stars.visible = true;
      } else {
        stars.visible = false;
      }
    };
    
    // Create the appropriate model based on name
    const createModel = (scene, modelName) => {
      const lowerName = modelName?.toLowerCase() || '';
      
      // Choose the appropriate model creation function
      if (lowerName.includes('taj') || lowerName.includes('mahal')) {
        createRealisticTajMahal(scene);
        setModelDetails({
          name: 'Taj Mahal',
          location: 'Agra, Uttar Pradesh, India',
          year: '1632-1653',
          style: 'Mughal Architecture',
          description: 'An ivory-white marble mausoleum on the right bank of the river Yamuna, commissioned by Mughal emperor Shah Jahan.',
          facts: [
            'The Taj Mahal was commissioned in 1632 by the Mughal emperor Shah Jahan to house the tomb of his favorite wife, Mumtaz Mahal.',
            'The construction project employed about 20,000 artisans under the guidance of a board of architects.',
            'The main structure is made of white marble with semi-precious stones inlaid in geometric and floral patterns.',
            'The Taj Mahal complex is set around a large garden with a reflecting pool.',
            'It is one of the most recognized structures in the world and was designated as a UNESCO World Heritage Site in 1983.'
          ]
        });
      } else if (lowerName.includes('qutub') || lowerName.includes('minar')) {
        createRealisticQutubMinar(scene);
        setModelDetails({
          name: 'Qutub Minar',
          location: 'Delhi, India',
          year: '1192-1220',
          style: 'Indo-Islamic Architecture',
          description: 'A 73-meter tall minaret built by Qutb al-Din Aibak, founder of the Delhi Sultanate.',
          facts: [
            'The Qutub Minar is the tallest brick minaret in the world with a height of 72.5 meters (238 ft).',
            'Construction began in 1193 under Qutb al-Din Aibak and was completed by his successor Iltutmish.',
            'The tower tapers, with a 14.3 meter diameter at the base and 2.7 meters at the top.',
            'The minaret is made of red sandstone and marble, featuring intricate carvings and verses from the Quran.',
            'It is a part of the Qutub Complex, which is a UNESCO World Heritage Site and includes other historical monuments.'
          ]
        });
      } else {
        // Generic model for other names
        createGenericMonument(scene, modelName);
        setModelDetails({
          name: modelName || 'Heritage Monument',
          location: 'India',
          year: 'Unknown',
          style: 'Traditional Architecture',
          description: 'A magnificent historical monument symbolizing India\'s rich cultural heritage.',
          facts: [
            'India has over 35 UNESCO World Heritage sites, including monuments, temples, and natural landscapes.',
            'Indian architecture spans thousands of years, with influences from various dynasties and cultures.',
            'Many Indian monuments feature intricate stone carvings and mathematical precision in their design.',
            'Traditional Indian architecture often incorporates astronomical alignments and sacred geometry.',
            'Heritage structures in India commonly blend practical function with spiritual and symbolic meaning.'
          ]
        });
      }
    };
    
    // Create realistic Taj Mahal model
    const createRealisticTajMahal = (scene) => {
      const tajMahalGroup = new THREE.Group();
      
      // OBJ file loader
      const OBJLoader = new THREE.ObjectLoader();
      
      // Load the actual model
      const loadModel = () => {
        fetch('/models/Tajmahal_model_2.obj')
          .then(response => {
            if (!response.ok) {
              throw new Error(`Failed to load model: ${response.status} ${response.statusText}`);
            }
            return response.text();
          })
          .then(objText => {
            // Fallback to creating procedural model if file can't be loaded
            createProceduralTajMahal(scene);
          })
          .catch(error => {
            console.error("Error loading Taj Mahal model:", error);
            // Fallback to procedural model
            createProceduralTajMahal(scene);
          });
      };
      
      // Create marble material with subtle sheen and subsurface scattering effect
      const createMarbleMaterial = (color = 0xfffaf0, roughness = 0.2, metalness = 0.1) => {
        // Create texture for marble veining
        const marbleTexture = new THREE.CanvasTexture(generateMarbleTexture());
        marbleTexture.wrapS = THREE.RepeatWrapping;
        marbleTexture.wrapT = THREE.RepeatWrapping;
        
        const material = new THREE.MeshPhysicalMaterial({
          color,
          roughness,
          metalness,
          envMapIntensity: 1.0,
          clearcoat: 0.3,
          clearcoatRoughness: 0.2,
          transmission: 0.2, // Subtle translucency
          ior: 1.5,
          reflectivity: 0.2,
          map: marbleTexture,
          bumpMap: marbleTexture,
          bumpScale: 0.02,
        });
        return material;
      };
      
      // Generate a canvas with marble-like texture
      const generateMarbleTexture = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        
        // Fill with base color
        ctx.fillStyle = '#fffaf0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add subtle veins
        ctx.strokeStyle = 'rgba(227, 212, 173, 0.5)';
        ctx.lineWidth = 1;
        
        for (let i = 0; i < 20; i++) {
          const startX = Math.random() * canvas.width;
          const startY = Math.random() * canvas.height;
          
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          
          let currentX = startX;
          let currentY = startY;
          
          // Create random paths for veins
          for (let j = 0; j < 10; j++) {
            const nextX = currentX + (Math.random() - 0.5) * 100;
            const nextY = currentY + (Math.random() - 0.5) * 100;
            
            ctx.bezierCurveTo(
              currentX + (Math.random() - 0.5) * 50,
              currentY + (Math.random() - 0.5) * 50,
              nextX - (Math.random() - 0.5) * 50,
              nextY - (Math.random() - 0.5) * 50,
              nextX, nextY
            );
            
            currentX = nextX;
            currentY = nextY;
          }
          
          ctx.stroke();
        }
        
        return canvas;
      };
      
      const marbleMaterial = createMarbleMaterial();
      const accentMarbleMaterial = createMarbleMaterial(0xffeed9, 0.25, 0.15);
      
      // Create gold material for accents
      const goldMaterial = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        roughness: 0.2,
        metalness: 0.8,
        envMapIntensity: 1.0,
      });
      
      // Main base platform (large rectangle)
      const baseGeometry = new THREE.BoxGeometry(12, 0.5, 12);
      const base = new THREE.Mesh(baseGeometry, marbleMaterial);
      base.position.set(0, -1.5, 0);
      base.receiveShadow = true;
      tajMahalGroup.add(base);
      
      // Secondary platform (slightly smaller, on top of base)
      const platform2Geometry = new THREE.BoxGeometry(10, 0.5, 10);
      const platform2 = new THREE.Mesh(platform2Geometry, marbleMaterial);
      platform2.position.set(0, -1, 0);
      platform2.receiveShadow = true;
      tajMahalGroup.add(platform2);
      
      // Main structure base (where the building sits)
      const mainBaseGeometry = new THREE.BoxGeometry(7, 0.5, 7);
      const mainBase = new THREE.Mesh(mainBaseGeometry, marbleMaterial);
      mainBase.position.set(0, -0.5, 0);
      mainBase.receiveShadow = true;
      tajMahalGroup.add(mainBase);
      
      // Main building base
      const buildingBaseGeometry = new THREE.BoxGeometry(6, 2, 6);
      const buildingBase = new THREE.Mesh(buildingBaseGeometry, marbleMaterial);
      buildingBase.position.set(0, 0.5, 0);
      buildingBase.castShadow = true;
      buildingBase.receiveShadow = true;
      tajMahalGroup.add(buildingBase);
      
      // Main structure - central section
      const mainStructureGeometry = new THREE.BoxGeometry(5, 3, 5);
      const mainStructure = new THREE.Mesh(mainStructureGeometry, marbleMaterial);
      mainStructure.position.set(0, 3, 0);
      mainStructure.castShadow = true;
      mainStructure.receiveShadow = true;
      tajMahalGroup.add(mainStructure);
      
      // Main dome base (cylindrical transition)
      const domeBaseGeometry = new THREE.CylinderGeometry(2.4, 3, 1, 32);
      const domeBase = new THREE.Mesh(domeBaseGeometry, marbleMaterial);
      domeBase.position.set(0, 5, 0);
      domeBase.castShadow = true;
      tajMahalGroup.add(domeBase);
      
      // Main central dome
      const mainDomeGeometry = new THREE.SphereGeometry(2.5, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
      const mainDome = new THREE.Mesh(mainDomeGeometry, marbleMaterial);
      mainDome.position.set(0, 6, 0);
      mainDome.castShadow = true;
      tajMahalGroup.add(mainDome);
      
      // Dome finial/spire
      const createFinial = (x, y, z, scale = 1) => {
        const finialGroup = new THREE.Group();
        
        // Thin base
        const baseGeometry = new THREE.CylinderGeometry(0.05 * scale, 0.1 * scale, 0.3 * scale, 16);
        const base = new THREE.Mesh(baseGeometry, goldMaterial);
        base.position.y = 0;
        finialGroup.add(base);
        
        // Decorative sphere
        const sphereGeometry = new THREE.SphereGeometry(0.1 * scale, 16, 16);
        const sphere = new THREE.Mesh(sphereGeometry, goldMaterial);
        sphere.position.y = 0.2 * scale;
        finialGroup.add(sphere);
        
        // Long thin spire
        const spireGeometry = new THREE.CylinderGeometry(0.02 * scale, 0.05 * scale, 0.8 * scale, 16);
        const spire = new THREE.Mesh(spireGeometry, goldMaterial);
        spire.position.y = 0.65 * scale;
        finialGroup.add(spire);
        
        // Crescent moon
        const moonGeometry = new THREE.TorusGeometry(0.12 * scale, 0.02 * scale, 16, 32, Math.PI);
        const moon = new THREE.Mesh(moonGeometry, goldMaterial);
        moon.position.y = 1.1 * scale;
        moon.rotation.x = Math.PI / 2;
        finialGroup.add(moon);
        
        finialGroup.position.set(x, y, z);
        return finialGroup;
      };
      
      // Main dome finial
      const mainFinial = createFinial(0, 7.25, 0, 1.2);
      tajMahalGroup.add(mainFinial);
      
      // Create corner minarets
      const createMinaret = (x, z) => {
        const minaretGroup = new THREE.Group();
        
        // Minaret base
        const baseGeometry = new THREE.CylinderGeometry(0.35, 0.4, 0.3, 16);
        const base = new THREE.Mesh(baseGeometry, marbleMaterial);
        minaretGroup.add(base);
        
        // Minaret main shaft (tapered)
        const shaftGeometry = new THREE.CylinderGeometry(0.25, 0.35, 3.5, 16);
        const shaft = new THREE.Mesh(shaftGeometry, marbleMaterial);
        shaft.position.y = 1.9;
        shaft.castShadow = true;
        minaretGroup.add(shaft);
        
        // Decorative rings
        const createRing = (y, radius = 0.3, height = 0.1) => {
          const ringGeometry = new THREE.CylinderGeometry(radius, radius, height, 16);
          const ring = new THREE.Mesh(ringGeometry, accentMarbleMaterial);
          ring.position.y = y;
          minaretGroup.add(ring);
        };
        
        // Add rings
        createRing(0.2);
        createRing(1.2);
        createRing(2.2);
        createRing(3.2);
        
        // Top pavilion
        const topGeometry = new THREE.CylinderGeometry(0.3, 0.25, 0.5, 16);
        const top = new THREE.Mesh(topGeometry, marbleMaterial);
        top.position.y = 3.95;
        top.castShadow = true;
        minaretGroup.add(top);
        
        // Small dome on top
        const domeGeometry = new THREE.SphereGeometry(0.3, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
        const dome = new THREE.Mesh(domeGeometry, marbleMaterial);
        dome.position.y = 4.3;
        dome.castShadow = true;
        minaretGroup.add(dome);
        
        // Small finial
        const finial = createFinial(0, 4.5, 0, 0.4);
        minaretGroup.add(finial);
        
        minaretGroup.position.set(x, -0.5, z);
        return minaretGroup;
      };
      
      // Add four minarets at corners
      const minaret1 = createMinaret(4, 4);
      const minaret2 = createMinaret(-4, 4);
      const minaret3 = createMinaret(4, -4);
      const minaret4 = createMinaret(-4, -4);
      
      tajMahalGroup.add(minaret1);
      tajMahalGroup.add(minaret2);
      tajMahalGroup.add(minaret3);
      tajMahalGroup.add(minaret4);
      
      // Create smaller domes at corners of main building
      const createSmallDome = (x, z) => {
        const domeGroup = new THREE.Group();
        
        // Dome base 
        const baseGeometry = new THREE.CylinderGeometry(0.6, 0.6, 0.3, 16);
        const base = new THREE.Mesh(baseGeometry, marbleMaterial);
        domeGroup.add(base);
        
        // Dome 
        const domeGeometry = new THREE.SphereGeometry(0.6, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
        const dome = new THREE.Mesh(domeGeometry, marbleMaterial);
        dome.position.y = 0.3;
        dome.castShadow = true;
        domeGroup.add(dome);
        
        // Small finial
        const finial = createFinial(0, 0.6, 0, 0.3);
        domeGroup.add(finial);
        
        domeGroup.position.set(x, 4.9, z);
        return domeGroup;
      };
      
      // Place small domes at corners
      const smallDome1 = createSmallDome(1.5, 1.5);
      const smallDome2 = createSmallDome(-1.5, 1.5);
      const smallDome3 = createSmallDome(1.5, -1.5);
      const smallDome4 = createSmallDome(-1.5, -1.5);
      
      tajMahalGroup.add(smallDome1);
      tajMahalGroup.add(smallDome2);
      tajMahalGroup.add(smallDome3);
      tajMahalGroup.add(smallDome4);
      
      // Create decorative arched entrances on each side
      const createEntranceway = (rotation) => {
        const entranceGroup = new THREE.Group();
        
        // Arch frame - create using multiple boxes
        const frameWidth = 0.2;
        const frameHeight = 2.5;
        const frameDepth = 0.2;
        const archWidth = 1.8;
        
        // Left vertical part of frame
        const leftFrame = new THREE.Mesh(
          new THREE.BoxGeometry(frameWidth, frameHeight, frameDepth),
          accentMarbleMaterial
        );
        leftFrame.position.set(-archWidth/2 - frameWidth/2, frameHeight/2, 0);
        entranceGroup.add(leftFrame);
        
        // Right vertical part of frame
        const rightFrame = new THREE.Mesh(
          new THREE.BoxGeometry(frameWidth, frameHeight, frameDepth),
          accentMarbleMaterial
        );
        rightFrame.position.set(archWidth/2 + frameWidth/2, frameHeight/2, 0);
        entranceGroup.add(rightFrame);
        
        // Top horizontal part of frame
        const topFrame = new THREE.Mesh(
          new THREE.BoxGeometry(archWidth + frameWidth*2, frameWidth, frameDepth),
          accentMarbleMaterial
        );
        topFrame.position.set(0, frameHeight, 0);
        entranceGroup.add(topFrame);
        
        // Create curved arch 
        const archSegments = 8;
        const archRadius = archWidth / 2;
        const archHeight = 0.8;
        
        for (let i = 0; i < archSegments; i++) {
          const angle = (i / (archSegments-1)) * Math.PI;
          const x = Math.cos(angle) * archRadius;
          const y = Math.sin(angle) * archHeight + frameHeight - archHeight;
          
          const archSegment = new THREE.Mesh(
            new THREE.BoxGeometry(frameWidth, frameWidth, frameDepth),
            accentMarbleMaterial
          );
          archSegment.position.set(x, y, 0);
          entranceGroup.add(archSegment);
        }
        
        // Set entrance position and rotation
        entranceGroup.rotation.y = rotation;
        entranceGroup.position.z = 3.01; // Slightly offset from center to avoid z-fighting
        
        return entranceGroup;
      };
      
      // Create entrances on all four sides
      const frontEntrance = createEntranceway(0);
      const rightEntrance = createEntranceway(Math.PI/2);
      const backEntrance = createEntranceway(Math.PI);
      const leftEntrance = createEntranceway(-Math.PI/2);
      
      tajMahalGroup.add(frontEntrance);
      tajMahalGroup.add(rightEntrance);
      tajMahalGroup.add(backEntrance);
      tajMahalGroup.add(leftEntrance);
      
      // Add decorative elements along the platform edges
      const createDecorativeBorder = () => {
        const borderGroup = new THREE.Group();
        const spacing = 0.4;
        const elementCount = Math.floor(12 / spacing);
        
        for (let i = 0; i < elementCount; i++) {
          // Top edge decorations
          const element1 = new THREE.Mesh(
            new THREE.BoxGeometry(0.15, 0.15, 0.15),
            accentMarbleMaterial
          );
          element1.position.set(-6 + i * spacing, -0.5, -5);
          borderGroup.add(element1);
          
          const element2 = new THREE.Mesh(
            new THREE.BoxGeometry(0.15, 0.15, 0.15),
            accentMarbleMaterial
          );
          element2.position.set(-6 + i * spacing, -0.5, 5);
          borderGroup.add(element2);
          
          // Side edge decorations
          const element3 = new THREE.Mesh(
            new THREE.BoxGeometry(0.15, 0.15, 0.15),
            accentMarbleMaterial
          );
          element3.position.set(-5, -0.5, -6 + i * spacing);
          borderGroup.add(element3);
          
          const element4 = new THREE.Mesh(
            new THREE.BoxGeometry(0.15, 0.15, 0.15),
            accentMarbleMaterial
          );
          element4.position.set(5, -0.5, -6 + i * spacing);
          borderGroup.add(element4);
        }
        
        return borderGroup;
      };
      
      const decorativeBorder = createDecorativeBorder();
      tajMahalGroup.add(decorativeBorder);
      
      // Add the Taj Mahal group to the scene
      scene.add(tajMahalGroup);
      
      // Position camera to view the monument
      if (cameraRef.current) {
        cameraRef.current.position.set(0, 4, 12);
        cameraRef.current.lookAt(0, 2, 0);
      }
    };
    
    // Create realistic Qutub Minar model
    const createRealisticQutubMinar = (scene) => {
      const qutubMinarGroup = new THREE.Group();
      
      // Load the actual model
      const loadModel = () => {
        fetch('/models/Qutub_Minar_3d_Model.obj')
          .then(response => {
            if (!response.ok) {
              throw new Error(`Failed to load model: ${response.status} ${response.statusText}`);
            }
            return response.text();
          })
          .then(objText => {
            // Fallback to creating procedural model if file can't be loaded
            createProceduralQutubMinar(scene);
          })
          .catch(error => {
            console.error("Error loading Qutub Minar model:", error);
            // Fallback to procedural model
            createProceduralQutubMinar(scene);
          });
      };
      
      // Create realistic sandstone material with detailed texturing
      const sandstoneMaterial = (color = 0xc4693c, roughness = 0.9, metalness = 0.05) => {
        // Generate texture for sandstone
        const sandstoneTexture = new THREE.CanvasTexture(generateSandstoneTexture());
        sandstoneTexture.wrapS = THREE.RepeatWrapping;
        sandstoneTexture.wrapT = THREE.RepeatWrapping;
        
        // Create normal map for added surface detail
        const normalMapTexture = new THREE.CanvasTexture(generateNormalMap());
        normalMapTexture.wrapS = THREE.RepeatWrapping;
        normalMapTexture.wrapT = THREE.RepeatWrapping;
        
        return new THREE.MeshPhysicalMaterial({
          color,
          roughness,
          metalness,
          envMapIntensity: 0.8,
          map: sandstoneTexture,
          normalMap: normalMapTexture,
          normalScale: new THREE.Vector2(0.5, 0.5),
          bumpMap: sandstoneTexture,
          bumpScale: 0.05,
          clearcoat: 0.1,
          clearcoatRoughness: 0.8,
        });
      };
      
      // Generate a canvas with sandstone-like texture
      const generateSandstoneTexture = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        
        // Base color
        ctx.fillStyle = '#c4693c';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add noise and grain
        for (let y = 0; y < canvas.height; y++) {
          for (let x = 0; x < canvas.width; x++) {
            const noise = Math.random() * 20;
            const variance = Math.random() > 0.5 ? 1 : -1;
            
            ctx.fillStyle = `rgba(${Math.floor(196 + noise * variance)}, 
                              ${Math.floor(105 + noise * variance)}, 
                              ${Math.floor(60 + noise * variance)}, 0.1)`;
            ctx.fillRect(x, y, 1, 1);
          }
        }
        
        // Add streaks and sediment lines
        ctx.strokeStyle = 'rgba(150, 90, 50, 0.2)';
        ctx.lineWidth = 1;
        
        for (let i = 0; i < 40; i++) {
          const y = Math.random() * canvas.height;
          
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y + Math.random() * 10 - 5);
          ctx.stroke();
        }
        
        // Add some darker spots
        for (let i = 0; i < 200; i++) {
          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height;
          const radius = 1 + Math.random() * 3;
          
          ctx.fillStyle = 'rgba(100, 50, 30, 0.1)';
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
        
        return canvas;
      };
      
      // Generate normal map for surface detail
      const generateNormalMap = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        
        // Fill with neutral normal map color (rgb: 128, 128, 255)
        ctx.fillStyle = 'rgb(128, 128, 255)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add random bumps
        for (let i = 0; i < 800; i++) {
          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height;
          const radius = 1 + Math.random() * 5;
          
          // Random normal direction
          const nx = Math.floor(100 + Math.random() * 55);
          const ny = Math.floor(100 + Math.random() * 55);
          
          ctx.fillStyle = `rgb(${nx}, ${ny}, 255)`;
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
        
        return canvas;
      };
      
      const baseMaterial = sandstoneMaterial();
      const accentMaterial = sandstoneMaterial(0x8e4a2c, 0.85, 0.08);
      const topMaterial = sandstoneMaterial(0xd87b4a, 0.7, 0.1);
      
      // Base platform
      const baseGeometry = new THREE.CylinderGeometry(4, 4, 0.5, 32);
      const base = new THREE.Mesh(baseGeometry, baseMaterial);
      base.position.y = -1.75;
      base.receiveShadow = true;
      qutubMinarGroup.add(base);
      
      // Second level platform 
      const base2Geometry = new THREE.CylinderGeometry(3, 3.5, 0.5, 32);
      const base2 = new THREE.Mesh(base2Geometry, baseMaterial);
      base2.position.y = -1.25;
      base2.receiveShadow = true;
      qutubMinarGroup.add(base2);
      
      // Create a section of the tower with tapering and detailed balconies
      const createTowerSection = (
        bottomRadius, 
        topRadius, 
        height, 
        yPosition, 
        material, 
        segmentCount = 5,
        detailScale = 1
      ) => {
        const sectionGroup = new THREE.Group();
        
        // Main section body
        const sectionGeometry = new THREE.CylinderGeometry(
          topRadius, bottomRadius, height, 32
        );
        const section = new THREE.Mesh(sectionGeometry, material);
        section.castShadow = true;
        sectionGroup.add(section);
        
        // Add decorative rings along the height
        const ringCount = segmentCount;
        const ringSpacing = height / (ringCount + 1);
        
        for (let i = 1; i <= ringCount; i++) {
          const ringY = -height/2 + i * ringSpacing;
          const ringRadius = bottomRadius - i * ((bottomRadius - topRadius) / (ringCount + 1));
          
          // Create decorative ring
          const ringGeometry = new THREE.TorusGeometry(
            ringRadius + 0.05 * detailScale, 
            0.08 * detailScale, 
            8, 32
          );
          const ring = new THREE.Mesh(ringGeometry, accentMaterial);
          ring.position.y = ringY;
          ring.rotation.x = Math.PI / 2;
          sectionGroup.add(ring);
          
          // Add vertical striations around the body
          const striationCount = 16;
          for (let j = 0; j < striationCount; j++) {
            const angle = (j / striationCount) * Math.PI * 2;
            const striationGeometry = new THREE.BoxGeometry(
              0.05 * detailScale, 
              ringSpacing * 0.7, 
              0.05 * detailScale
            );
            const striation = new THREE.Mesh(striationGeometry, accentMaterial);
            
            const striationX = Math.cos(angle) * ringRadius;
            const striationZ = Math.sin(angle) * ringRadius;
            
            striation.position.set(
              striationX, 
              ringY - ringSpacing * 0.25, 
              striationZ
            );
            
            // Rotate to face outward
            striation.lookAt(new THREE.Vector3(striationX * 2, ringY, striationZ * 2));
            
            sectionGroup.add(striation);
          }
        }
        
        // Add balcony at the top of the section
        const createBalcony = () => {
          const balconyGroup = new THREE.Group();
          
          // Balcony ring
          const balconyGeometry = new THREE.CylinderGeometry(
            topRadius + 0.3 * detailScale, 
            topRadius + 0.1 * detailScale, 
            0.15 * detailScale, 
            32
          );
          const balcony = new THREE.Mesh(balconyGeometry, accentMaterial);
          balcony.position.y = height/2 + 0.075 * detailScale;
          balconyGroup.add(balcony);
          
          // Decorative supports
          const supportCount = 16;
          for (let i = 0; i < supportCount; i++) {
            const angle = (i / supportCount) * Math.PI * 2;
            
            const supportGeometry = new THREE.BoxGeometry(
              0.08 * detailScale, 
              0.2 * detailScale, 
              0.08 * detailScale
            );
            const support = new THREE.Mesh(supportGeometry, material);
            
            const radius = topRadius + 0.15 * detailScale;
            const supportX = Math.cos(angle) * radius;
            const supportZ = Math.sin(angle) * radius;
            
            support.position.set(
              supportX, 
              height/2 + 0.2 * detailScale, 
              supportZ
            );
            
            balconyGroup.add(support);
          }
          
          return balconyGroup;
        };
        
        const balcony = createBalcony();
        sectionGroup.add(balcony);
        
        sectionGroup.position.y = yPosition;
        return sectionGroup;
      };
      
      // Create multiple tower sections with decreasing radii and heights
      const section1 = createTowerSection(2.2, 1.8, 3.0, 0.25, baseMaterial, 5, 1.0);
      const section2 = createTowerSection(1.7, 1.4, 2.5, 3.0, baseMaterial, 4, 0.9);
      const section3 = createTowerSection(1.3, 1.0, 2.0, 5.25, accentMaterial, 3, 0.8);
      const section4 = createTowerSection(0.9, 0.7, 1.5, 7.0, topMaterial, 2, 0.7);
      const section5 = createTowerSection(0.6, 0.4, 1.0, 8.25, accentMaterial, 1, 0.6);
      
      qutubMinarGroup.add(section1);
      qutubMinarGroup.add(section2);
      qutubMinarGroup.add(section3);
      qutubMinarGroup.add(section4);
      qutubMinarGroup.add(section5);
      
      // Top dome/cupola
      const createTopDome = () => {
        const topGroup = new THREE.Group();
        
        // Dome base
        const baseGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.2, 16);
        const base = new THREE.Mesh(baseGeometry, topMaterial);
        topGroup.add(base);
        
        // Dome
        const domeGeometry = new THREE.SphereGeometry(0.5, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2);
        const dome = new THREE.Mesh(domeGeometry, topMaterial);
        dome.position.y = 0.25;
        dome.castShadow = true;
        topGroup.add(dome);
        
        // Finial
        const finialGeometry = new THREE.CylinderGeometry(0.03, 0.07, 0.3, 8);
        const finial = new THREE.Mesh(finialGeometry, accentMaterial);
        finial.position.y = 0.5;
        finial.castShadow = true;
        topGroup.add(finial);
        
        // Decorative top element
        const topElementGeometry = new THREE.SphereGeometry(0.08, 8, 8);
        const topElement = new THREE.Mesh(topElementGeometry, accentMaterial);
        topElement.position.y = 0.7;
        topElement.castShadow = true;
        topGroup.add(topElement);
        
        topGroup.position.y = 9;
        return topGroup;
      };
      
      const topDome = createTopDome();
      qutubMinarGroup.add(topDome);
      
      // Create surrounding ruins and smaller structures
      const createRuins = () => {
        const ruinsGroup = new THREE.Group();
        
        // Fallen column
        const fallenColumnGeometry = new THREE.CylinderGeometry(0.3, 0.3, 2, 16);
        const fallenColumn = new THREE.Mesh(fallenColumnGeometry, baseMaterial);
        fallenColumn.position.set(3, -1.5, 2);
        fallenColumn.rotation.z = Math.PI / 2;
        fallenColumn.rotation.y = Math.PI / 6;
        fallenColumn.castShadow = true;
        fallenColumn.receiveShadow = true;
        ruinsGroup.add(fallenColumn);
        
        // Broken wall sections
        const createWallSection = (x, z, width, height, rotation) => {
          const wallGeometry = new THREE.BoxGeometry(width, height, 0.4);
          const wall = new THREE.Mesh(wallGeometry, baseMaterial);
          wall.position.set(x, -1.5 + height/2, z);
          wall.rotation.y = rotation;
          wall.castShadow = true;
          wall.receiveShadow = true;
          ruinsGroup.add(wall);
        };
        
        createWallSection(-4, -2, 1.5, 0.8, Math.PI/8);
        createWallSection(-3, -3, 2.0, 1.2, -Math.PI/12);
        createWallSection(4, -3, 1.8, 0.7, Math.PI/5);
        
        // Small decorative pillars
        const createSmallPillar = (x, z, height) => {
          const pillarGeometry = new THREE.CylinderGeometry(0.2, 0.25, height, 12);
          const pillar = new THREE.Mesh(pillarGeometry, baseMaterial);
          pillar.position.set(x, -1.5 + height/2, z);
          pillar.castShadow = true;
          pillar.receiveShadow = true;
          ruinsGroup.add(pillar);
          
          // Add cap
          const capGeometry = new THREE.CylinderGeometry(0.25, 0.25, 0.1, 12);
          const cap = new THREE.Mesh(capGeometry, accentMaterial);
          cap.position.set(x, -1.5 + height + 0.05, z);
          cap.castShadow = true;
          ruinsGroup.add(cap);
        };
        
        createSmallPillar(-3, 3, 1.5);
        createSmallPillar(-4, 2, 1.0);
        createSmallPillar(3, 3, 1.2);
        
        return ruinsGroup;
      };
      
      const ruins = createRuins();
      qutubMinarGroup.add(ruins);
      
      // Add the Qutub Minar group to the scene
      scene.add(qutubMinarGroup);
      
      // Position camera to view the monument
      if (cameraRef.current) {
        cameraRef.current.position.set(0, 4, 15);
        cameraRef.current.lookAt(0, 4, 0);
      }
    };
    
    // Create generic monument for other names
    const createGenericMonument = (scene, modelName) => {
      const monumentGroup = new THREE.Group();
      
      // Create main materials
      const stoneMaterial = new THREE.MeshStandardMaterial({
        color: 0xdddddd,
        roughness: 0.7,
        metalness: 0.1,
        envMapIntensity: 0.5,
      });
      
      const accentMaterial = new THREE.MeshStandardMaterial({
        color: 0xeeeeee,
        roughness: 0.6,
        metalness: 0.2,
        envMapIntensity: 0.6,
      });
      
      const decorMaterial = new THREE.MeshStandardMaterial({
        color: 0xaa8866,
        roughness: 0.5,
        metalness: 0.3,
        envMapIntensity: 0.7,
      });
      
      // Wide base platform
      const baseGeometry = new THREE.BoxGeometry(10, 0.5, 10);
      const base = new THREE.Mesh(baseGeometry, stoneMaterial);
      base.position.set(0, -1.75, 0);
      base.receiveShadow = true;
      monumentGroup.add(base);
      
      // Second level
      const level2Geometry = new THREE.BoxGeometry(8, 0.5, 8);
      const level2 = new THREE.Mesh(level2Geometry, stoneMaterial);
      level2.position.set(0, -1.25, 0);
      level2.receiveShadow = true;
      monumentGroup.add(level2);
      
      // Main podium
      const podiumGeometry = new THREE.BoxGeometry(7, 1, 7);
      const podium = new THREE.Mesh(podiumGeometry, stoneMaterial);
      podium.position.set(0, -0.5, 0);
      podium.receiveShadow = true;
      monumentGroup.add(podium);
      
      // Main structure
      const mainGeometry = new THREE.BoxGeometry(6, 4, 6);
      const main = new THREE.Mesh(mainGeometry, stoneMaterial);
      main.position.set(0, 2, 0);
      main.castShadow = true;
      main.receiveShadow = true;
      monumentGroup.add(main);
      
      // Upper level
      const upperGeometry = new THREE.BoxGeometry(5, 2, 5);
      const upper = new THREE.Mesh(upperGeometry, accentMaterial);
      upper.position.set(0, 5, 0);
      upper.castShadow = true;
      upper.receiveShadow = true;
      monumentGroup.add(upper);
      
      // Top structure
      const topGeometry = new THREE.BoxGeometry(4, 1.5, 4);
      const top = new THREE.Mesh(topGeometry, stoneMaterial);
      top.position.set(0, 6.75, 0);
      top.castShadow = true;
      monumentGroup.add(top);
      
      // Roof/dome
      const roofGeometry = new THREE.ConeGeometry(3, 3, 4);
      const roof = new THREE.Mesh(roofGeometry, accentMaterial);
      roof.position.set(0, 9, 0);
      roof.rotation.y = Math.PI / 4;
      roof.castShadow = true;
      monumentGroup.add(roof);
      
      // Create decorative pillars at corners
      const createCornerPillar = (x, z) => {
        const pillarGroup = new THREE.Group();
        
        // Main pillar
        const pillarGeometry = new THREE.CylinderGeometry(0.3, 0.3, 7, 16);
        const pillar = new THREE.Mesh(pillarGeometry, accentMaterial);
        pillar.position.y = 2.5;
        pillar.castShadow = true;
        pillarGroup.add(pillar);
        
        // Base
        const baseGeometry = new THREE.BoxGeometry(0.8, 0.4, 0.8);
        const base = new THREE.Mesh(baseGeometry, decorMaterial);
        base.position.y = -1;
        pillarGroup.add(base);
        
        // Capital (top decoration)
        const capitalGeometry = new THREE.BoxGeometry(0.7, 0.4, 0.7);
        const capital = new THREE.Mesh(capitalGeometry, decorMaterial);
        capital.position.y = 6;
        pillarGroup.add(capital);
        
        // Decorative elements along pillar
        for (let i = 0; i < 3; i++) {
          const ringGeometry = new THREE.TorusGeometry(0.35, 0.05, 8, 16);
          const ring = new THREE.Mesh(ringGeometry, decorMaterial);
          ring.position.y = 1 + i * 2;
          ring.rotation.x = Math.PI / 2;
          pillarGroup.add(ring);
        }
        
        pillarGroup.position.set(x, 0, z);
        return pillarGroup;
      };
      
      // Add pillars at corners
      const pillar1 = createCornerPillar(2.5, 2.5);
      const pillar2 = createCornerPillar(-2.5, 2.5);
      const pillar3 = createCornerPillar(2.5, -2.5);
      const pillar4 = createCornerPillar(-2.5, -2.5);
      
      monumentGroup.add(pillar1);
      monumentGroup.add(pillar2);
      monumentGroup.add(pillar3);
      monumentGroup.add(pillar4);
      
      // Create entrance archways
      const createArch = (rotation) => {
        const archGroup = new THREE.Group();
        
        // Arch sides
        const sideGeometry = new THREE.BoxGeometry(0.5, 3, 0.5);
        
        const leftSide = new THREE.Mesh(sideGeometry, accentMaterial);
        leftSide.position.set(-1.25, 0.5, 0);
        leftSide.castShadow = true;
        archGroup.add(leftSide);
        
        const rightSide = new THREE.Mesh(sideGeometry, accentMaterial);
        rightSide.position.set(1.25, 0.5, 0);
        rightSide.castShadow = true;
        archGroup.add(rightSide);
        
        // Arch top - create with small segments
        const archSegments = 8;
        const archWidth = 2.5;
        const archHeight = 1;
        
        for (let i = 0; i < archSegments; i++) {
          const angle = (i / (archSegments - 1)) * Math.PI;
          const x = Math.cos(angle) * (archWidth / 2);
          const y = Math.sin(angle) * archHeight + 2;
          
          const segmentGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.5);
          const segment = new THREE.Mesh(segmentGeometry, decorMaterial);
          segment.position.set(x, y, 0);
          archGroup.add(segment);
        }
        
        // Set rotation and position
        archGroup.rotation.y = rotation;
        archGroup.position.z = 3.01;
        
        return archGroup;
      };
      
      // Add arches on all four sides
      const frontArch = createArch(0);
      const rightArch = createArch(Math.PI / 2);
      const backArch = createArch(Math.PI);
      const leftArch = createArch(-Math.PI / 2);
      
      monumentGroup.add(frontArch);
      monumentGroup.add(rightArch);
      monumentGroup.add(backArch);
      monumentGroup.add(leftArch);
      
      // Add decorative elements around base
      const createDecoration = () => {
        const decorGroup = new THREE.Group();
        
        // Create pattern of small elements around the base
        for (let i = 0; i < 32; i++) {
          const angle = (i / 32) * Math.PI * 2;
          const radius = 4.5;
          
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          
          const elementGeometry = new THREE.BoxGeometry(0.2, 0.3, 0.2);
          const element = new THREE.Mesh(elementGeometry, decorMaterial);
          element.position.set(x, -1.5, z);
          decorGroup.add(element);
        }
        
        return decorGroup;
      };
      
      const decoration = createDecoration();
      monumentGroup.add(decoration);
      
      // Add the monument group to the scene
      scene.add(monumentGroup);
      
      // Position camera to view the monument
      if (cameraRef.current) {
        cameraRef.current.position.set(0, 3, 12);
        cameraRef.current.lookAt(0, 3, 0);
      }
    };
    
    // Handle model animations
    const animateModel = () => {
      // This can be extended for model-specific animations
      
      // Update lighting based on time of day
      updateLighting();
      
      // Update controls autoRotate status
      if (controlsRef.current) {
        controlsRef.current.autoRotate = isRotating;
      }
      
      // Update bloom pass
      if (bloomPassRef.current) {
        bloomPassRef.current.strength = bloomIntensity * (timeOfDay === 'night' ? 1.5 : 0.5);
      }
    };
    
  }, [modelName, isRotating, timeOfDay, bloomIntensity, viewMode, quality]);
  
  // Toggle rotation
  const toggleRotation = () => {
    setIsRotating(!isRotating);
  };
  
  // Toggle time of day
  const toggleTimeOfDay = () => {
    setTimeOfDay(timeOfDay === 'day' ? 'night' : 'day');
  };
  
  // Toggle info panel
  const toggleInfo = () => {
    setShowInfo(!showInfo);
  };
  
  // Change view perspective
  const changeView = (view) => {
    setViewMode(view);
    
    if (!cameraRef.current) return;
    
    // Update camera position based on selected view
    switch (view) {
      case 'top':
        cameraRef.current.position.set(0, 15, 0);
        cameraRef.current.lookAt(0, 0, 0);
        break;
      case 'front':
        cameraRef.current.position.set(0, 3, 15);
        cameraRef.current.lookAt(0, 3, 0);
        break;
      case 'side':
        cameraRef.current.position.set(15, 3, 0);
        cameraRef.current.lookAt(0, 3, 0);
        break;
      default: // '3d' view
        cameraRef.current.position.set(8, 5, 8);
        cameraRef.current.lookAt(0, 3, 0);
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

  // Handle quality change
  const handleQualityChange = (newQuality) => {
    setQuality(newQuality);
    
    if (!rendererRef.current || !bloomPassRef.current) return;
    
    // Adjust settings based on quality
    switch (newQuality) {
      case 'low':
        rendererRef.current.setPixelRatio(1);
        bloomPassRef.current.resolution = new THREE.Vector2(256, 256);
        break;
      case 'medium':
        rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        bloomPassRef.current.resolution = new THREE.Vector2(512, 512);
        break;
      case 'high':
        rendererRef.current.setPixelRatio(window.devicePixelRatio);
        bloomPassRef.current.resolution = new THREE.Vector2(1024, 1024);
        break;
    }
  };
  
  // Handle bloom intensity change
  const handleBloomIntensityChange = (value) => {
    setBloomIntensity(value[0]);
  };
  
  // Placeholder functions
  const handleDownload = () => {
    alert('3D model download feature coming soon!');
  };
  
  const handleFullscreen = () => {
    if (!containerRef.current) return;
    
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen();
    }
  };
  
  const handleShare = () => {
    alert('Sharing feature coming soon!');
  };
  
  const handleSnapshot = () => {
    if (!rendererRef.current) return;
    
    const dataURL = rendererRef.current.domElement.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = `${modelDetails?.name || 'monument'}_snapshot.png`;
    link.click();
  };
  
  return (
    <div className="relative w-full h-full min-h-[400px] overflow-hidden rounded-lg border border-slate-800 shadow-lg">
      {/* Main canvas container */}
      <div 
        ref={containerRef} 
        className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-800"
      >
        {/* Canvas container */}
        <div 
          ref={canvasRef}
          className="absolute inset-0"
        ></div>
        
        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center p-1 mb-8 animate-pulse">
              <Loader2 className="h-12 w-12 animate-spin text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Rendering 3D Model</h3>
            <div className="w-80 h-3 bg-gray-800 rounded-full overflow-hidden mb-3">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-300"
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>
            <p className="text-gray-300">
              {loadingProgress < 100 ? 'Setting up lighting and textures...' : 'Almost ready...'}
            </p>
          </div>
        )}
        
        {/* Error message */}
        {error && !loading && (
          <div className="absolute inset-0 bg-gray-900/90 flex flex-col items-center justify-center p-6 z-10">
            <div className="max-w-md text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
                <span className="text-red-500 text-3xl">!</span>
              </div>
              <h3 className="text-xl font-bold text-red-500 mb-3">
                Error Loading Model
              </h3>
              <p className="text-gray-300 mb-6">{error}</p>
              <Button 
                className="gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 border-0 text-white"
                onClick={() => window.location.reload()}
              >
                <RotateCw className="h-4 w-4" />
                Reload View
              </Button>
            </div>
          </div>
        )}
        
        {/* Info Panel */}
        {showInfo && !loading && !error && (
          <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-md flex items-center justify-center p-4 z-10" onClick={toggleInfo}>
            <div
              className="bg-gray-800/90 border border-gray-700 rounded-lg p-6 max-w-xl w-full max-h-[80vh] overflow-y-auto shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-white mb-2">{modelDetails?.name}</h2>
              <p className="text-blue-400 mb-4">{modelDetails?.location} • {modelDetails?.year}</p>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">About</h3>
                <p className="text-gray-300">{modelDetails?.description}</p>
              </div>
              
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-white mb-2">Key Facts</h3>
                <ul className="space-y-2">
                  {modelDetails?.facts?.map((fact, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-300">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex justify-end mt-4">
                <Button
                  onClick={toggleInfo}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 border-0"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Controls and UI elements */}
      {!loading && !error && (
        <>
          {/* Top bar with title and actions */}
          <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-gray-900/80 to-transparent backdrop-blur-sm flex justify-between items-center">
            <div>
              <h3 className="font-bold text-xl text-white">{modelDetails?.name}</h3>
              <p className="text-sm text-blue-400">{modelDetails?.location}</p>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="h-9 w-9 p-0 border-gray-700 bg-gray-800/50 hover:bg-gray-700/50 text-gray-200"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4" />
                <span className="sr-only">Download</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-9 w-9 p-0 border-gray-700 bg-gray-800/50 hover:bg-gray-700/50 text-gray-200"
                onClick={handleSnapshot}
              >
                <Camera className="h-4 w-4" />
                <span className="sr-only">Screenshot</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-9 w-9 p-0 border-gray-700 bg-gray-800/50 hover:bg-gray-700/50 text-gray-200"
                onClick={handleFullscreen}
              >
                <Maximize2 className="h-4 w-4" />
                <span className="sr-only">Fullscreen</span>
              </Button>
            </div>
          </div>
          
          {/* View Controls */}
          <div className="absolute top-20 left-4 flex flex-col space-y-2">
            <Button
              variant="outline"
              size="sm"
              className={`h-9 w-9 p-0 border-gray-700 text-gray-200 ${timeOfDay === 'night' ? 'bg-blue-900/50 border-blue-700 text-blue-300' : 'bg-gray-800/50'}`}
              onClick={toggleTimeOfDay}
            >
              {timeOfDay === 'day' ? <Sun className="h-4 w-4" /> : <SunMoon className="h-4 w-4" />}
              <span className="sr-only">Toggle Day/Night</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`h-9 w-9 p-0 border-gray-700 text-gray-200 ${isRotating ? 'bg-blue-900/50 border-blue-700 text-blue-300' : 'bg-gray-800/50'}`}
              onClick={toggleRotation}
            >
              <RotateCcw className="h-4 w-4" />
              <span className="sr-only">Toggle Rotation</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-9 w-9 p-0 border-gray-700 bg-gray-800/50 hover:bg-gray-700/50 text-gray-200"
              onClick={toggleInfo}
            >
              <Info className="h-4 w-4" />
              <span className="sr-only">Info</span>
            </Button>
          </div>
          
          {/* Zoom Controls */}
          <div className="absolute right-4 top-20 flex flex-col space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="h-9 w-9 p-0 border-gray-700 bg-gray-800/50 hover:bg-gray-700/50 text-gray-200"
              onClick={() => handleZoom(true)}
            >
              <ZoomIn className="h-4 w-4" />
              <span className="sr-only">Zoom In</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-9 w-9 p-0 border-gray-700 bg-gray-800/50 hover:bg-gray-700/50 text-gray-200"
              onClick={() => handleZoom(false)}
            >
              <ZoomOut className="h-4 w-4" />
              <span className="sr-only">Zoom Out</span>
            </Button>
          </div>
          
          {/* Bottom Controls */}
          <div className="absolute bottom-4 left-0 right-0 mx-auto flex flex-col space-y-2 items-center">
            {/* View mode selector */}
            <div className="bg-gray-800/70 backdrop-blur-sm border border-gray-700 rounded-lg overflow-hidden">
              <Tabs value={viewMode} onValueChange={changeView} className="w-60">
                <TabsList className="bg-transparent border-b border-gray-700 grid grid-cols-4">
                  <TabsTrigger 
                    value="3d" 
                    className="data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-300"
                  >
                    3D
                  </TabsTrigger>
                  <TabsTrigger 
                    value="front" 
                    className="data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-300"
                  >
                    Front
                  </TabsTrigger>
                  <TabsTrigger 
                    value="side" 
                    className="data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-300"
                  >
                    Side
                  </TabsTrigger>
                  <TabsTrigger 
                    value="top" 
                    className="data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-300"
                  >
                    Top
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            {/* Quality and Effects Controls */}
            <div className="bg-gray-800/70 backdrop-blur-sm border border-gray-700 rounded-lg p-3 space-y-3 w-72">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-300">Glow Intensity</span>
                <div className="w-40">
                  <Slider
                    defaultValue={[bloomIntensity]}
                    max={1.5}
                    step={0.1}
                    onValueChange={handleBloomIntensityChange}
                    className="[&>span]:bg-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-300">Quality</span>
                <div className="flex space-x-1">
                  {['low', 'medium', 'high'].map((q) => (
                    <Button
                      key={q}
                      variant="outline"
                      size="sm"
                      className={`h-7 px-2 py-0 text-xs ${
                        quality === q 
                          ? 'bg-blue-900/30 text-blue-300 border-blue-700' 
                          : 'bg-gray-800 text-gray-300 border-gray-700'
                      }`}
                      onClick={() => handleQualityChange(q)}
                    >
                      {q.charAt(0).toUpperCase() + q.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Monument Info Panel */}
          <div className="absolute bottom-32 left-0 right-0 mx-auto max-w-lg">
            <div className="bg-gray-800/70 backdrop-blur-sm border border-gray-700 rounded-lg p-3 shadow-xl">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs text-blue-400 font-medium inline-block px-2 py-1 rounded-full bg-blue-900/30 mb-1">
                    {modelDetails?.style}
                  </span>
                  <p className="text-sm text-gray-200 line-clamp-2">{modelDetails?.description}</p>
                </div>
                <Button
                  size="sm"
                  className="text-xs h-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 border-0"
                  onClick={toggleInfo}
                >
                  More Info
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RealisticModelViewer;