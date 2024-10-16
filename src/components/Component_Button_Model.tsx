import { memo, useEffect, useState } from "react";
import jsonEqual from "../helper/jsonEqual";
import { Utility_Display_HTML } from "../utilities/Utility_Display_HTML";
import { Utility_Model_Float } from "../utilities/Utility_Model_Float";
import "../assets/css/Button_Model.css";

const MemoizedModel = memo(Utility_Model_Float);

export const Component_Button_Model = ({
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
    if (!jsonEqual(results, lastResults)) parseResults();
  }, [results]);

  useEffect(() => {
    gatherAssets();
  }, []);

  useEffect(() => {
    console.log(assets.length);
    if (assets.length > 0) onFinishLoad();
  }, [assets]);

  if (data.json.content.text && assets.length > 0)
    return (
      <button
        data-component="Component_Button_Model"
        data-css={data.json.content.key_css}
        onClick={() => data.handleLifecycle({ input: data.json })}
        data-key={data.key_call}
      >
        <Utility_Display_HTML html={data.json.content.text} />
        <MemoizedModel url={assets[0].url as string} />
      </button>
    );
};
