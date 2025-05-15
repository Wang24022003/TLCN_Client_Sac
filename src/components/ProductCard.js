import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addToWishlist,
  removeToWishlist,
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
    if (isProductInWishlist(productId)) {
      dispatch(removeToWishlist(productId)).then(() => {
        dispatch(getuserProductWishlist());
      });
    } else {
      dispatch(addToWishlist({ _id: productId })).then(() => {
        dispatch(getuserProductWishlist());
      });
    }
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

  const getPriceRangeFromVariants = (product) => {
    const variants = product?.inventory?.productVariants;
  
    if (!variants || !Array.isArray(variants) || variants.length === 0) {
      return "Đang cập nhật giá";
    }
  
    const prices = variants
      .map((v) => v.sellPrice)
      .filter((p) => p !== undefined && p !== null);
  
    if (prices.length === 0) return "Đang cập nhật giá";
  
    const min = Math.min(...prices);
    const max = Math.max(...prices);
  
    return min === max
      ? `${min.toLocaleString("vi-VN")} ₫`
      : `${min.toLocaleString("vi-VN")} ₫ - ${max.toLocaleString("vi-VN")} ₫`;
  };
  

  const getUniqueColors = (product) => {
  if (!product?.variants || product.variants.length === 0) return [];

  const seen = new Set();
  const colors = [];

  product.variants.forEach(variant => {
    const color = variant.attributes?.color;
    if (color?.name && !seen.has(color.name)) {
      seen.add(color.name);
      colors.push(color);
    }
  });

  return colors;
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
                  value={+item?.rating?.toString()}
                  edit={false}
                  activeColor="#ffd700"
                />
                  <div className="wishlist-icon ms-auto">
                    <button
                      className="border-0 bg-transparent"
                      onClick={() => handleWishlistToggle(item?._id)}
                    >
                      {isWishlist ? (
                        <AiFillHeart className="text-danger fs-5" />
                      ) : (
                        <AiOutlineHeart className="text-dark fs-5" />
                      )}
                    </button>
                  </div>

                  </div>
                  <p className="price">{getPriceRangeFromVariants(item)}</p>

                  {/* Hiển thị danh sách màu nếu có */}
                        {getUniqueColors(item).length > 0 && (
                          <div className="d-flex justify-content-start gap-2 ">
                            {getUniqueColors(item).map((color, idx) => (
                              <div
                                key={idx}
                                title={color.name}
                                style={{
                                  width: "18px",
                                  height: "18px",
                                  borderRadius: "50%",
                                  backgroundColor: color.name,
                                  border: "1px solid #ccc",
                                }}
                              />
                            ))}
                          </div>
                        )}

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
