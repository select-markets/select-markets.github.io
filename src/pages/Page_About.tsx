import { Component_Header } from "../components/Component_Header";
import "../assets/css/About.css";

const Page_About = () => {
  return (
    <div className="page">
      <Component_Header />
      <div className="about-container">
        <h1>About Us</h1>
        <div className="team-photos">
          <div className="team-member">
            <img src="/assets/images/team-member-1.jpg" alt="Team Member 1" />
            <p>John Doe - Founder</p>
          </div>
          <div className="team-member">
            <img src="/assets/images/team-member-2.jpg" alt="Team Member 2" />
            <p>Jane Smith - Coordinator</p>
          </div>
        </div>
        <p>
          Select Markets brings together local vendors and community members to
          create a vibrant shopping experience. We focus on supporting small
          businesses and unique finds.
        </p>
      </div>
    </div>
  );
};

export default Page_About;
