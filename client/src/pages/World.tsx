import React from "react";
import { Canvas } from "@react-three/fiber";
import { VRButton, ARButton, XR, createXRStore } from "@react-three/xr";
import { OrbitControls } from "@react-three/drei";
import HolographicUI from "../components/HolographicUI";

// @react-three/xr 6 requires an explicit store. The store renders the
// default controller, hand and gaze implementations inside <XR>.
const xrStore = createXRStore();

const World: React.FC = () => {
  return (
    <>
      <VRButton store={xrStore} />
      <ARButton store={xrStore} />
      <Canvas>
        <XR store={xrStore}>
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <mesh>
            <boxGeometry />
            <meshStandardMaterial color="hotpink" />
          </mesh>
          <OrbitControls />
          <HolographicUI />
        </XR>
      </Canvas>
    </>
  );
};

export default World;

