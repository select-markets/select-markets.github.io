import { memo, useEffect, useState } from "react";
import jsonEqual from "../helper/jsonEqual";
import { Utility_Model_Float } from "../utilities/Utility_Model_Float";
import "../assets/css/Button_Model.css";
import { Component_Button_Logo } from "./Component_Button_Logo";

const MemoizedModel = memo(Utility_Model_Float);

export const Component_Button_Model = ({
  data,
  results,
  onFinishLoad,
  notifyLog,
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
        <Component_Button_Logo
          data={{
            key_call: data.key_call,
            json: data.json,
            handler_event: data.handler_event,
            handler_function: data.handler_function,
            handleLifecycle: data.handleLifecycle,
          }}
          results={results}
          onFinishLoad={onFinishLoad}
          notifyLog={notifyLog}
        />
        <div className="canvas_container">
          <MemoizedModel url={assets[0].url as string} />
        </div>
      </button>
    );
};
