import { useEffect, useState } from "react";
import jsonEqual from "../helper/jsonEqual";
import "../assets/css/Hero.css";
import Component_Generic from "./Component_Generic";
import { Utility_Hover } from "../utilities/Utility_Hover";

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

  const renderTransformedText = (text: string, invert = false) => {
    const length = text.length;

    return text.split("").map((char, index) => {
      let transform = "";

      if (hovered) {
        const middle = length / 2; // Horizontal center of the text
        const a = invert ? -0.05 : 0.05; // Controls steepness, negative when inverted
        const translateY = a * Math.pow(index - middle, 2) * 10; // Parabolic function

        // Determine rotation, making each character point toward the middle
        const rotate =
          index < middle
            ? invert
              ? 5 * (middle - index)
              : -5 * (middle - index) // Left side: rotate towards the center
            : invert
            ? -5 * (index - middle)
            : 5 * (index - middle); // Right side: rotate towards the center

        // Apply transform if translation or rotation is not zero
        if (translateY !== 0 || rotate !== 0) {
          transform = `translateY(${translateY}vh) rotate(${rotate}deg)`;
        }
      }

      // Cycle through assets for background images
      const assetIndex = index % assets.length;
      const backgroundImage = `url(${assets[assetIndex].url}) no-repeat center`;

      return (
        <h1
          key={index}
          style={{
            transform,
            background: backgroundImage,
            backgroundSize: "cover", // Ensure image covers text
            WebkitBackgroundClip: "text",
            color: "transparent", // Make text transparent to show background image
            transition: "transform 0.3s ease-in-out", // Smooth transitions
          }}
        >
          {char}
        </h1>
      );
    });
  };

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
            {renderTransformedText(data.json.content.text)}
          </div>
          <div className={`title_down ${hovered && "hovered"}`}>
            {renderTransformedText(data.json.content.text, true)}
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
