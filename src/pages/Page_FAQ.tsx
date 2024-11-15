import { Component_Header } from "../components/Component_Header";
import "../assets/css/FAQ.css";

const Page_FAQ = () => {
  const faqItems = [
    {
      question: "What is Select Markets?",
      answer:
        "Select Markets is a vibrant pop-up marketplace that brings together local vendors, unique finds, and an amazing community.",
    },
    {
      question: "How can I apply to be a vendor?",
      answer:
        "Simply head over to our Vendor Form and apply! We'll get back to you with all the details.",
    },
    {
      question: "Where are Select Markets events held?",
      answer:
        "We host events in various locations around Boston. Stay tuned to our website and social media for updates!",
    },
  ];

  return (
    <div className="page">
      <Component_Header />
      <div className="faq-container">
        <h1>FAQ</h1>
        {faqItems.map((item, index) => (
          <div className="faq-item" key={index}>
            <div className="faq-question">{item.question}</div>
            <div className="faq-answer">{item.answer}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page_FAQ;
