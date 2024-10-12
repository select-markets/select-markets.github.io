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

export const Component_Hero = ({
  data,
  results,
  onFinishLoad,
}: Props_Component_Rendered) => {
  const [lastResults, setLastResults] = useState<any>();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [hovered, setHovered] = useState<boolean>();

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

  useEffect(() => {
    console.log(hovered ? "hi" : "bye");
  }, [hovered]);

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
      </div>
    );
  return null;
};
