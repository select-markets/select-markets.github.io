import { useEffect, useState, useRef, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
//@ts-ignore
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";
import jsonEqual from "../helper/jsonEqual";
import "../assets/css/Hero.css";

const Model = ({ url, isHovered }: { url: string; isHovered: boolean }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();
  const [floatAmplitude, setFloatAmplitude] = useState(0.01);

  useEffect(() => {
    const loader = new STLLoader();
    loader.load(
      url,
      (geometry: THREE.BufferGeometry<THREE.NormalBufferAttributes>) => {
        if (meshRef.current) {
          meshRef.current.geometry = geometry;

          const box = new THREE.Box3().setFromObject(meshRef.current);
          const size = box.getSize(new THREE.Vector3());
          const center = box.getCenter(new THREE.Vector3());

          const maxDimension = Math.max(size.x, size.y, size.z);
          const fov = (camera as any).fov * (Math.PI / 180);
          let distance = maxDimension / (2 * Math.tan(fov / 2));
          distance *= 1.2;
          camera.position.set(0, center.y, distance);
          camera.lookAt(center);
          camera.updateProjectionMatrix();

          setFloatAmplitude(size.y * 0.05);
        }
      }
    );
  }, [url, camera]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.004;
      meshRef.current.position.y = Math.sin(time * 2) * floatAmplitude;
    }
  });

  const material = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0xff69b4),
    emissive: new THREE.Color(0xff69b4),
    emissiveIntensity: 0.5,
    metalness: 0.4,
    roughness: 0.05,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    reflectivity: 0.8,
  });

  return <mesh ref={meshRef} material={material} />;
};

export const Component_Hero = ({
  data,
  results,
  onFinishLoad,
}: Props_Component_Rendered) => {
  const [lastResults, setLastResults] = useState<any>();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isHovered, setIsHovered] = useState(false);

  const parseAssetsResults = (result_assets: Payload_Result) =>
    setAssets(result_assets.data);

  const gatherAssets = () => {
    let key_array: string[] = [];

    data.json.content.assets.forEach((asset: Asset) =>
      key_array.push(asset.key_asset)
    );

    data.handler_event.publish("environment_call", {
      key_call: data.key_call,
      fallback: [],
      path: ["subscriber_content", "assets"],
      key_environment: key_array,
    });
  };

  const parseResults = () => {
    const result_assets: Payload_Result =
      data.handler_function.extractDataFromResult(
        "environment_answer",
        results,
        data.key_call
      );

    if (result_assets) parseAssetsResults(result_assets);

    setLastResults(results);
  };

  useEffect(() => {
    if (!jsonEqual(results, lastResults)) parseResults();
  }, [results]);

  useEffect(() => {
    if (assets.length > 0) onFinishLoad();
  }, [assets]);

  useEffect(() => {
    gatherAssets();
  }, []);

  const handleHover = (hovered: boolean) => {
    setIsHovered(hovered);
  };

  if (assets.length > 0)
    return (
      <div
        data-component="Component_Hero"
        data-css={data.json.content.key_css}
        data-key={data.key_call}
      >
        <Canvas
          camera={{
            position: [0, 0, 0.1],
            near: 0.00001,
            far: 1000,
          }}
          onPointerOver={() => handleHover(true)}
          onPointerOut={() => handleHover(false)}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.5} />
            <pointLight position={[-2, 1, -2]} color="orange" intensity={1.5} />

            <OrbitControls makeDefault enableZoom={false} enablePan={false} />

            {assets.map((asset) => (
              <Model
                key={asset.key_asset}
                url={asset.url as string}
                isHovered={isHovered}
              />
            ))}
          </Suspense>
        </Canvas>
        3D renderer here
      </div>
    );
  return null;
};
