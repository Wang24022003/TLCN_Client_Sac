import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addToWishlist,
  toggleCompare,
} from "../features/products/productSlilce";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlinePlusCircle,
} from "react-icons/ai";
import ReactStars from "react-rating-stars-component";
import { getuserProductWishlist } from "../features/user/userSlice";
import wish from "../images/wish.svg";

const ProductCard = (props) => {
  const navigate = useNavigate();
  const { grid, data } = props;
  const dispatch = useDispatch();
  const location = useLocation();

  const wishlistState = useSelector((state) => state?.auth?.wishlist);
  const compareState = useSelector(
    (state) => state?.product?.compareList || []
  );

  const [wishlist, setWishlist] = useState(wishlistState || []);
  const [compareList, setCompareList] = useState(compareState);

  useEffect(() => {
    setWishlist(wishlistState || []);
  }, [wishlistState]);

  useEffect(() => {
    setCompareList(compareState);
  }, [compareState]);

  const isProductInWishlist = (productId) =>
    wishlist.some((item) => item._id === productId);
  const isProductInCompareList = (productId) =>
    compareList.some((item) => item._id === productId);

  const handleWishlistToggle = (productId) => {
    dispatch(addToWishlist(productId));
    dispatch(getuserProductWishlist());
  };

  const addToCompare = (productId) => {
    dispatch(toggleCompare(productId));
  };

  const [hoveredProduct, setHoveredProduct] = useState(null);

  const addToWish = (id) => {
    dispatch(
      addToWishlist({
        _id: id,
      })
    );
    dispatch(getuserProductWishlist());
  };

  return (
    <>
      {data?.map((item, index) => {
        const isWishlist = isProductInWishlist(item._id);
        const isCompare = isProductInCompareList(item._id);

        return (
          <div
            key={index}
            className={` ${
              location.pathname === "/product" ? `gr-${grid}` : "col-3"
            } `
            }
            onMouseEnter={() => setHoveredProduct(index)} // Khi hover, lưu chỉ số sản phẩm
            onMouseLeave={() => setHoveredProduct(null)}
          >
            <div className="product-card position-relative">
              <div className="wishlist-icon position-absolute">
                {/* <button
                  className="border-0 bg-transparent"
                  onClick={() => handleWishlistToggle(item?._id)}
                >
                  {isWishlist ? (
                    <AiFillHeart className="fs-5 me-1" />
                  ) : (
                    <AiOutlineHeart className="fs-5 me-1" />
                  )}
                </button> */}
              </div>

                      <div className="product-image" style={{ position: 'relative', width: '100%', height: '0', paddingBottom: '150%' }}>
                        <img
                          src={
                            hoveredProduct === index && item?.images?.[1]
                              ? item?.images[1] // Hiển thị ảnh thứ 2 khi hover
                              : item?.images?.[0] || "/default-image.png" // Dùng ảnh mặc định nếu không có ảnh
                          }
                          alt="product image"
                          height={"250px"}
                          width={"260px"}
                          onClick={() => navigate("/product/" + item?._id)}
                          style={{
                            objectFit: "cover",
                            display: "block", // Đảm bảo ảnh hiển thị
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                          }}
                        />
                      </div>

              <div className="product-details" style={{
                          padding:"15px",
                        }}>
                <h6 className="brand">{item?.brand}</h6>
                <h5 className="product-title">
                  {item?.name?.length > 35 ? item.name.substr(0, 35) + "..." : item?.name}
                </h5>

                {/* <h5 className="product-title">
                  {grid === 12 || grid === 6
                    ? item?.name
                    : item?.name?.substr(0, 80) + "..."}
                </h5> */}
                <div className="d-flex align-items-center">
                <ReactStars
                  count={+5}
                  size={24}
                  value={+item?.totalrating}
                  edit={false}
                  activeColor="#ffd700"
                />
                  <div className="wishlist-icon ms-auto">
                    <button
                      className="border-0 bg-transparent"
                      onClick={(e) => {
                        addToWish(item?._id);
                      }}
                    >
                      {isWishlist ? (
                        <AiFillHeart className="text-danger fs-5" />
                      ) : (
                        <AiOutlineHeart className="text-dark fs-5" />
                      )}
                    </button>
                  </div>

                  </div>
                <p className="price">
                  {item?.price && `${item.price.toLocaleString("vi-VN")}đ`}
                </p>
              </div>
              <div className="action-bar position-absolute">
                <div className="d-flex flex-column gap-15">
                  <button
                    className="border-0 bg-transparent"
                    onClick={() => addToCompare(item?._id)}
                  >
                    <AiOutlinePlusCircle
                      className={`fs-5 ${
                        isCompare ? "text-danger" : "text-dark"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default ProductCard;
