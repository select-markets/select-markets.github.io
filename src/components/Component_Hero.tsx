import { useEffect, useRef, useState } from "react";
import jsonEqual from "../helper/jsonEqual";
import { Canvas } from "@react-three/fiber";
import "../assets/css/Hero.css";
import { Utility_Model } from "../utilities/Utility_Model";

export const Component_Hero = ({
  data,
  results,
  onFinishLoad,
}: Props_Component_Rendered) => {
  const [lastResults, setLastResults] = useState<any>();
  const [assets, setAssets] = useState<Asset[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

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
        onClick={() => data.handleLifecycle}
        data-key={data.key_call}
      >
        <div className="canvas_container" ref={containerRef}>
          <Canvas>
            <ambientLight intensity={0.5} />
            <directionalLight position={[2, 2, 2]} />
            <Utility_Model url={assets[0].url as string} />
          </Canvas>
        </div>
      </div>
    );
};
