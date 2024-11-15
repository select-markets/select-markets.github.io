import { useState, useEffect } from "react";
import { Component_Button_Animated } from "./Component_Button_Animated";
import { Component_Hamburger_Menu } from "./Component_Hamburger_Menu";
import "../assets/css/Header.css";

export type Payload_Button = {
  url: string;
  text: string;
  subtext: string;
  animated: boolean;
};

const buttons: Payload_Button[] = [
  {
    url: "/vendor",
    text: "Vendor",
    subtext: "Explore vendor options",
    animated: true,
  },

  { url: "/about", text: "About", subtext: "Learn more", animated: true },

  { url: "/", text: "Select", subtext: "", animated: false },
  {
    url: "/faq",
    text: "FAQ",
    subtext: "Frequently asked questions",
    animated: true,
  },
  {
    url: "/articles",
    text: "Articles",
    subtext: "Read our articles",
    animated: true,
  },
];

export const Component_Header = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 800);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 800);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div data-component="Component_Header">
      {isMobile ? (
        <Component_Hamburger_Menu buttons={buttons} />
      ) : (
        buttons.map(({ url, text, subtext, animated }) => (
          <Component_Button_Animated
            key={url}
            url={url}
            text={text}
            subtext={subtext}
            animated={animated}
          />
        ))
      )}
    </div>
  );
};
