import { useEffect, useState } from "react";
import jsonEqual from "../helper/jsonEqual";
import "../assets/css/Indicator_Scroll.css";

export const Component_Indicator_Scroll = ({
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

  if (data.json.content.text)
    return (
      <div
        data-component="Component_Indicator_Scroll"
        data-css={data.json.content.key_css}
        onClick={() => data.handleLifecycle({ input: data.json })}
        data-key={data.key_call}
      >
        {data.json.content.text[0]}
      </div>
    );
};
