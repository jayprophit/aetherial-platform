/**
 * AETHERIAL 3D Avatar Interface
 * 
 * Interactive 3D avatar for AI assistant visualization
 * Features:
 * - Real-time facial animations
 * - Voice synchronization
 * - Emotion expressions
 * - Gesture recognition
 * - iframe integration for embedding
 * - WebRTC for real-time communication
 */

import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, useFBX } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Emotion types
 */
export enum EmotionType {
  NEUTRAL = 'neutral',
  HAPPY = 'happy',
  SAD = 'sad',
  ANGRY = 'angry',
  SURPRISED = 'surprised',
  CONFUSED = 'confused',
  THINKING = 'thinking',
  EXCITED = 'excited',
}

/**
 * Avatar configuration
 */
interface AvatarConfig {
  modelUrl?: string;
  scale?: number;
  position?: [number, number, number];
  enableVoiceSync?: boolean;
  enableEmotions?: boolean;
  enableGestures?: boolean;
}

/**
 * Avatar state
 */
interface AvatarState {
  emotion: EmotionType;
  isSpeaking: boolean;
  audioLevel: number;
  gesture: string | null;
}

/**
 * 3D Avatar Model Component
 */
const Avatar3DModel: React.FC<{
  config: AvatarConfig;
  state: AvatarState;
}> = ({ config, state }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [morphTargets, setMorphTargets] = useState<any>(null);
  
  // Load 3D model (using default sphere for now, can be replaced with actual model)
  useEffect(() => {
    // In production, load actual 3D avatar model
    // const model = useGLTF(config.modelUrl || '/models/avatar.glb');
  }, [config.modelUrl]);
  
  // Animate based on state
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    // Idle animation - gentle bobbing
    if (!state.isSpeaking) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
    
    // Speaking animation - mouth movement
    if (state.isSpeaking && morphTargets) {
      const mouthOpen = Math.sin(state.clock.elapsedTime * 20) * 0.5 + 0.5;
      // Apply morph targets for mouth movement
    }
    
    // Emotion-based animations
    switch (state.emotion) {
      case EmotionType.HAPPY:
        // Slight upward tilt, wider eyes
        meshRef.current.rotation.x = -0.1;
        break;
      case EmotionType.SAD:
        // Slight downward tilt
        meshRef.current.rotation.x = 0.1;
        break;
      case EmotionType.THINKING:
        // Slight head tilt
        meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
        break;
    }
  });
  
  return (
    <mesh ref={meshRef} position={config.position || [0, 0, 0]} scale={config.scale || 1}>
      {/* Temporary sphere - replace with actual 3D model */}
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color="#8B7355" />
      
      {/* Eyes */}
      <mesh position={[-0.3, 0.2, 0.8]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0.3, 0.2, 0.8]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      
      {/* Mouth */}
      <mesh position={[0, -0.3, 0.8]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.2, 0.05, 16, 32, Math.PI]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
    </mesh>
  );
};

/**
 * Voice Synchronization Hook
 */
const useVoiceSync = (enabled: boolean) => {
  const [audioLevel, setAudioLevel] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  
  useEffect(() => {
    if (!enabled) return;
    
    // Initialize Web Audio API
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    analyserRef.current = audioContextRef.current.createAnalyser();
    analyserRef.current.fftSize = 256;
    
    // Get microphone access
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        if (!audioContextRef.current || !analyserRef.current) return;
        
        const source = audioContextRef.current.createMediaStreamSource(stream);
        source.connect(analyserRef.current);
        
        // Analyze audio level
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        
        const checkAudioLevel = () => {
          if (!analyserRef.current) return;
          
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          
          setAudioLevel(average / 255);
          setIsSpeaking(average > 20);
          
          requestAnimationFrame(checkAudioLevel);
        };
        
        checkAudioLevel();
      })
      .catch(err => console.error('Microphone access denied:', err));
    
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [enabled]);
  
  return { audioLevel, isSpeaking };
};

/**
 * Emotion Detection Hook
 */
const useEmotionDetection = (enabled: boolean) => {
  const [emotion, setEmotion] = useState<EmotionType>(EmotionType.NEUTRAL);
  
  useEffect(() => {
    if (!enabled) return;
    
    // In production, integrate with emotion detection AI
    // For now, simulate emotion changes
    const interval = setInterval(() => {
      const emotions = Object.values(EmotionType);
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      setEmotion(randomEmotion);
    }, 10000);
    
    return () => clearInterval(interval);
  }, [enabled]);
  
  return emotion;
};

/**
 * Main 3D Avatar Interface Component
 */
export const Avatar3DInterface: React.FC<{
  config?: AvatarConfig;
  onEmotionChange?: (emotion: EmotionType) => void;
  onSpeakingChange?: (isSpeaking: boolean) => void;
}> = ({ config = {}, onEmotionChange, onSpeakingChange }) => {
  const { audioLevel, isSpeaking } = useVoiceSync(config.enableVoiceSync ?? true);
  const emotion = useEmotionDetection(config.enableEmotions ?? true);
  const [gesture, setGesture] = useState<string | null>(null);
  
  const avatarState: AvatarState = {
    emotion,
    isSpeaking,
    audioLevel,
    gesture,
  };
  
  // Notify parent of state changes
  useEffect(() => {
    if (onEmotionChange) onEmotionChange(emotion);
  }, [emotion, onEmotionChange]);
  
  useEffect(() => {
    if (onSpeakingChange) onSpeakingChange(isSpeaking);
  }, [isSpeaking, onSpeakingChange]);
  
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ background: 'linear-gradient(to bottom, #1a1a2e, #16213e)' }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        {/* 3D Avatar */}
        <Avatar3DModel config={config} state={avatarState} />
        
        {/* Camera controls */}
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={3}
          maxDistance={10}
        />
      </Canvas>
      
      {/* Status overlay */}
      <div style={{
        position: 'absolute',
        bottom: 20,
        left: 20,
        background: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        padding: '10px 20px',
        borderRadius: 10,
        fontFamily: 'Arial, sans-serif',
      }}>
        <div>Emotion: {emotion}</div>
        <div>Speaking: {isSpeaking ? 'Yes' : 'No'}</div>
        <div>Audio Level: {Math.round(audioLevel * 100)}%</div>
      </div>
    </div>
  );
};

/**
 * Avatar iframe Component
 * 
 * Embeddable version of the avatar for use in iframes
 */
export const AvatarIframe: React.FC<{
  width?: string | number;
  height?: string | number;
  config?: AvatarConfig;
}> = ({ width = '100%', height = '600px', config }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  return (
    <div style={{ width, height, position: 'relative' }}>
      <Avatar3DInterface config={config} />
    </div>
  );
};

/**
 * Avatar Window Component
 * 
 * Floating window version of the avatar
 */
export const AvatarWindow: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  config?: AvatarConfig;
}> = ({ isOpen, onClose, config }) => {
  if (!isOpen) return null;
  
  return (
    <div style={{
      position: 'fixed',
      bottom: 20,
      right: 20,
      width: 400,
      height: 500,
      background: 'white',
      borderRadius: 20,
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
      overflow: 'hidden',
      zIndex: 9999,
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '15px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <h3 style={{ margin: 0 }}>AI Assistant</h3>
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'white',
            fontSize: 24,
            cursor: 'pointer',
          }}
        >
          ×
        </button>
      </div>
      
      {/* Avatar */}
      <div style={{ height: 'calc(100% - 60px)' }}>
        <Avatar3DInterface config={config} />
      </div>
    </div>
  );
};

export default Avatar3DInterface;

