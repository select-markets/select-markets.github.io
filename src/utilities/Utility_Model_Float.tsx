import React, { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { useLoader, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

const Model: React.FC<{ url: string }> = ({ url }) => {
  const modelRef = useRef<THREE.Group>(null!);
  const gltf = useLoader(GLTFLoader, url);
  const { camera } = useThree();
  const [floatAmplitude, setFloatAmplitude] = useState(0.1);

  useEffect(() => {
    if (modelRef.current) {
      // Calculate the bounding box of the model
      const box = new THREE.Box3().setFromObject(modelRef.current);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());

      // Reposition the model to the origin
      modelRef.current.position.set(-center.x, -center.y, -center.z);

      // Calculate the distance needed to fit the entire model in view
      const maxDimension = Math.max(size.x, size.y, size.z);
      const fov = (camera as any).fov * (Math.PI / 180); // Convert vertical FOV to radians
      let distance = maxDimension / (2 * Math.tan(fov / 2));

      // Add some padding to the distance
      distance *= 1.2;

      // Set the camera position
      camera.position.set(0, center.y, distance);
      camera.lookAt(center);
      camera.updateProjectionMatrix();

      // Set the float amplitude relative to the model size
      setFloatAmplitude(size.y * 0.05); // Adjust the scaling factor as needed
    }
  }, [gltf, camera]);

  // Rotate and float the model
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.004; // Continuous rotation
      modelRef.current.position.y = Math.sin(time * 2) * floatAmplitude; // Scaled floating effect
    }
  });

  return <primitive ref={modelRef} object={gltf.scene} />;
};

interface Props_Utility_Model_Float {
  url: string; // URL to the 3D model
}

export const Utility_Model_Float: React.FC<Props_Utility_Model_Float> = ({
  url,
}) => {
  if (!url || url.length === 0) return null;

  return (
    <Canvas style={{ width: "100%", height: "100%" }} camera={{ fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} />
      <Model url={url} />
      <EffectComposer>
        <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />
      </EffectComposer>
    </Canvas>
  );
};
