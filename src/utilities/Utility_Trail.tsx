import { useEffect, useState } from "react";
import generateUniqueHash from "../helper/generateUniqueHash";
import "../assets/css/Trail.css";

interface Props_Utility_Trail_Image {
  x: number;
  y: number;
  url?: string;
  onRemove: () => void;
}

const Utility_Trail_Image = ({
  x,
  y,
  url,
  onRemove,
}: Props_Utility_Trail_Image) => {
  useEffect(() => {
    const timeout = setTimeout(onRemove, 2000);
    return () => clearTimeout(timeout);
  }, [onRemove]);

  return (
    <img
      data-component="Utility_Trail_Image"
      src={url}
      alt="trail"
      style={{
        left: x - 25,
        top: y - 25,
      }}
    />
  );
};

interface Props_Utility_Trail {
  hovered: boolean;
  images: Asset[];
}

export const Utility_Trail = ({ hovered, images }: Props_Utility_Trail) => {
  const [trail, setTrail] = useState<Payload_Trail[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [lastSpawnPos, setLastSpawnPos] = useState<Payload_Coordinate>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const handleMouseMove = ({ clientX, clientY }: MouseEvent) => {
      if (hovered) {
        const distance = Math.hypot(
          clientX - lastSpawnPos.x,
          clientY - lastSpawnPos.y
        );

        if (distance >= 200) {
          setTrail((prev) => [
            ...prev,
            {
              coordinate: {
                x: clientX,
                y: clientY,
              },
              id: generateUniqueHash(),
              index: currentImageIndex,
            },
          ]);
          setCurrentImageIndex((prev) => (prev + 1) % images.length);
          setLastSpawnPos({ x: clientX, y: clientY });
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [hovered, lastSpawnPos, images.length, currentImageIndex]);

  const removeImage = (id: string) => {
    console.log(trail);
    setTrail((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <>
      {trail.map(({ coordinate: { x, y }, id, index }) => (
        <Utility_Trail_Image
          key={id}
          x={x}
          y={y}
          url={images[index].url}
          onRemove={() => removeImage(id)}
        />
      ))}
    </>
  );
};
