import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const SimpleGeometryViewer = ({ modelName }) => {
  const mountRef = useRef(null);
  
  useEffect(() => {
    // Basic Three.js setup
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;
    
    // Create scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Create a simple model based on the name
    let geometry;
    let material;
    let mesh;
    
    if (modelName?.toLowerCase().includes('taj')) {
      // Taj Mahal - simplified as a dome
      geometry = new THREE.SphereGeometry(1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
      material = new THREE.MeshPhongMaterial({ color: 0xffffff, shininess: 100 });
      mesh = new THREE.Mesh(geometry, material);
      
      // Base structure
      const baseGeometry = new THREE.BoxGeometry(2, 0.5, 2);
      const baseMaterial = new THREE.MeshPhongMaterial({ color: 0xf0f0f0 });
      const base = new THREE.Mesh(baseGeometry, baseMaterial);
      base.position.y = -0.75;
      scene.add(base);
      
    } else if (modelName?.toLowerCase().includes('qutub')) {
      // Qutub Minar - simplified as a cylinder
      geometry = new THREE.CylinderGeometry(0.5, 0.7, 3, 32);
      material = new THREE.MeshPhongMaterial({ color: 0xd2b48c });
      mesh = new THREE.Mesh(geometry, material);
      
    } else {
      // Generic monument - cube
      geometry = new THREE.BoxGeometry(2, 2, 2);
      material = new THREE.MeshPhongMaterial({ color: 0x6495ed });
      mesh = new THREE.Mesh(geometry, material);
    }
    
    scene.add(mesh);
    
    // Animation loop
    let animationId;
    const animate = () => {
      mesh.rotation.y += 0.01;
      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      if (!mountRef.current) return;
      
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
    };
  }, [modelName]);
  
  return (
    <div 
      ref={mountRef} 
      style={{ 
        width: '100%', 
        height: '100%', 
        minHeight: '300px',
        background: '#f5f5f5',
        borderRadius: '8px',
        overflow: 'hidden'
      }}
    />
  );
};

export default SimpleGeometryViewer;