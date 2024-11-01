import { useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState, memo } from "react";
import { Mesh, Vector3, Color, DirectionalLight } from "three";
import "../assets/css/Model.css";

interface Props_Utility_Model {
  url: string;
  colors: string[];
  model_position?: number[];
  model_rotation?: number[];
  model_scale?: number[] | number;
  model_spin_speed?: number;
  light_intensity?: number;
  light_position?: number[];
}

export const Utility_Model = memo(
  ({
    url,
    model_position = [0, 0, 0],
    model_rotation = [0, 0, 0],
    model_scale = 1,
    model_spin_speed,
    light_intensity = 0.5,
    light_position = [2, 2, 2],
    colors = ["#ff0080", "#ff6a00", "#7300ff", "#ff6a00", "#ff0080"], // Default colors if not provided
  }: Props_Utility_Model) => {
    const lightRef = useRef<DirectionalLight | null>(null); // Ref for the directional light (initialize as null)
    const rotationRef = useRef([0, 0, 0]); // Persist rotation state

    // Model component, memoized to avoid re-rendering
    const Model = () => {
      const { scene } = useGLTF(url); // Load the GLTF model
      const meshRef = useRef<Mesh>(null); // Ref for the model mesh

      const [lightPhase, setLightPhase] = useState<number>(0); // Track the phase of light for color transition

      // Use useFrame to rotate the model around the Y-axis and animate the light
      useFrame((state, delta) => {
        if (meshRef.current && model_spin_speed) {
          // Increment rotation using rotationRef to persist rotation state
          rotationRef.current[1] += model_spin_speed * delta;
          meshRef.current.rotation.y = rotationRef.current[1];
        }

        if (lightRef.current && colors) {
          // Increment light position for the rising sun effect
          lightRef.current.position.y += delta * 0.2; // Adjust to simulate rising

          // Gradually transition light color over time
          setLightPhase((prev) => (prev + delta * 0.1) % colors.length);

          const currentColorIndex = Math.floor(lightPhase) % colors.length;
          const nextColorIndex = (currentColorIndex + 1) % colors.length;

          const currentColor = new Color(colors[currentColorIndex]);
          const nextColor = new Color(colors[nextColorIndex]);

          // Smoothly interpolate between the current color and the next color
          lightRef.current.color.lerpColors(
            currentColor,
            nextColor,
            lightPhase - Math.floor(lightPhase)
          );
        }
      });

      return (
        <primitive
          ref={meshRef}
          object={scene}
          position={model_position}
          rotation={model_rotation}
          scale={model_scale}
        />
      );
    };

    return (
      <div className="model_container">
        <Canvas>
          <ambientLight intensity={light_intensity} />
          <directionalLight
            ref={lightRef}
            intensity={light_intensity}
            position={light_position as unknown as Vector3}
            castShadow
          />
          <Model />
        </Canvas>
      </div>
    );
  }
);
