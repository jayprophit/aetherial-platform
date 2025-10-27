import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  PerspectiveCamera, 
  Environment, 
  ContactShadows,
  Html,
  useGLTF,
  Sky
} from '@react-three/drei';
import * as THREE from 'three';
import { Settings, Maximize2, Camera, Video } from 'lucide-react';

interface AIAvatar3DProps {
  emotion?: 'neutral' | 'happy' | 'thinking' | 'surprised' | 'sad';
  isSpeaking?: boolean;
  environment?: 'office' | 'space' | 'cyberpunk' | 'nature' | 'minimal';
}

// Simple animated character (placeholder for actual 3D model)
function Character({ emotion, isSpeaking }: { emotion: string; isSpeaking: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hue, setHue] = useState(0);

  useFrame((state) => {
    if (meshRef.current) {
      // Idle animation - gentle bobbing
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
      
      // Rotate slightly
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      
      // Speaking animation - scale pulsing
      if (isSpeaking) {
        const scale = 1 + Math.sin(state.clock.elapsedTime * 10) * 0.05;
        meshRef.current.scale.set(scale, scale, scale);
      } else {
        meshRef.current.scale.set(1, 1, 1);
      }
    }
    
    // Color shift based on emotion
    setHue(state.clock.elapsedTime * 20);
  });

  const getEmotionColor = () => {
    switch (emotion) {
      case 'happy': return '#FFD700';
      case 'thinking': return '#9333EA';
      case 'surprised': return '#3B82F6';
      case 'sad': return '#6B7280';
      default: return '#8B5CF6';
    }
  };

  return (
    <group>
      {/* Head */}
      <mesh ref={meshRef} position={[0, 1, 0]} castShadow>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial 
          color={getEmotionColor()} 
          roughness={0.3}
          metalness={0.8}
          emissive={getEmotionColor()}
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Eyes */}
      <mesh position={[-0.15, 1.1, 0.4]} castShadow>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.15, 1.1, 0.4]} castShadow>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      
      {/* Pupils */}
      <mesh position={[-0.15, 1.1, 0.48]} castShadow>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0.15, 1.1, 0.48]} castShadow>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      
      {/* Body */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.4, 0.8, 32]} />
        <meshStandardMaterial 
          color={getEmotionColor()} 
          roughness={0.4}
          metalness={0.6}
        />
      </mesh>
      
      {/* Glow effect when speaking */}
      {isSpeaking && (
        <pointLight 
          position={[0, 1, 0]} 
          intensity={2} 
          distance={3} 
          color={getEmotionColor()} 
        />
      )}
    </group>
  );
}

// Environment setup
function Scene({ environment, emotion, isSpeaking }: { 
  environment: string; 
  emotion: string; 
  isSpeaking: boolean;
}) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight 
        position={[5, 5, 5]} 
        intensity={1} 
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-5, 5, -5]} intensity={0.5} color="#3B82F6" />
      
      {/* Environment */}
      {environment === 'space' && <Sky sunPosition={[100, 20, 100]} />}
      {environment !== 'minimal' && (
        <Environment preset={environment === 'office' ? 'apartment' : 'sunset'} />
      )}
      
      {/* Character */}
      <Character emotion={emotion} isSpeaking={isSpeaking} />
      
      {/* Ground */}
      <ContactShadows 
        position={[0, -0.5, 0]} 
        opacity={0.5} 
        scale={10} 
        blur={2} 
        far={4} 
      />
      
      {/* Grid floor */}
      <gridHelper args={[10, 10, '#8B5CF6', '#4B5563']} position={[0, -0.5, 0]} />
      
      {/* Camera */}
      <PerspectiveCamera makeDefault position={[0, 1.5, 3]} />
      <OrbitControls 
        enablePan={false} 
        minDistance={2} 
        maxDistance={5}
        maxPolarAngle={Math.PI / 2}
      />
    </>
  );
}

export default function AIAvatar3D({ 
  emotion = 'neutral', 
  isSpeaking = false,
  environment = 'minimal'
}: AIAvatar3DProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [currentEnvironment, setCurrentEnvironment] = useState(environment);
  const [quality, setQuality] = useState<'low' | 'medium' | 'high'>('high');

  const environments = [
    { id: 'minimal', name: 'Minimal', icon: '⚪' },
    { id: 'office', name: 'Office', icon: '🏢' },
    { id: 'space', name: 'Space', icon: '🚀' },
    { id: 'cyberpunk', name: 'Cyberpunk', icon: '🌆' },
    { id: 'nature', name: 'Nature', icon: '🌲' },
  ];

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-gray-900 to-black">
      {/* 3D Canvas */}
      <Canvas
        shadows
        dpr={quality === 'high' ? [1, 2] : quality === 'medium' ? [1, 1.5] : [1, 1]}
        gl={{ 
          antialias: quality !== 'low',
          alpha: true,
          powerPreference: 'high-performance'
        }}
      >
        <Scene 
          environment={currentEnvironment} 
          emotion={emotion} 
          isSpeaking={isSpeaking} 
        />
      </Canvas>

      {/* Controls Overlay */}
      <div className="absolute top-2 right-2 flex gap-2">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-lg transition-colors"
          title="Settings"
        >
          <Settings className="w-4 h-4 text-white" />
        </button>
        <button
          className="p-2 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-lg transition-colors"
          title="Fullscreen"
        >
          <Maximize2 className="w-4 h-4 text-white" />
        </button>
        <button
          className="p-2 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-lg transition-colors"
          title="Screenshot"
        >
          <Camera className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Emotion Indicator */}
      <div className="absolute bottom-2 left-2 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full">
        <span className="text-xs text-white font-medium capitalize">{emotion}</span>
      </div>

      {/* Speaking Indicator */}
      {isSpeaking && (
        <div className="absolute bottom-2 right-2 flex items-center gap-2 px-3 py-1 bg-purple-600/80 backdrop-blur-sm rounded-full">
          <div className="flex gap-1">
            <div className="w-1 h-3 bg-white rounded-full animate-pulse"></div>
            <div className="w-1 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-1 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <span className="text-xs text-white font-medium">Speaking</span>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <div className="absolute top-12 right-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 p-4">
          <h4 className="font-semibold mb-3">3D Settings</h4>
          
          {/* Environment */}
          <div className="mb-4">
            <label className="text-sm font-medium mb-2 block">Environment</label>
            <div className="grid grid-cols-3 gap-2">
              {environments.map(env => (
                <button
                  key={env.id}
                  onClick={() => setCurrentEnvironment(env.id)}
                  className={`p-2 rounded-lg text-center transition-colors ${
                    currentEnvironment === env.id
                      ? 'bg-purple-100 dark:bg-purple-900/30 border-2 border-purple-600'
                      : 'bg-gray-100 dark:bg-gray-700 border-2 border-transparent'
                  }`}
                >
                  <div className="text-2xl mb-1">{env.icon}</div>
                  <div className="text-xs">{env.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Quality */}
          <div>
            <label className="text-sm font-medium mb-2 block">Quality</label>
            <div className="flex gap-2">
              {(['low', 'medium', 'high'] as const).map(q => (
                <button
                  key={q}
                  onClick={() => setQuality(q)}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm capitalize transition-colors ${
                    quality === q
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

