import { useEffect, useState } from "react";
import jsonEqual from "../helper/jsonEqual";
import Component_Generic from "./Component_Generic";
import { Utility_Hover } from "../utilities/Utility_Hover";
import { Utility_Transformed_Text } from "../utilities/Utility_Transfored_Text";
import "../assets/css/Button_Logo.css";

export const Component_Button_Logo = ({
  data,
  results,
  onFinishLoad,
}: Props_Component_Rendered) => {
  const [lastResults, setLastResults] = useState<any>();
  const [hovered, setHovered] = useState<boolean>(false);

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
        data-component="Component_Button_Logo"
        data-css={data.json.content.key_css}
        data-key={data.key_call}
        onClick={() => data.handleLifecycle({ input: data.json })}
        className={`${hovered && "hovered"}`}
      >
        <Utility_Hover
          setHovered={setHovered}
          className={`title_container ${hovered && "hovered"}`}
        >
          <div className={`title_up ${hovered && "hovered"}`}>
            <Utility_Transformed_Text
              text={data.json.content.text[0]}
              hovered={hovered}
            />
          </div>
          <div className={`title_down ${hovered && "hovered"}`}>
            <Utility_Transformed_Text
              text={data.json.content.text[0]}
              hovered={hovered}
              invert={true}
            />
          </div>
        </Utility_Hover>
        <div className="content_container">
          {data.json.content.children &&
            data.json.content.children.map(
              (component_data: Data_Component_Generic, index: number) => (
                <Component_Generic data={component_data} key={index} />
              )
            )}
        </div>
      </div>
    );
  return null;
};
