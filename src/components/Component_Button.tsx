import { useEffect, useState } from "react";
import { Component_Display_HTML } from "./Component_Display_HTML";
import jsonEqual from "../helper/jsonEqual";

export const Component_Button = ({
  data,
  results,
  onFinishLoad,
}: Props_Component_Rendered) => {
  const [translatedText, setTranslatedText] = useState<Map_Translations>();
  const [lastResults, setLastResults] = useState<any>();

  const parseAPIResults = (result_api: Payload_Result) => {
    switch (result_api.data.key_api) {
      case "get_translations":
        if (data.json.content.translations)
          setTranslatedText(result_api.data.data);
        break;
      default:
        break;
    }
  };

  const parseResults = () => {
    const result_api: Payload_Result =
      data.handler_function.extractDataFromResult("api_answer", results);

    if (result_api) parseAPIResults(result_api);
    setLastResults(results);
  };

  useEffect(() => {
    if (!jsonEqual(results, lastResults)) parseResults();
  }, [results]);

  useEffect(() => {
    if (translatedText) onFinishLoad();
  }, [translatedText]);

  return (
    <button
      data-component="Component_Button"
      data-css={data.json.content.key_css}
      onClick={() => data.handleLifecycle({ input: data.json })}
      data-key={data.key_call}
    >
      {translatedText && (
        <Component_Display_HTML html={translatedText.text_button} />
      )}
    </button>
  );
};
