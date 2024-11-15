import { Component_Header } from "../components/Component_Header";
import "../assets/css/Contact.css";

const Page_Contact = () => {
  return (
    <div className="page">
      <Component_Header />
      <div className="contact-container">
        <h1>Contact Us</h1>
        <p>
          Interested in working with Select Markets? Send us an email at{" "}
          <a href="mailto:selectmarkets.ma@gmail.com">
            selectmarkets.ma@gmail.com
          </a>
        </p>
        <p>
          Interested in vending? Check out the{" "}
          <a href="/vendor" className="vendor-link">
            Vendor Form
          </a>
        </p>
      </div>
    </div>
  );
};

export default Page_Contact;
