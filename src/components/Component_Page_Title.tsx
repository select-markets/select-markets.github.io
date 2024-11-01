import { useEffect } from "react";
import { Utility_Display_HTML } from "../utilities/Utility_Display_HTML";

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

  if (data.json.content.text)
    return (
      <h1
        data-component="Component_Page_Title"
        data-css={data.json.content.key_css}
        data-key={data.key_call}
      >
        <Utility_Display_HTML
          html={JSON.stringify(data.json.content.text[0])}
        />
      </h1>
    );
};
