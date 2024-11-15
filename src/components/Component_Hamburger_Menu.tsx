import { useState } from "react";
import "../assets/css/Hamburger_Menu.css";
import { Payload_Button } from "./Component_Header";

interface Props_Component_Hamburger_Menu {
  buttons: Payload_Button[];
}

export const Component_Hamburger_Menu = ({
  buttons,
}: Props_Component_Hamburger_Menu) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="hamburger-menu-container">
      <button
        className="hamburger-button"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </button>
      <div className={`hamburger-menu ${menuOpen ? "open" : ""}`}>
        {buttons.map(({ url, text }) => (
          <a key={url} href={url} className="hamburger-menu-link">
            {text}
          </a>
        ))}
      </div>
    </div>
  );
};
