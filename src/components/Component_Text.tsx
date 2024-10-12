import { useEffect, useState } from "react";
import { Component_Display_HTML } from "./Component_Display_HTML";
import jsonEqual from "../helper/jsonEqual";
import "../assets/css/Text.css";

export const Component_Text = ({
  data,
  results,
  onFinishLoad,
}: Props_Component_Rendered) => {
  const [lastResults, setLastResults] = useState<any>();

  const parseAPIResults = (result_api: Payload_Result) => {
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

    if (result_api) parseAPIResults(result_api);
    setLastResults(results);
  };
  useEffect(() => {
    if (!jsonEqual(results, lastResults)) parseResults();
  }, [results]);

  useEffect(() => {
    onFinishLoad();
  }, []);

  return (
    <div
      data-component="Component_Text"
      data-css={data.json.content.key_css}
      data-key={data.key_call}
    >
      <Component_Display_HTML html={data.json.content.text} />
    </div>
  );
};
