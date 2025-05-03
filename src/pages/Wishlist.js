import React, { useEffect, useState } from "react";
import Container from "../components/Container";
import { useDispatch, useSelector } from "react-redux";
import {
  addToWishlist,
  removeToWishlist,
} from "../features/products/productSlilce";
import { getuserProductWishlist } from "../features/user/userSlice";
import { AiFillHeart } from "react-icons/ai";
import "./../Css/CssWishlist.css";
import { useNavigate } from "react-router-dom";

const Wishlist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [hoveredProduct, setHoveredProduct] = useState(null);

  useEffect(() => {
    getWishlistFromDb();
  }, []);

  const getWishlistFromDb = () => {
    dispatch(getuserProductWishlist());
  };

  const wishlistState = useSelector((state) => state?.auth?.wishlist);

  const removeFromWishlist = (id) => {
    dispatch(removeToWishlist(id));
    setTimeout(() => {
      dispatch(getuserProductWishlist());
    }, 300);
  };

  return (
    <Container class1="wishlist-wrapper home-wrapper-2 py-5">
      <div className="row">
        {/* Hiển thị khi không có sản phẩm trong Wishlist */}
        {wishlistState && wishlistState.length === 0 && (
          <div className="text-center fs-3">No Data</div>
        )}

        {/* Danh sách sản phẩm trong Wishlist */}
        {wishlistState &&
          wishlistState.map((item, index) => (
          <div
            className="col-lg-3 col-md-4 col-sm-6 my-3"
            key={index}
            onMouseEnter={() => setHoveredProduct(index)}
            onMouseLeave={() => setHoveredProduct(null)}
          >
            <div className="product-card position-relative" style={{ cursor: "pointer" }}>
              {/* Nút Xóa khỏi Wishlist */}
              <div
                className="wishlist-remove"
                onClick={() => removeFromWishlist(item?._id)}
                style={{ cursor: "pointer", top: "10px", right: "10px", position: "absolute", zIndex: 2 }}
              >
                <AiFillHeart className="text-danger fs-4" />
              </div>

              {/* Hình ảnh sản phẩm */}
                    <div
                      className="product-image"
                      style={{
                        position: "relative",
                        width: "100%",
                        height: "0",
                        paddingBottom: "150%",
                      }}
                    >
                      <img
                        src={
                          hoveredProduct === index && item?.images?.[1]
                            ? item?.images[1]
                            : item?.images?.[0] || "/default-image.png"
                        }
                        alt={item?.name}
                        onClick={() => navigate("/product/" + item?._id)}
                        style={{
                          objectFit: "cover",
                          display: "block",
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          transition: "0.3s ease",
                        }}
                      />
                    </div>

              {/* Thông tin sản phẩm */}
              <div className="product-details" style={{ padding: "15px" }}>
                <h6 className="brand">{item?.brand || "Không rõ thương hiệu"}</h6>
                <h5 className="product-title">
                  {item?.name?.length > 35 ? item.name.substr(0, 35) + "..." : item?.name}
                </h5>

                {/* Chỉ hiển thị khi hover */}
                <div
                  className={`hover-details ${hoveredProduct === index ? "hovered" : ""}`}
                  style={{
                    opacity: hoveredProduct === index ? 1 : 0,
                    visibility: hoveredProduct === index ? "visible" : "hidden",
                    transition: "opacity 0.3s ease, visibility 0.3s ease",
                  }}
                >
                  <div className="d-flex align-items-center">
                    <div className="rating">★★★★★</div>
                    <div className="ms-auto">
                      <span style={{ color: "red" }}>
                        {item?.price?.toLocaleString("vi-VN") || "0"}₫
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          ))}
      </div>
    </Container>
  );
};

export default Wishlist;
