import { useEffect, useState } from "react";
import jsonEqual from "../helper/jsonEqual";
import { Utility_Display_HTML } from "../utilities/Utility_Display_HTML";

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

  if (data.json.content.text)
    return (
      <button
        data-component="Component_Button"
        data-css={data.json.content.key_css}
        onClick={() => data.handleLifecycle({ input: data.json })}
        data-key={data.key_call}
      >
        <Utility_Display_HTML html={data.json.content.text[0]} />
      </button>
    );
};
