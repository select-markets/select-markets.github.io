import React from "react";

interface Props_Utility_Transformed_Text {
  text: string;
  hovered: boolean;
  invert?: boolean;
  assets: Asset[];
}

export const Utility_Transformed_Text: React.FC<
  Props_Utility_Transformed_Text
> = ({ text, hovered, invert = false, assets }) => {
  const length = text.length;

  return text.split("").map((char, index) => {
    let transform = "";

    if (hovered) {
      const middle = length / 2;
      const a = invert ? -0.05 : 0.05;
      const translateY = a * Math.pow(index - middle, 2) * 10;

      const rotate =
        index < middle
          ? invert
            ? 5 * (middle - index)
            : -5 * (middle - index)
          : invert
          ? -5 * (index - middle)
          : 5 * (index - middle);

      if (translateY !== 0 || rotate !== 0) {
        transform = `translateY(${translateY}vh) rotate(${rotate}deg)`;
      }
    }

    const assetIndex = index % assets.length;
    const backgroundImage = `url(${assets[assetIndex].url}) no-repeat center`;

    return (
      <h1
        key={index}
        style={{
          transform,
          background: backgroundImage,
          backgroundSize: "cover",
          WebkitBackgroundClip: "text",
          color: "transparent",
          transition: "transform 0.3s ease-in-out",
        }}
      >
        {char}
      </h1>
    );
  });
};
