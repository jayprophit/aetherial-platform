import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

interface ModelViewerProps {
  fileUrl: string;
  fileType: string;
  width?: string | number;
  height?: string | number;
  backgroundColor?: string;
  controlsEnabled?: boolean;
  autoRotate?: boolean;
  showWireframe?: boolean;
  showGrid?: boolean;
  showAxes?: boolean;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

const ModelViewer: React.FC<ModelViewerProps> = ({
  fileUrl,
  fileType,
  width = '100%',
  height = '400px',
  backgroundColor = '#f5f5f5',
  controlsEnabled = true,
  autoRotate = false,
  showWireframe = false,
  showGrid = true,
  showAxes = true,
  onLoad,
  onError
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Scene objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Initialize scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(backgroundColor);
    sceneRef.current = scene;
    
    // Initialize camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;
    
    // Initialize renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Initialize controls
    if (controlsEnabled) {
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.25;
      controls.enableZoom = true;
      controls.autoRotate = autoRotate;
      controlsRef.current = controls;
    }
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
    directionalLight2.position.set(-1, -1, -1);
    scene.add(directionalLight2);
    
    // Add grid and axes if enabled
    if (showGrid) {
      const gridHelper = new THREE.GridHelper(10, 10);
      scene.add(gridHelper);
    }
    
    if (showAxes) {
      const axesHelper = new THREE.AxesHelper(5);
      scene.add(axesHelper);
    }
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      
      if (rendererRef.current && cameraRef.current && sceneRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    
    animate();
    
    // Load 3D model based on file type
    loadModel();
    
    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      
      cameraRef.current.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      
      if (modelRef.current && sceneRef.current) {
        sceneRef.current.remove(modelRef.current);
      }
      
      if (controlsRef.current) {
        controlsRef.current.dispose();
      }
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, [backgroundColor, controlsEnabled, autoRotate, showGrid, showAxes]);
  
  // Load model when fileUrl or fileType changes
  useEffect(() => {
    loadModel();
  }, [fileUrl, fileType, showWireframe]);
  
  const loadModel = () => {
    if (!sceneRef.current) return;
    
    setIsLoading(true);
    setError(null);
    
    // Remove previous model if exists
    if (modelRef.current && sceneRef.current) {
      sceneRef.current.remove(modelRef.current);
      modelRef.current = null;
    }
    
    // Determine loader based on file type
    let loader;
    const normalizedFileType = fileType.toLowerCase();
    
    if (normalizedFileType.includes('stl') || fileUrl.toLowerCase().endsWith('.stl')) {
      loader = new STLLoader();
    } else if (normalizedFileType.includes('obj') || fileUrl.toLowerCase().endsWith('.obj')) {
      loader = new OBJLoader();
    } else if (
      normalizedFileType.includes('gltf') || 
      fileUrl.toLowerCase().endsWith('.gltf') || 
      fileUrl.toLowerCase().endsWith('.glb')
    ) {
      loader = new GLTFLoader();
    } else {
      setIsLoading(false);
      setError(`Unsupported file type: ${fileType}`);
      if (onError) onError(new Error(`Unsupported file type: ${fileType}`));
      return;
    }
    
    // Load the model
    loader.load(
      fileUrl,
      (object) => {
        let model;
        
        // Handle different loader return types
        if (object.scene) {
          // GLTF returns a scene
          model = object.scene;
        } else if (object.isBufferGeometry) {
          // STL returns a geometry
          const material = new THREE.MeshStandardMaterial({
            color: 0xaaaaaa,
            metalness: 0.25,
            roughness: 0.6,
            wireframe: showWireframe
          });
          model = new THREE.Mesh(object, material);
        } else {
          // OBJ returns an object
          model = object;
        }
        
        // Center the model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        model.position.x -= center.x;
        model.position.y -= center.y;
        model.position.z -= center.z;
        
        // Scale model to fit view
        const maxDim = Math.max(size.x, size.y, size.z);
        if (maxDim > 0) {
          const scale = 3 / maxDim;
          model.scale.set(scale, scale, scale);
        }
        
        // Add model to scene
        if (sceneRef.current) {
          sceneRef.current.add(model);
          modelRef.current = model;
        }
        
        setIsLoading(false);
        if (onLoad) onLoad();
      },
      (xhr) => {
        // Progress callback
        const percentComplete = (xhr.loaded / xhr.total) * 100;
        console.log(`Model ${percentComplete.toFixed(2)}% loaded`);
      },
      (error) => {
        // Error callback
        console.error('Error loading model:', error);
        setIsLoading(false);
        setError('Failed to load 3D model');
        if (onError) onError(error);
      }
    );
  };
  
  return (
    <div 
      ref={containerRef} 
      style={{ 
        width, 
        height, 
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '4px'
      }}
    >
      {isLoading && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(245, 245, 245, 0.7)',
          zIndex: 10
        }}>
          <div>Loading model...</div>
        </div>
      )}
      
      {error && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(245, 245, 245, 0.7)',
          zIndex: 10
        }}>
          <div style={{ color: 'red' }}>{error}</div>
        </div>
      )}
    </div>
  );
};

export default ModelViewer;
