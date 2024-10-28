import { useEffect } from "react";
import Component_Generic from "./Component_Generic";
import "../assets/css/Container.css";

export const Component_Container = ({
  data,
  onFinishLoad,
}: Props_Component_Rendered) => {
  useEffect(() => {
    onFinishLoad();
  }, []);

  return (
    <div
      data-component="Component_Container"
      data-css={data.json.content.key_css}
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
