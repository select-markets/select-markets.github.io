import { useEffect, useState } from "react";
import jsonEqual from "../helper/jsonEqual";
import "../assets/css/Text_Animated.css";

export const Component_Text_Animated = ({
  data,
  results,
  onFinishLoad,
}: Props_Component_Rendered) => {
  const [lastResults, setLastResults] = useState<any>();

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
    onFinishLoad();
  }, [data.json.content.text, onFinishLoad]);

  useEffect(() => {
    const letters = document.querySelectorAll(
      '[data-component="Component_Text_Animated"] .letter, [data-component="Component_Text_Animated"] .colored-copy'
    );
    letters.forEach((letter, index) => {
      const delay = (index + 1) * 50;
      setTimeout(() => {
        letter.classList.add("appear");
      }, delay);
    });
  }, [data.json.content.text]);

  const colors = ["white", "#3ebeff", "#e61171"];

  if (data.json.content.text)
    return (
      <div
        data-component="Component_Text_Animated"
        data-css={data.json.content.key_css}
        data-key={data.key_call}
      >
        <div className="animated_text">
          {data.json.content.text[0].split("").map((letter, index) => (
            <span key={index} className="letter-container">
              <span
                className="letter"
                style={{
                  transitionDelay: `${index * 0.1}s`,
                  color: colors[0],
                }}
              >
                {letter}
              </span>
              {colors.slice(1).map((color, colorIndex) => (
                <span
                  key={`${index}-${colorIndex}`}
                  className="colored-copy"
                  style={{
                    transitionDelay: `${index * 0.1 + 0.1 * (colorIndex + 1)}s`,
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
