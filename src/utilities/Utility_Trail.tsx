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
  onFinishLoad?: () => void;
}

export const Utility_Trail = ({
  hovered,
  images,
  onFinishLoad,
}: Props_Utility_Trail) => {
  const [trail, setTrail] = useState<Payload_Trail[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [lastSpawnPos, setLastSpawnPos] = useState<Payload_Coordinate>({
    x: 0,
    y: 0,
  });
  const [preloadedImages, setPreloadedImages] = useState<string[]>([]);
  const [loadingComplete, setLoadingComplete] = useState<boolean>(false);

  // Preload images and trigger onFinishLoad after all images are loaded
  useEffect(() => {
    const preloadImages = async () => {
      const loadedImages: string[] = [];
      let loadedCount = 0;

      images.forEach((image, index) => {
        const img = new Image();
        img.src = image.url as string;
        img.onload = () => {
          loadedImages[index] = img.src;
          loadedCount++;

          if (loadedCount === images.length) {
            console.log(onFinishLoad);
            setPreloadedImages(loadedImages);
            setLoadingComplete(true);
            if (onFinishLoad) onFinishLoad();
          }
        };
        img.onerror = () => {
          console.error(`Failed to load image: ${image.url}`);
          loadedCount++;
          if (loadedCount === images.length) {
            setPreloadedImages(loadedImages);
            setLoadingComplete(true);
            if (onFinishLoad) onFinishLoad();
          }
        };
      });
    };

    preloadImages();
  }, [images, onFinishLoad]);

  // Mouse movement and trail spawning logic
  useEffect(() => {
    if (!loadingComplete) return; // Ensure images are preloaded before interacting

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
          setCurrentImageIndex((prev) => (prev + 1) % preloadedImages.length);
          setLastSpawnPos({ x: clientX, y: clientY });
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [
    hovered,
    lastSpawnPos,
    preloadedImages.length,
    currentImageIndex,
    loadingComplete,
  ]);

  const removeImage = (id: string) =>
    setTrail((prev) => prev.filter((item) => item.id !== id));

  return (
    <>
      {trail.map(({ coordinate: { x, y }, id, index }) => (
        <Utility_Trail_Image
          key={id}
          x={x}
          y={y}
          url={preloadedImages[index]} // Use preloaded images
          onRemove={() => removeImage(id)}
        />
      ))}
    </>
  );
};
