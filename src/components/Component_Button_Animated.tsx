import { useState } from "react";
import { Component_Text_Animated } from "./Component_Text_Animated";
import { useAppNavigate } from "./Component_App_Router";
import "../assets/css/Button_Animated.css";

interface Props_Component_Button_Animated {
  url: string;
  text: string;
  subtext: string;
  animated: boolean;
}

export const Component_Button_Animated = ({
  url,
  text,
  subtext,
  animated,
}: Props_Component_Button_Animated) => {
  const navigate = useAppNavigate();
  const [hovered, setHovered] = useState<boolean>(false);

  return (
    <div
      data-component="Component_Button_Animated"
      className={`${hovered && "hovered"}`}
      onClick={() => navigate(url, false)}
    >
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`title_container ${animated && hovered && "hovered"} ${
          animated && "animated"
        }`}
      >
        <div className={`title_up ${animated && hovered && "hovered"}`}>
          <Component_Text_Animated text={text} hovered={animated && hovered} />
        </div>
        <div className={`title_down ${animated && hovered && "hovered"}`}>
          <Component_Text_Animated
            text={text}
            hovered={animated && hovered}
            invert={true}
          />
        </div>
      </div>
      <div className="subtext">
        <p>{subtext}</p>
      </div>
    </div>
  );
  return null;
};
