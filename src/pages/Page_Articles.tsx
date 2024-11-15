import { Component_Header } from "../components/Component_Header";
import "../assets/css/Articles.css";

const articles = [
  {
    id: "test",
    title: "test",
    link: "test",
    image: "test",
    description: "test",
  },
];

const Page_Articles = () => {
  return (
    <div className="page">
      <Component_Header />
      <div className="articles-container">
        <h1>Articles</h1>
        <div className="articles-grid">
          {articles.map((article) => (
            <div
              className="article-card"
              key={article.id}
              onClick={() => window.open(article.link, "_blank")}
            >
              <h1>{article.title}</h1>
              <img src={article.image} />
              <div className="article-hover">
                <p>{article.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page_Articles;
