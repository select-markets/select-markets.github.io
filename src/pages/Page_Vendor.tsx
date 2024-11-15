import { Component_Header } from "../components/Component_Header";
import "../assets/css/Vendor.css";

const Page_Vendor = () => {
  return (
    <div className="page">
      <Component_Header />
      <div className="vendor-container">
        <h1>Vendor Form</h1>
        <p>Interested in vending? Apply with the link below:</p>
        <a
          href="https://vendor-form-link.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Vendor Form
        </a>
        <div className="testimonials-container">
          <h2>Vendor Testimonials</h2>
          <div className="testimonial">
            <p>
              "Select Markets gave us an incredible platform to showcase our
              products. It’s such a great community!" - Jane D.
            </p>
          </div>
          <div className="testimonial">
            <p>
              "We had a fantastic experience vending here. Amazing foot traffic
              and wonderful support." - John S.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page_Vendor;
