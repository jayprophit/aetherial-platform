import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const HolographicUI: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null!);

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    varying vec2 vUv;
    uniform float time;

    void main() {
      vec2 uv = vUv;
      float color = 0.0;
      color += sin(uv.x * 10.0 + time) * 0.5 + 0.5;
      color += sin(uv.y * 10.0 + time) * 0.5 + 0.5;
      color *= 0.5;
      gl_FragColor = vec4(0.0, color, color, 1.0);
    }
  `;

  const uniforms = useMemo(
    () => ({
      time: { value: 0.0 },
    }),
    []
  );

  useFrame(({ clock }) => {
    if (meshRef.current) {
      uniforms.time.value = clock.getElapsedTime();
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
      />
    </mesh>
  );
};

export default HolographicUI;

