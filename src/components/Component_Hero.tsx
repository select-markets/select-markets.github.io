import { Component_Title_Animated } from "./Component_Title_Animated";

import "../assets/css/Hero.css";

export const Component_Hero = ({}) => {
  return (
    <div data-component="Component_Hero">
      <Component_Title_Animated text={"SELECT"} />
      <h1 className="blurb">Vintage finds for modern minds.</h1>
    </div>
  );
};
