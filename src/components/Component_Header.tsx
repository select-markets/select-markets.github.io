import { useEffect, useState } from "react";
import Component_Generic from "./Component_Generic";
import jsonEqual from "../helper/jsonEqual";
import "../assets/css/Header.css";

export const Component_Header = ({
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
    <div
      data-component="Component_Header"
      data-css={data.json.content.key_css}
      onClick={() => data.handleLifecycle}
      data-key={data.key_call}
    >
      {data.json.content.children &&
        data.json.content.children.map(
          (component_data: Data_Component_Generic, index: number) => (
            <Component_Generic data={component_data} key={index} />
          )
        )}
    </div>
  );
};
