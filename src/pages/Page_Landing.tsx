import { Component_Header } from "../components/Component_Header";
import { Component_Hero } from "../components/Component_Hero";
import { Component_Section_Scroll } from "../components/Component_Section_Scroll";
import "../assets/css/Page.css";

const Page_Landing = () => {
  return (
    <div className="page">
      <Component_Header />
      <Component_Hero />
      <Component_Section_Scroll />
    </div>
  );
};

export default Page_Landing;
