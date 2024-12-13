import React from "react";
import { useNavigate } from "react-router-dom";

const BlogCard = (props) => {
  const { id, title, description, image, date } = props;
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate("/blog/" + id);
  };

  return (
    <div className="blog-card" onClick={handleCardClick} style={{ cursor: "pointer" }}>
      <div className="card-image">
        <img
          src={image ? image : "images/blog-1.jpg"}
          className="img-fluid w-100"
          alt="blog"
        />
      </div>
      <div className="blog-content">
        <p className="date">{date}</p>
        <h5 className="title">{title}</h5>
        <p
          className="desc"
          dangerouslySetInnerHTML={{
            __html: description?.substr(0, 70) + "...",
          }}
        ></p>
      </div>
    </div>
  );
};

export default BlogCard;
