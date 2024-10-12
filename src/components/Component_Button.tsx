import { useEffect, useState } from "react";
import { Component_Display_HTML } from "./Component_Display_HTML";
import jsonEqual from "../helper/jsonEqual";

export const Component_Button = ({
  data,
  results,
  onFinishLoad,
}: Props_Component_Rendered) => {
  const [lastResults, setLastResults] = useState<any>();

  const parseResults = () => {
    setLastResults(results);
  };

  useEffect(() => {
    if (!jsonEqual(results, lastResults)) parseResults();
  }, [results]);

  useEffect(() => {
    onFinishLoad();
  }, []);

  return (
    <button
      data-component="Component_Button"
      data-css={data.json.content.key_css}
      onClick={() => data.handleLifecycle({ input: data.json })}
      data-key={data.key_call}
    >
      {data.json.content.text}
    </button>
  );
};
