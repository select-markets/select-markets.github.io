import { useEffect } from "react";

import Generic_Component from "./Component_Generic";

export const Component_Banner = ({
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
    <div
      data-component="Component_Banner"
      data-css={data.json.content.key_css}
      data-key={data.key_call}
    >
      {data.json.content.children &&
        data.json.content.children.map(
          (component_data: Data_Component_Generic, index: number) => (
            <Generic_Component data={component_data} key={index} />
          )
        )}
    </div>
  );
};
