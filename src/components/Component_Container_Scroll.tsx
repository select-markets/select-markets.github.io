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
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentBlurbIndex, setCurrentBlurbIndex] = useState(0);

  // Preload all asset images
  const preloadImages = useCallback((assets: Asset[]) => {
    assets.forEach((asset) => {
      if (asset.url) {
        const img = new Image();
        img.src = asset.url;
      }
    });
  }, []);

  const parseAssetsResults = useCallback(
    (result_assets: Payload_Result) => {
      setAssets(result_assets.data);
      preloadImages(result_assets.data); // Preload images once assets are parsed
    },
    [preloadImages]
  );

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
      const scrollHeight =
        containerRef.current.scrollHeight - containerRef.current.clientHeight;
      const progress = (scrollPosition / scrollHeight) * 100;
      setScrollProgress(progress);

      const blurbInterval = 100 / blurbText.length;
      const newBlurbIndex = Math.floor(progress / blurbInterval);
      if (
        newBlurbIndex !== currentBlurbIndex &&
        newBlurbIndex < blurbText.length
      ) {
        setCurrentBlurbIndex(newBlurbIndex);
      }

      const newVisibleAssets = new Set<number>();
      assets.forEach((_, index) => {
        if (
          containerRef.current &&
          scrollPosition >= index * 200 - containerRef.current.clientHeight / 2
        ) {
          newVisibleAssets.add(index);
        }
      });

      if (
        newVisibleAssets.size !== visibleAssets.size ||
        [...newVisibleAssets].some((index) => !visibleAssets.has(index))
      ) {
        setVisibleAssets(newVisibleAssets);
      }
    }
  }, [assets, isAtTop, visibleAssets, currentBlurbIndex]);

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

  const rotations = useMemo(
    () => assets.map(() => (Math.random() - 0.5) * 20),
    [assets.length]
  );

  const heights = useMemo(
    () => assets.map(() => Math.random() * 20),
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
              style={{
                height: `calc(27.5vh + ${heights[index]}px)`,
                opacity: visibleAssets.has(index) ? 1 : 0,
              }}
            >
              <img
                src={asset.url}
                style={{
                  transform: `rotate(${rotations[index]}deg) scale(${
                    visibleAssets.has(index) ? 1 : 0.5
                  })`,
                }}
                alt={`Asset ${index}`}
              />
            </div>
          );
        })}
        <h1 className={`blurb-text`}>{blurbText[currentBlurbIndex]}</h1>
      </div>
      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${scrollProgress}%` }} />
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
