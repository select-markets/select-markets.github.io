import { ReactNode, useEffect, useState } from "react";
import jsonEqual from "../helper/jsonEqual";
import "../assets/css/Hero.css";

interface Props_Component_Hover {
  setHovered: (state: boolean) => void;
  children: ReactNode;
}

const Component_Hover = ({ setHovered, children }: Props_Component_Hover) => {
  return (
    <div
      data-component="Component_Hover"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </div>
  );
};

interface Props_Component_Trail {
  mouse_x: number;
  mouse_y: number;
  spawnImage: boolean;
  images: Asset[]; // Array of image URLs
}

const Component_Trail = ({
  mouse_x,
  mouse_y,
  spawnImage,
  images,
}: Props_Component_Trail) => {
  const [trail, setTrail] = useState<
    { x: number; y: number; id: number; imgIndex: number }[]
  >([]);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  useEffect(() => {
    if (spawnImage) {
      const id = Date.now();
      const imgIndex = currentImageIndex;

      // Cycle through the images array
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);

      setTrail((prev) => [...prev, { x: mouse_x, y: mouse_y, id, imgIndex }]);

      // Remove the image after 2 seconds
      const timeout = setTimeout(() => {
        setTrail((prev) => prev.filter((item) => item.id !== id));
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [spawnImage, mouse_x, mouse_y, currentImageIndex, images.length]);

  return (
    <>
      {trail.map(({ x, y, id, imgIndex }) => (
        <img
          key={id}
          src={images[imgIndex].url} // Cycle through the array of images
          alt="trail"
          style={{
            position: "absolute",
            left: x - 25, // Adjust to center the image on the cursor
            top: y - 25, // Adjust to center the image on the cursor
            width: "50px",
            height: "50px",
            pointerEvents: "none", // So the image doesn’t interfere with mouse events
          }}
        />
      ))}
    </>
  );
};

export const Component_Hero = ({
  data,
  results,
  onFinishLoad,
}: Props_Component_Rendered) => {
  const [lastResults, setLastResults] = useState<any>();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [hovered, setHovered] = useState<boolean>(false);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [lastSpawnPos, setLastSpawnPos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [spawnImage, setSpawnImage] = useState<boolean>(false);

  const parseAssetsResults = (result_assets: Payload_Result) =>
    setAssets(result_assets.data);

  const gatherAssets = () => {
    let key_array: string[] = [];

    data.json.content.assets?.forEach((asset: Asset) =>
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

  // Mouse move handler to track mouse position and spawn images every 100px
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;

      console.log(hovered);

      if (hovered) {
        setMousePos({ x: clientX, y: clientY });

        const distance = Math.sqrt(
          Math.pow(clientX - lastSpawnPos.x, 2) +
            Math.pow(clientY - lastSpawnPos.y, 2)
        );

        if (distance >= 100) {
          setSpawnImage(true);
          setLastSpawnPos({ x: clientX, y: clientY });
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [hovered, lastSpawnPos]);

  if (assets.length > 0)
    return (
      <div
        data-component="Component_Hero"
        data-css={data.json.content.key_css}
        data-key={data.key_call}
      >
        <Component_Hover setHovered={setHovered}>
          <div
            style={{ backgroundColor: "pink", width: "200px", height: "200px" }}
          >
            {data.json.content.unique.up}
          </div>
        </Component_Hover>
        <Component_Hover setHovered={setHovered}>
          {data.json.content.unique.down}
        </Component_Hover>
        <Component_Trail
          mouse_x={mousePos.x}
          mouse_y={mousePos.y}
          spawnImage={spawnImage}
          images={assets} // Pass the array of images as a prop
        />
      </div>
    );
  return null;
};
