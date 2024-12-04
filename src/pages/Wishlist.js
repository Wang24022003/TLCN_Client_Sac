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
            <div className="col-lg-3 col-md-4 col-sm-6 my-3" key={index}
            onMouseEnter={() => setHoveredProduct(index)} // Khi hover, lưu chỉ số sản phẩm
            onMouseLeave={() => setHoveredProduct(null)} // Khi rời chuột, reset trạng thái
            >
              <div className="wishlist-card position-relative">
                {/* Nút Xóa khỏi Wishlist */}
                <div
                  className="wishlist-remove"
                  onClick={() => removeFromWishlist(item?._id)}
                  style={{ cursor: "pointer", top: "10px", right: "10px" }}
                >
                  <AiFillHeart className="text-danger fs-4" />
                </div>

                {/* Hình ảnh sản phẩm */}
                <div className="wishlist-card-image" style={{ position: "relative" }}>
                  <img
                    src={
                      hoveredProduct === index && item?.images?.[1]
                        ? item?.images[1] // Hiển thị ảnh thứ 2 khi hover
                        : item?.images?.[0] || "/default-image.png" // Dùng ảnh mặc định nếu không có ảnh
                    }
                    alt={item?.name}
                    className="img-fluid"
                    onClick={() => navigate("/product/" + item?._id)}
                    style={{ objectFit: "cover", transition: "0.3s ease" }}
                  />
                </div>

                {/* Thông tin sản phẩm */}
                <div className="wishlist-card-details">
                  <h5 className="title">{item?.name}</h5>
                  <h6 className="price">
                    {item?.price
                      ? item.price.toLocaleString("vi-VN")
                      : "0"}₫
                  </h6>
                </div>
              </div>
            </div>
          ))}
      </div>
    </Container>
  );
};

export default Wishlist;
