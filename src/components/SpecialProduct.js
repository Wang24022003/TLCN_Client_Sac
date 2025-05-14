import React from "react";
import ReactStars from "react-rating-stars-component";
import { Link, useNavigate } from "react-router-dom";
const SpecialProduct = (props) => {
  const { title, brand, totalrating, price, sold, quantity, id, img } = props;
  const navigate = useNavigate();

  return (
    <>
      <div className="col-4 mb-3">
        <div className="special-product-card"
         onClick={() => navigate(`/product/${id}`)} 
         style={{ cursor: "pointer" }}
         >
          <div className="d-flex gap-3">
          <div>
            <img
              src={img}
              className="img-fluid"
              alt="watch"
              height={200}
              width={200}
              style={{
                borderTopLeftRadius: "10px", // Bo góc trái trên
                borderBottomLeftRadius: "10px", // Bo góc trái dưới
              }}
            />
          </div>

          <div
              className="special-product-content"
              style={{ padding: "20px 10px 10px 0" }} // Thêm padding 20px
            >
              <h5 className="brand" style={{ fontSize: "13px", color: "red" }}>{brand}</h5>
              <h6 className="title">{title?.substr(0, 20) + "..."}</h6>
              <ReactStars
                count={+5}
                size={24}
                value={+totalrating}
                edit={false}
                isHalf={true}
                activeColor="#ffd700"
              />
              <p className="price">
                <span className="red-p">{price}đ</span> &nbsp;{" "}
              </p>
              <div className="prod-count my-3">
                <p>Số lượng: {quantity}</p>
                <div className="progress">
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{
                      width: (quantity / (quantity + sold)) * 100 + "%",
                    }}
                    aria-valuenow={(quantity / (quantity + sold)) * 100}
                    aria-valuemin={quantity}
                    aria-valuemax={sold + quantity}
                  ></div>
                </div>
              </div>
              
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default SpecialProduct;
