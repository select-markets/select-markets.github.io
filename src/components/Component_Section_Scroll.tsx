import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { Component_Indicator_Scroll } from "./Component_Indicator_Scroll";
import "../assets/css/Section_Scroll.css";

const assets = [
  { url: "/assets/images/select-0.jpg" },
  { url: "/assets/images/select-1.jpg" },
  { url: "/assets/images/select-2.jpg" },
  { url: "/assets/images/select-4.jpg" },
  { url: "/assets/images/select-5.jpg" },
  { url: "/assets/images/select-6.jpg" },
  { url: "/assets/images/select-7.jpg" },
  { url: "/assets/images/select-8.jpg" },
  { url: "/assets/images/select-9.jpg" },
  { url: "/assets/images/select-10.jpg" },
  { url: "/assets/images/select-11.jpg" },
  { url: "/assets/images/select-12.jpg" },
  { url: "/assets/images/select-13.jpg" },
  { url: "/assets/images/select-14.jpg" },
  { url: "/assets/images/select-15.jpg" },
  { url: "/assets/images/select-16.jpg" },
  { url: "/assets/images/select-17.jpg" },
  { url: "/assets/images/select-18.jpg" },
  { url: "/assets/images/select-19.jpg" },
  { url: "/assets/images/select-20.jpg" },
  { url: "/assets/images/select-21.jpg" },
  { url: "/assets/images/select-22.jpg" },
  { url: "/assets/images/select-23.jpg" },
  { url: "/assets/images/select-24.jpg" },
  { url: "/assets/images/select-25.jpg" },
  { url: "/assets/images/select-26.jpg" },
  { url: "/assets/images/select-27.jpg" },
  { url: "/assets/images/select-28.jpg" },
  { url: "/assets/images/select-29.jpg" },
  { url: "/assets/images/select-30.jpg" },
];

const text = [
  "Boston's best vintage finds, all at Select Markets. Don’t miss out!",
  "Select Markets: Where unique style and local vibes collide.",
  "Revamp your wardrobe with Select Markets’ one-of-a-kind pop-ups!",
  "Shop Boston’s coolest vintage at Select Markets. Style starts here.",
];

export const Component_Section_Scroll = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isAtTop, setIsAtTop] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false); // New state
  const [visibleAssets, setVisibleAssets] = useState<Set<number>>(new Set());
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentBlurbIndex, setCurrentBlurbIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [textVisible, setTextVisible] = useState(true);

  // Preload all images
  useEffect(() => {
    const preloadImages = () => {
      const promises = assets.map((asset) => {
        return new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.src = asset.url;
          img.onload = () => resolve();
          img.onerror = () =>
            reject(new Error(`Failed to load image: ${asset.url}`));
        });
      });

      Promise.all(promises)
        .then(() => setImagesLoaded(true))
        .catch((error) => console.error("Error preloading images", error));
    };

    preloadImages();
  }, []);

  const debounce = (func: Function, delay: number) => {
    let timer: ReturnType<typeof setTimeout>;
    return (...args: any[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const updateScrollProgress = debounce((progress: number) => {
    setScrollProgress(progress);
  }, 50);

  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      if (!isAtTop) {
        containerRef.current.scrollTop = 0;
        return;
      }

      const scrollPosition = containerRef.current.scrollTop;
      const scrollHeight =
        containerRef.current.scrollHeight - containerRef.current.clientHeight;

      // Update progress
      const progress = (scrollPosition / scrollHeight) * 100;
      updateScrollProgress(progress);

      // Check if at the bottom
      const atBottom = scrollPosition >= scrollHeight - 1;
      setIsAtBottom(atBottom); // Update the state

      // Calculate which blurb to show
      const blurbInterval = 100 / text.length;
      const newBlurbIndex = Math.floor(progress / blurbInterval);

      if (newBlurbIndex !== currentBlurbIndex && newBlurbIndex < text.length) {
        setTextVisible(false);
        setTimeout(() => {
          setCurrentBlurbIndex(newBlurbIndex);
          setTextVisible(true);
        }, 500);
      }

      // Update visible assets
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
  }, [
    isAtTop,
    visibleAssets,
    currentBlurbIndex,
    updateScrollProgress,
    text.length,
  ]);

  useEffect(() => {
    if (!isAtTop) setVisibleAssets(new Set());
  }, [isAtTop]);

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

  if (!imagesLoaded) {
    return <div className="loading-screen">Loading images...</div>;
  }

  return (
    <>
      <div data-component="Component_Section_Scroll">
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
          <h1
            className={`blurb-text ${
              textVisible ? "text-pop-in" : "text-pop-out"
            }`}
          >
            {text[currentBlurbIndex]}
          </h1>
        </div>
        <div className="progress-bar-container">
          <div
            className="progress-bar"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
        <div
          className="section-scroll"
          ref={containerRef}
          style={{ overflowY: isAtTop ? "auto" : "hidden" }}
        >
          <div
            className="scroller"
            style={{ height: `${assets.length * 250}px` }}
          ></div>
        </div>
      </div>
      <Component_Indicator_Scroll visible={!isAtBottom} />
    </>
  );
};
