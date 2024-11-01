import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import jsonEqual from "../helper/jsonEqual";
import "../assets/css/Container_Scroll.css";

const blurbText = ["test1", "asdf", "poop"];

export const Component_Container_Scroll = ({
  data,
  results,
  onFinishLoad,
}: Props_Component_Rendered) => {
  const [lastResults, setLastResults] = useState<any>();
  const [assets, setAssets] = useState<Asset[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isAtTop, setIsAtTop] = useState(false);
  const [visibleAssets, setVisibleAssets] = useState<Set<number>>(new Set());

  const parseAssetsResults = useCallback((result_assets: Payload_Result) => {
    setAssets(result_assets.data);
  }, []);

  const gatherAssets = useCallback(() => {
    const keyArray =
      data.json.content.assets?.map((asset: Asset) => asset.key_asset) || [];
    data.handler_event.publish("environment_call", {
      key_call: data.key_call,
      fallback: [],
      path: ["subscriber_content", "assets"],
      key_environment: keyArray,
    });
  }, [data]);

  const parseResults = useCallback(() => {
    const result_assets: Payload_Result =
      data.handler_function.extractDataFromResult(
        "environment_answer",
        results,
        data.key_call
      );
    if (result_assets) parseAssetsResults(result_assets);
    setLastResults(results);
  }, [results, data.key_call, parseAssetsResults]);

  useEffect(() => {
    gatherAssets();
  }, [gatherAssets]);

  useEffect(() => {
    if (!jsonEqual(results, lastResults)) parseResults();
  }, [results, lastResults, parseResults]);

  useEffect(() => {
    if (assets.length > 0) onFinishLoad();
  }, [assets, onFinishLoad]);

  const handleScroll = useCallback(() => {
    if (containerRef.current && isAtTop) {
      const scrollPosition = containerRef.current.scrollTop;
      const newVisibleAssets = new Set<number>();

      // Track which assets should be visible based on scroll position
      assets.forEach((_, index) => {
        if (scrollPosition >= index * 200) {
          newVisibleAssets.add(index);
        }
      });

      // Update visibleAssets only if they have changed
      if (
        newVisibleAssets.size !== visibleAssets.size ||
        [...newVisibleAssets].some((index) => !visibleAssets.has(index))
      ) {
        setVisibleAssets(newVisibleAssets);
      }
    }
  }, [assets, isAtTop, visibleAssets]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsAtTop(
            entry.isIntersecting && entry.boundingClientRect.top === 0
          );
        });
      },
      { threshold: 1.0 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
      containerRef.current.addEventListener("scroll", handleScroll);
    }

    return () => {
      observer.disconnect();
      containerRef.current?.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  // Memoize random rotations for each asset
  const rotations = useMemo(
    () => assets.map(() => (Math.random() - 0.5) * 20), // Random rotation between -10 and 10 degrees
    [assets.length]
  );

  return assets.length > 0 ? (
    <div
      data-component="Component_Container_Scroll"
      data-css={data.json.content.key_css}
      data-key={data.key_call}
    >
      <div className="animation-container">
        {assets.map((asset, index) => {
          const positionClass =
            index % 4 === 0
              ? "bottom-left"
              : index % 4 === 1
              ? "top-left"
              : index % 4 === 2
              ? "bottom-right"
              : "top-right";

          return (
            <div
              key={index}
              className={`image-container ${positionClass} ${
                visibleAssets.has(index) ? "pop-in" : "pop-out"
              }`}
              style={{ transform: `rotate(${rotations[index]}deg)` }}
            >
              <img src={asset.url} alt={`Asset ${index}`} />
            </div>
          );
        })}
        <h1 className="blurb-text">{blurbText[0]}</h1>
      </div>
      <div
        className="container-scroll"
        ref={containerRef}
        style={{
          overflowY: isAtTop ? "auto" : "hidden",
        }}
      >
        <div
          className="scroller"
          style={{ height: `${assets.length * 250}px` }}
        ></div>
      </div>
    </div>
  ) : null;
};
