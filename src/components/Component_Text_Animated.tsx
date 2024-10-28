import { useEffect, useState } from "react";
import jsonEqual from "../helper/jsonEqual";
import "../assets/css/Text_Animated.css";

const colors = ["#ff3e9e", "#ff7717eb", "#9c54f5", "#ffaf25", "black"];

export const Component_Text_Animated = ({
  data,
  results,
  onFinishLoad,
}: Props_Component_Rendered) => {
  const [lastResults, setLastResults] = useState<any>();
  const [letterStyles, setLetterStyles] = useState<{
    [key: number]: React.CSSProperties;
  }>({});

  const parseAPIResults = (result_api: Payload_Result) => {
    // Handle the API result logic based on key_api
    switch (result_api.data.key_api) {
      default:
        break;
    }
  };

  const parseResults = () => {
    const result_api: Payload_Result =
      data.handler_function.extractDataFromResult(
        "api_answer",
        results,
        data.key_call
      );

    if (result_api) {
      parseAPIResults(result_api);
    }
    setLastResults(results);
  };

  useEffect(() => {
    if (!jsonEqual(results, lastResults)) {
      parseResults();
    }
  }, [results, lastResults]);

  useEffect(() => {
    const animateLetters = () => {
      const newStyles: { [key: number]: React.CSSProperties } = {};
      (data.json.content.text as string).split("").forEach((_, index) => {
        colors.forEach((color, waveIndex) => {
          setTimeout(() => {
            newStyles[index] = {
              opacity: "1",
              transform: "translateY(0)",
              transition: `transform 0.5s ease ${
                index * 0.1
              }s, color 0.5s ease ${index * 0.1}s`,
              color: color,
            };
            setLetterStyles((prevStyles) => ({
              ...prevStyles,
              ...newStyles,
            }));
          }, waveIndex * 500 + index * 100);
        });
      });
    };
    animateLetters();
    onFinishLoad();
  }, [data.json.content.text]);

  return (
    <div
      data-component="Component_Text_Animated"
      data-css={data.json.content.key_css}
      data-key={data.key_call}
    >
      <h1 className="animated_text">
        {(data.json.content.text as string).split("").map((letter, index) => (
          <span
            key={index}
            className="letter color-wave"
            style={letterStyles[index]}
          >
            {letter}
          </span>
        ))}
      </h1>
    </div>
  );
};
