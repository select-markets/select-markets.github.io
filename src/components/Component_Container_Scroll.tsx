import { useEffect, useRef, useState } from "react";
import jsonEqual from "../helper/jsonEqual";
import "../assets/css/Container_Scroll.css";

export const Component_Container_Scroll = ({
  data,
  results,
  onFinishLoad,
}: Props_Component_Rendered) => {
  const [lastResults, setLastResults] = useState<any>();
  const [assets, setAssets] = useState<Asset[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isAtTop, setIsAtTop] = useState(false);

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
    gatherAssets();
  }, []);

  useEffect(() => {
    if (!jsonEqual(results, lastResults)) parseResults();
  }, [results]);

  useEffect(() => {
    if (assets.length > 0) onFinishLoad();
  }, [assets]);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const scrollPosition = containerRef.current.scrollTop;
        console.log("Scroll Position:", scrollPosition);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          console.log(entry.boundingClientRect.top);
          setIsAtTop(
            entry.isIntersecting && entry.boundingClientRect.top === 0
          );
        });
      },
      { threshold: 1.0 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    // Add scroll event listener to track the scroll position
    containerRef.current?.addEventListener("scroll", handleScroll);

    return () => {
      observer.disconnect();
      containerRef.current?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (assets.length > 0)
    return (
      <div
        data-component="Component_Container_Scroll"
        data-css={data.json.content.key_css}
        data-key={data.key_call}
      >
        <div className="animation-container">
          {assets.map((asset) => {
            return <div>{asset.url}</div>;
          })}
        </div>
        <div
          className="container-scroll"
          ref={containerRef}
          style={{
            overflowY: isAtTop ? "auto" : "hidden",
          }}
        >
          <div className="scroller"></div>
        </div>
      </div>
    );
  return null;
};
