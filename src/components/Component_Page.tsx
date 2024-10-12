import { useEffect, useState } from "react";
import { useAppNavigate } from "./Component_App_Router";
import Component_Generic from "./Component_Generic";
import "../assets/css/Page.css";

export const Component_Page = ({
  data,
  results,
  onFinishLoad,
}: Props_Component_Rendered) => {
  const navigate = useAppNavigate();
  const [renderKey, setRenderKey] = useState(0); // State to force re-render

  const navigateToPage = () => {
    const result: Payload_Result = data.handler_function.extractDataFromResult(
      "page_navigation",
      results,
      data.key_call
    );

    if (result === undefined) return;

    if (result.data === data.json.content.key_page)
      setRenderKey((prevKey) => prevKey + 1);
    // Toggle reload state to force re-render
    else navigate(`/${result.data}`);
  };

  useEffect(() => {
    onFinishLoad();
  }, []);

  useEffect(() => {
    navigateToPage();
  }, [results]);

  return (
    <div
      data-component="Component_Page"
      data-css={data.json.content.key_css}
      key={renderKey}
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
