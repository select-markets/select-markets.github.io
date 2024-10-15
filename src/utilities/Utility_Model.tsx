import { useGLTF } from "@react-three/drei";

interface Props_Utility_Model {
  url: string;
}

export const Utility_Model = ({ url }: Props_Utility_Model) => {
  const { scene } = useGLTF(url); // Load Draco-compressed model
  return <primitive object={scene} />;
};
