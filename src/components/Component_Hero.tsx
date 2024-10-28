import { useEffect, useState } from "react";
import jsonEqual from "../helper/jsonEqual";
import "../assets/css/Hero.css";
import Component_Generic from "./Component_Generic";

export const Component_Hero = ({
  data,
  results,
  onFinishLoad,
}: Props_Component_Rendered) => {
  const [lastResults, setLastResults] = useState<any>();
  const [assets, setAssets] = useState<Asset[]>([]);

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

  useEffect(() => {
    if (assets.length > 0) onFinishLoad();
  }, [assets]);

  if (assets.length > 0)
    return (
      <div
        data-component="Component_Hero"
        data-css={data.json.content.key_css}
        onClick={() => data.handleLifecycle}
        data-key={data.key_call}
      >
        {data.json.content.children &&
          data.json.content.children.map(
            (component_data: Data_Component_Generic, index: number) => (
              <Component_Generic data={component_data} key={index} />
            )
          )}
      </div>
    );
};
