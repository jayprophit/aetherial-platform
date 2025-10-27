import { useState, useEffect } from 'react';
import { Maximize2, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

interface FloatingEnergyBallProps {
  isSpeaking: boolean;
  isListening: boolean;
  emotion?: 'neutral' | 'happy' | 'thinking' | 'surprised' | 'sad';
  onExpand: () => void;
  onMicToggle: () => void;
  onSpeakerToggle: () => void;
  micEnabled: boolean;
  speakerEnabled: boolean;
}

export default function FloatingEnergyBall({
  isSpeaking,
  isListening,
  emotion = 'neutral',
  onExpand,
  onMicToggle,
  onSpeakerToggle,
  micEnabled,
  speakerEnabled,
}: FloatingEnergyBallProps) {
  const [position, setPosition] = useState({ x: window.innerWidth - 120, y: window.innerHeight - 120 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const getEmotionColor = () => {
    switch (emotion) {
      case 'happy': return { primary: '#FFD700', secondary: '#FFA500' };
      case 'thinking': return { primary: '#9333EA', secondary: '#7C3AED' };
      case 'surprised': return { primary: '#3B82F6', secondary: '#2563EB' };
      case 'sad': return { primary: '#6B7280', secondary: '#4B5563' };
      default: return { primary: '#8B5CF6', secondary: '#7C3AED' };
    }
  };

  const colors = getEmotionColor();

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: Math.max(0, Math.min(window.innerWidth - 100, e.clientX - dragOffset.x)),
        y: Math.max(0, Math.min(window.innerHeight - 100, e.clientY - dragOffset.y)),
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  return (
    <div
      className="fixed z-50 cursor-move"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: '100px',
        height: '100px',
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Energy Ball */}
      <div className="relative w-full h-full">
        {/* Outer glow rings */}
        {isSpeaking && (
          <>
            <div
              className="absolute inset-0 rounded-full animate-ping opacity-75"
              style={{
                background: `radial-gradient(circle, ${colors.primary}40 0%, transparent 70%)`,
                animationDuration: '1s',
              }}
            />
            <div
              className="absolute inset-0 rounded-full animate-pulse"
              style={{
                background: `radial-gradient(circle, ${colors.primary}60 0%, transparent 60%)`,
                animationDuration: '1.5s',
              }}
            />
          </>
        )}

        {/* Main energy ball */}
        <div
          className="absolute inset-0 rounded-full flex items-center justify-center"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${colors.primary}, ${colors.secondary})`,
            boxShadow: `0 0 40px ${colors.primary}80, inset 0 0 20px ${colors.secondary}40`,
            animation: isSpeaking ? 'pulse 0.5s ease-in-out infinite' : 'float 3s ease-in-out infinite',
          }}
        >
          {/* Inner glow */}
          <div
            className="absolute inset-4 rounded-full"
            style={{
              background: `radial-gradient(circle at 40% 40%, ${colors.primary}40, transparent)`,
            }}
          />

          {/* Particles when speaking */}
          {isSpeaking && (
            <>
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full animate-ping"
                  style={{
                    top: `${50 + 30 * Math.sin((i * Math.PI) / 4)}%`,
                    left: `${50 + 30 * Math.cos((i * Math.PI) / 4)}%`,
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: '1s',
                  }}
                />
              ))}
            </>
          )}

          {/* Listening indicator */}
          {isListening && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Mic className="w-8 h-8 text-white animate-pulse" />
            </div>
          )}
        </div>

        {/* Control buttons */}
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 flex gap-2">
          <button
            onClick={onMicToggle}
            className={`p-2 rounded-full shadow-lg transition-all ${
              micEnabled
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-gray-500 hover:bg-gray-600'
            } text-white`}
            title={micEnabled ? 'Mute microphone' : 'Enable microphone'}
          >
            {micEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
          </button>
          
          <button
            onClick={onSpeakerToggle}
            className={`p-2 rounded-full shadow-lg transition-all ${
              speakerEnabled
                ? 'bg-blue-500 hover:bg-blue-600'
                : 'bg-gray-500 hover:bg-gray-600'
            } text-white`}
            title={speakerEnabled ? 'Mute speaker' : 'Enable speaker'}
          >
            {speakerEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          
          <button
            onClick={onExpand}
            className="p-2 rounded-full bg-purple-500 hover:bg-purple-600 shadow-lg transition-all text-white"
            title="Expand to full avatar"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Status text */}
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
          <div className="px-3 py-1 bg-black/70 backdrop-blur-sm rounded-full text-white text-xs font-medium">
            {isListening ? '🎤 Listening...' : isSpeaking ? '🔊 Speaking...' : '💬 AI Assistant'}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}

