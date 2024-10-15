import { useEffect, useState } from "react";
import jsonEqual from "../helper/jsonEqual";
import "../assets/css/Hero.css";
import Component_Generic from "./Component_Generic";
import { Utility_Hover } from "../utilities/Utility_Hover";
import { shuffleArray } from "../helper/shuffleArray";
import { Utility_Transformed_Text } from "../utilities/Utility_Transfored_Text";

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

  if (assets.length > 0 && data.json.content.text)
    return (
      <div
        data-component="Component_Hero"
        data-css={data.json.content.key_css}
        data-key={data.key_call}
        className={`${hovered && "hovered"}`}
      >
        <Utility_Hover setHovered={setHovered} className="title_container">
          <div className={`title_up ${hovered && "hovered"}`}>
            <Utility_Transformed_Text
              text={data.json.content.text}
              hovered={hovered}
              assets={assets}
            />
          </div>
          <div className={`title_down ${hovered && "hovered"}`}>
            <Utility_Transformed_Text
              text={data.json.content.text}
              hovered={hovered}
              invert={true}
              assets={assets}
            />
          </div>
        </Utility_Hover>
        <div className="content_container">
          {data.json.content.children &&
            data.json.content.children.map(
              (component_data: Data_Component_Generic, index: number) => (
                <Component_Generic data={component_data} key={index} />
              )
            )}
        </div>
      </div>
    );
  return null;
};
