import React from "react";

interface Props_Utility_Transformed_Text {
  text: string;
  hovered: boolean;
  invert?: boolean;
}

export const Utility_Transformed_Text: React.FC<
  Props_Utility_Transformed_Text
> = ({ text, hovered, invert = false }) => {
  const length = text.length;

  return text.split("").map((char, index) => {
    let transform = "";

    if (hovered) {
      // Check if the text length is even or odd
      const isEven = length % 2 === 0;
      const middle = isEven ? length / 2 - 0.5 : Math.floor(length / 2);
      const a = invert ? -0.05 : 0.05;

      // Calculate the distance from the middle
      const distanceFromMiddle = Math.abs(index - middle);

      // Scale the multiplier inversely proportional to the distance from the middle
      const scalingFactor = 1 / (distanceFromMiddle + 1); // +1 to avoid division by zero

      // Translation now scales more as it gets closer to the middle
      const translateY = a * Math.pow(index - middle, 2) * 20 * scalingFactor;

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

      // Ensure the two middle characters have the same transform
      if (
        isEven &&
        (index === Math.floor(middle) || index === Math.ceil(middle))
      ) {
        transform = `translateY(${translateY}vh) rotate(${invert ? -5 : 5}deg)`;
      }
    }

    return (
      <h1
        key={index}
        data-component="Utility_Transformed_Text"
        style={{
          transform,
        }}
      >
        {char}
      </h1>
    );
  });
};
