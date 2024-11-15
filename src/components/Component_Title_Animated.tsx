import { useEffect } from "react";
import "../assets/css/Title_Animated.css";

interface Props_Component_Title_Animated {
  text: string;
}

const colors = ["white", "#3ebeff", "#e61171"];

export const Component_Title_Animated = ({
  text,
}: Props_Component_Title_Animated) => {
  useEffect(() => {
    const letters = text.split("");
    letters.forEach((_, index) => {
      const baseDelay = index * 300; // Base delay for each letter

      // Animate the main letter
      setTimeout(() => {
        const letterElement = document.querySelector(`#letter-${index}`);
        if (letterElement) {
          letterElement.classList.add("appear");
        }
      }, baseDelay);

      // Animate the colored copies
      [1, 2].forEach((colorIndex) => {
        setTimeout(() => {
          const colorCopy = document.querySelector(
            `#letter-${index}-copy-${colorIndex}`
          );
          if (colorCopy) {
            colorCopy.classList.add("appear");
          }
        }, baseDelay + colorIndex * 100); // Offset for each colored copy
      });
    });
  }, [text]);

  return (
    <div data-component="Component_Title_Animated">
      <div className="animated_text">
        {text.split("").map((letter, index) => (
          <span key={index} className="letter-container">
            <span
              id={`letter-${index}`}
              className="letter"
              style={{
                color: colors[0],
              }}
            >
              {letter}
            </span>
            {colors.slice(1).map((color, colorIndex) => (
              <span
                key={`${index}-${colorIndex}`}
                id={`letter-${index}-copy-${colorIndex + 1}`}
                className="colored-copy"
                style={{
                  color: color,
                }}
              >
                {letter}
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
};
