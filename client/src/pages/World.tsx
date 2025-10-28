import React from "react";
import { Canvas } from "@react-three/fiber";
import { VRButton, ARButton, XR, Controllers } from "@react-three/xr";
import { OrbitControls } from "@react-three/drei";

const World: React.FC = () => {
  return (
    <>
      <VRButton />
      <ARButton />
      <Canvas>
        <XR>
          <Controllers />
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <mesh>
            <boxGeometry />
            <meshStandardMaterial color="hotpink" />
          </mesh>
          <OrbitControls />
        </XR>
      </Canvas>
    </>
  );
};

export default World;

