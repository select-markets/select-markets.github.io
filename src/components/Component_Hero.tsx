import { ReactNode, useEffect, useState } from "react";
import jsonEqual from "../helper/jsonEqual";
import "../assets/css/Hero.css";
import generateUniqueHash from "../helper/generateUniqueHash";

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

interface Props_Component_Trail_Image {
  x: number;
  y: number;
  url?: string;
  onRemove: () => void;
}

const Component_Trail_Image = ({
  x,
  y,
  url,
  onRemove,
}: Props_Component_Trail_Image) => {
  useEffect(() => {
    const timeout = setTimeout(onRemove, 2000);
    return () => clearTimeout(timeout);
  }, [onRemove]);

  return (
    <img
      data-component="Component_Trail_Image"
      src={url}
      alt="trail"
      style={{
        left: x - 25,
        top: y - 25,
      }}
    />
  );
};

interface Props_Component_Trail {
  hovered: boolean;
  images: Asset[];
}

const Component_Trail = ({ hovered, images }: Props_Component_Trail) => {
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
        <Component_Trail_Image
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

export const Component_Hero = ({
  data,
  results,
  onFinishLoad,
}: Props_Component_Rendered) => {
  const [lastResults, setLastResults] = useState<any>();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [hovered, setHovered] = useState<boolean>(false);

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
        <Component_Trail hovered={hovered} images={assets} />
      </div>
    );
  return null;
};
