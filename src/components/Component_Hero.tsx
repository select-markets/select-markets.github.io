import { useEffect, useState } from "react";
import { Component_Title_Animated } from "./Component_Title_Animated";
import "../assets/css/Hero.css";

export const Component_Hero = () => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isFadeComplete, setIsFadeComplete] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = "/assets/images/select-3.jpg";
    img.onload = () => {
      setIsImageLoaded(true);

      // Delay to match the fade-in animation duration
      setTimeout(() => setIsFadeComplete(true), 1200);
    };
  }, []);

  return (
    <div
      data-component="Component_Hero"
      className={isImageLoaded ? "fade-in" : ""}
      style={{
        backgroundImage: isImageLoaded
          ? `url("/assets/images/select-3.jpg")`
          : "none",
      }}
    >
      {isFadeComplete && (
        <>
          <Component_Title_Animated text={"SELECT"} />
          <h1 className="blurb">Vintage finds for modern minds.</h1>
        </>
      )}
    </div>
  );
};
