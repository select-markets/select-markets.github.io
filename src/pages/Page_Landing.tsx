import { Component_Header } from "../components/Component_Header";
import { Component_Hero } from "../components/Component_Hero";
import "../assets/css/Page.css";

const Page_Landing = () => {
  return (
    <div className="page">
      <Component_Header />
      <Component_Hero />
    </div>
  );
};

export default Page_Landing;
