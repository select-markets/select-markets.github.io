import { memo, useEffect, useState } from "react";
import jsonEqual from "../helper/jsonEqual";
import "../assets/css/Hero.css";
import { Utility_Model } from "../utilities/Utility_Model";
import { Utility_Hover } from "../utilities/Utility_Hover";
import { Utility_Trail } from "../utilities/Utility_Trail";

const MemoizedModel = memo(Utility_Model);

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
        <div className="canvas_container">
          <Utility_Hover setHovered={setHovered} />
          <MemoizedModel
            url={"assets/models/planet_earth.glb"}
            colors={["#ffffff", "#ff6347", "#ff8c00", "#ffd700", "#ff69b4"]}
            model_position={[0, -3, 0]}
            model_rotation={[0, -2, 0]}
            model_scale={1}
            model_spin_speed={0.1}
            light_intensity={1}
            light_position={[0, 0, 0]}
          />
        </div>
        <Utility_Trail
          hovered={hovered}
          images={assets}
          onFinishLoad={onFinishLoad}
        />
      </div>
    );
};
