import React, { useEffect, useState } from "react";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import Container from "../components/Container";
import { useDispatch, useSelector } from "react-redux";
import {
  addToWishlist,
  removeToWishlist,
} from "../features/products/productSlilce";
import {
  getProductUserRecentView,
  getuserProductWishlist,
} from "../features/user/userSlice";
import { useNavigate } from "react-router-dom";
const ProductHistory = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    getWishlistFromDb();
  }, []);
  const getWishlistFromDb = () => {
    dispatch(getProductUserRecentView());
  };

  const navigate = useNavigate();

  const wishlistState = useSelector((state) => state?.auth?.recentView);




  const [hoveredProduct, setHoveredProduct] = useState(null);
  return (
    <>
      <Container class1="wishlist-wrapper home-wrapper-2 py-5">
        <div className="row">
          {wishlistState && wishlistState.length === 0 && (
            <div className="text-center fs-3">No Data</div>
          )}
          {wishlistState &&
            wishlistState?.map((item, index) => {
              return (
                <div className="col-lg-3 col-md-4 col-sm-6 my-3" key={index}
                  onMouseEnter={() => setHoveredProduct(index)} // Khi hover, lưu chỉ số sản phẩm
                  onMouseLeave={() => setHoveredProduct(null)} // Khi rời chuột, reset trạng thái
                  >
                  <div className="wishlist-card position-relative">
                    <img
                      src="images/cross.svg"
                      alt="cross"
                      className="position-absolute cross img-fluid"
                    />
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
                    <div className="py-3 px-3">
                      <h5 className="title">{item?.name}</h5>
                      <h6 className="price">
                        {item?.price ? item.price.toLocaleString("vi-VN") : 0}₫
                      </h6>
                      <h5 className="title">{item?.createdAt}</h5>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </Container>
    </>
  );
};

export default ProductHistory;
