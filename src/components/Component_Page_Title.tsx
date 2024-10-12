import { useEffect } from "react";
import { Component_Display_HTML } from "./Component_Display_HTML";

export const Component_Page_Title = ({
  data,
  results,
  onFinishLoad,
}: Props_Component_Rendered) => {
  /*   useEffect(() => {
    console.log(results);
  }, [results]); */

  useEffect(() => {
    onFinishLoad();
  }, []);

  return (
    <h1
      data-component="Component_Page_Title"
      data-css={data.json.content.key_css}
      data-key={data.key_call}
    >
      <Component_Display_HTML
        html={JSON.stringify(data.json.content.translations)}
      />
    </h1>
  );
};
