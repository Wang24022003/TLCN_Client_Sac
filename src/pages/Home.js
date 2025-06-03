import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BlogCard from "../components/BlogCard";
import SpecialProduct from "../components/SpecialProduct";
import Container from "../components/Container";
import { services } from "../utils/Data";
import wish from "../images/wish.svg";
import { useDispatch, useSelector } from "react-redux";
import { getAllBlogs } from "../features/blogs/blogSlice";
import moment from "moment";
import { getAllProducts, removeToWishlist } from "../features/products/productSlilce";
import ReactStars from "react-rating-stars-component";
import { addToWishlist } from "../features/products/productSlilce";
import { getProductUserRecentView, getuserProductHistory, getuserProductWishlist } from "../features/user/userSlice";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlinePlusCircle,
} from "react-icons/ai";
import "./../Css/CssHome.css";
import AOS from "aos";
import "aos/dist/aos.css";

const Home = () => {
  const blogState = useSelector((state) => state?.blog?.blog);
  const productState = useSelector((state) => state?.product?.product);
  const authState = useSelector((state) => state?.auth);
  const historyState = useSelector((state) => state?.auth?.recentView);

  const navigate = useNavigate();
  const dispatch = useDispatch();

useEffect(() => {
  getblogs();
  getProducts();
  dispatch(getuserProductWishlist());
  dispatch(getProductUserRecentView());

  AOS.init({
    duration: 800,
    once: true,
  });

  let playerReady = false;

  // Hàm chờ API sẵn sàng
  window.onYouTubeIframeAPIReady = () => {
    playerReady = true;
  };

  // Inject script YouTube API nếu chưa có
  if (!window.YT) {
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);
  }

  const iframe = document.getElementById("featured-video");

  if (iframe) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const isVisible = entry.isIntersecting;

          // Chỉ gửi play/pause nếu player sẵn sàng
          if (playerReady) {
            iframe.contentWindow.postMessage(
              JSON.stringify({
                event: "command",
                func: isVisible ? "playVideo" : "pauseVideo",
                args: [],
              }),
              "*"
            );
          }
        });
      },
      {
        threshold: 0.5, // Chỉ phát khi ít nhất 50% iframe trong vùng nhìn
      }
    );

    observer.observe(iframe);

    return () => {
      observer.disconnect();
    };
  }
}, []);


  const getblogs = () => {
    dispatch(getAllBlogs());
  };

  const getProducts = () => {
    dispatch(getAllProducts());
  };

  const addToWish = (id) => {
    dispatch(
      addToWishlist({
        _id: id,
      })
    );
    dispatch(getuserProductWishlist());
  };

  const wishlistState = useSelector((state) => state?.auth?.wishlist);
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
  

  const isProductInWishlist = (productId) =>
  wishlistState?.some((item) => item._id === productId);

  const [hoveredProduct, setHoveredProduct] = useState(null);


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
  
    const [showMore, setShowMore] = useState(false);
  
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

const getUniqueColorsWishlist = (product) => {
  if (!product?.inventory?.productVariants || product.inventory.productVariants.length === 0) {
    return [];
  }

  const seenColors = new Set();
  const colors = [];

  product.inventory.productVariants.forEach(variant => {
    const color = variant.attributes?.color;
    if (color && !seenColors.has(color)) {
      seenColors.add(color);
      colors.push(color);
    }
  });

  return colors; // mảng các màu dưới dạng chuỗi CSS (#hex hoặc tên màu)
};


  
  return (
    <>
      <Container className="home-wrapper-1 py-5" style={{ position: "relative",  overflow: "hidden"  }}>
       
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: "20px",
            flexWrap: "wrap",
            marginBottom: "26px",
          }}
        >
          {/* Ảnh 1 */}
          <div
            style={{
              width: "220px",
              height: "400px",
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "20px",
              animation: "moveUpDown1 2s ease-in-out infinite",
            }}
          >
            <img
              src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748924176/Home1_gqwmnb.jpg"
              alt="Outfit 1"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform 0.3s ease",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
          </div>

          {/* Ảnh 2 */}
          <div
            style={{
              width: "220px",
              height: "400px",
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "60px",
              animation: "moveUpDown2 2s ease-in-out infinite",
            }}
          >
            <img
              src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748924247/Home2_fwsjlf.jpg"
              alt="Outfit 2"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform 0.3s ease",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
          </div>

          {/* Ảnh 3 */}
          <div
            style={{
              width: "220px",
              height: "400px",
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "20px",
              animation: "moveUpDown1 2s ease-in-out infinite",
            }}
          >
            <img
              src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748924325/Home3_x2suga.jpg"
              alt="Outfit 3"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform 0.3s ease",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
          </div>

          {/* Ảnh 4 */}
          <div
            style={{
              width: "220px",
              height: "400px",
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "60px",
              animation: "moveUpDown2 2s ease-in-out infinite",
            }}
          >
            <img
              src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748924369/Home4_gnlwg8.jpg"
              alt="Outfit 4"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform 0.3s ease",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
          </div>

          {/* Ảnh 5 */}
          <div
            style={{
              width: "220px",
              height: "400px",
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "20px",
              animation: "moveUpDown1 2s ease-in-out infinite",
            }}
          >
            <img
              src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748924384/Home5_ey0qyl.jpg"
              alt="Outfit 1"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform 0.3s ease",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
          </div>
        </div>

        <style>
          {`
            @keyframes moveUpDown1 {
              0% { transform: translateY(0); }
              50% { transform: translateY(-20px); }
              100% { transform: translateY(0); }
            }

            @keyframes moveUpDown2 {
              0% { transform: translateY(0); }
              50% { transform: translateY(20px); }
              100% { transform: translateY(0); }
            }
          `}
        </style>
      </Container>

      <Container class1="home-wrapper-2 py-1">
        <div className="row">
          <div className="col-12">
            <div className="servies d-flex align-items-center justify-content-between">
              {services?.map((i, j) => {
                return (
                  <div className="d-flex align-items-center gap-15" key={j}>
                    <img src={i.image} alt="services" />
                    <div>
                      <h6>{i.title}</h6>
                      <p className="mb-0">{i.tagline}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
{/* nổi bật */}
      <Container class1="featured-wrapper py-4 home-wrapper-x1">
        <div style={{ position: "relative",  zIndex: 0 }}>
          {/* Ảnh góc trên bên trái */}
          <img
            src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748924457/corner-top-left_md0qbu.png"
            alt="top left decoration"
            style={{
              position: "absolute",
              top: "-12px",
              left: "-51px",
              width: "290px",
              height: "auto",
              zIndex: -1,
            }}
          />

          {/* Ảnh góc trên bên phải */}
          <img
            src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748924566/corner-top-rightt_p9uj4x.png"
            alt="top right decoration"
            style={{
              position: "absolute",
              top: "-12px",
              right: "-51px",
              width: "290px",
              height: "auto",
              zIndex: -1,
            }}
          />
          {/* Ảnh góc dưới bên trái */}
            <img
              src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748924711/bottom-left_zliugn.png"
              alt="bottom left decoration"
              style={{
                position: "absolute",
                bottom: "-25px",
                left: "-54px",
                width: "540px",
                height: "auto",
                zIndex: -1,
                opacity: 0.3,
              }}
            />

            {/* Ảnh góc dưới bên phải */}
            <img
              src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748924773/bottom-right_d4mbqd.png"
              alt="bottom right decoration"
              style={{
                position: "absolute",
                bottom: "-16px",
                right: "-50px",
                width: "400px",
                height: "auto",
                zIndex: -1,
                opacity: 0.3,
              }}
          />

          {/* Nội dung chính */}
          <div className="row">
          <div className="col-12 mb-3">
            <div className="d-flex justify-content-center align-items-center">
              {/* Ảnh bên trái */}
              <img
                src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748924911/Right_hes5y0.png"
                alt="left decoration"
                style={{ width: "130px", height: "60px", objectFit: "contain" }}
              />

              {/* Tiêu đề ở giữa */}
              <h3 className="section-heading text-center mb-0" style={{ color: "#fff" }}>
                Bộ sưu tập nổi bật
              </h3>

              {/* Ảnh bên phải */}
              <img
                src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748925086/Left_niuqcd.png"
                alt="right decoration"
                style={{ width: "130px", height: "60px", objectFit: "contain" }}
              />
            </div>

            {/* Xem tất cả: để dưới nếu vẫn muốn dùng */}
            <div className="text-center mt-2">
              <span
                onClick={() => navigate("/product")}
                style={{
                  cursor: "pointer",
                  color: "#d1d1d1",
                  fontSize: "14px",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#28a745")}
                onMouseLeave={(e) => (e.target.style.color = "#d1d1d1")}
              >
                Xem tất cả
              </span>
            </div>
          </div>

          {productState &&
            [...productState] // Tạo bản sao của mảng để không thay đổi trạng thái ban đầu
              .reverse() // Đảo ngược thứ tự mảng
              .filter((item) => item.tags === "featured") // Lọc chỉ những sản phẩm có tag "featured"
              .slice(0, showMore ? productState.length : 8) // Hiển thị tất cả khi showMore = true, hoặc 8 sản phẩm đầu tiên
              .map((item, index) => (
                <div
                  key={index}
                  className="col-3 my-2"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                  onMouseEnter={() => setHoveredProduct(index)} // Khi hover, lưu chỉ số sản phẩm
                  onMouseLeave={() => setHoveredProduct(null)} // Khi rời chuột, reset trạng thái
                >
                  <div className="product-card position-relative" style={{ cursor: "pointer" }}>
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
                            ? item?.images[1] // Hiển thị ảnh thứ 2 khi hover
                            : item?.images?.[0] || "/default-image.png" // Dùng ảnh mặc định nếu không có ảnh
                        }
                        alt="product image"
                        height={"250px"}
                        width={"260px"}
                        onClick={() => navigate("/product/" + item?._id)}
                        style={{
                          objectFit: "cover",
                          display: "block",
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                        }}
                      />
                    </div>
                    <div className="product-details" style={{ padding: "15px", color: "#fff", textShadow: "0 1px 2px rgba(0, 0, 0, 0.6)", }}>
                      {/* Name và Brand luôn hiển thị */}
                      <div className="d-flex justify-content-between align-items-center">
                        <h8 className="brand">{item?.brand}</h8>
                        <p style={{ fontSize: "13px", marginBottom: "0", color: "#fff" }}>
                          Đã bán: {item?.inventory?.totalQuantitySell ?? 0}
                        </p>
                      </div>
                      <h5 className="product-title" style={{ color: "#fff", textShadow: "0 1px 2px rgba(0, 0, 0, 0.6)", }}>
                        {item?.name?.length > 35 ? item.name.substr(0, 35) + "..." : item?.name}
                      </h5>
                      {/* 3 phần còn lại chỉ hiển thị khi hover */}
                      <div
                        className={`hover-details ${hoveredProduct === index ? "hovered" : ""}`}
                        style={{
                          opacity: hoveredProduct === index ? 1 : 0,
                          visibility: hoveredProduct === index ? "visible" : "hidden",
                          transition: "opacity 0.3s ease, visibility 0.3s ease",
                        }}
                      >
                        <div className="d-flex align-items-center">
                          <ReactStars
                            count={+5}
                            size={24}
                            value={+item?.rating?.toString()}
                            isHalf={true}
                            edit={false}
                            color="#ccc"
                            activeColor="#ffd700"
                          />
                          
                          <div className="wishlist-icon ms-auto">
                            <button
                              className="border-0 bg-transparent"
                              onClick={() => handleWishlistToggle(item?._id)}
                            >
                              {isProductInWishlist(item?._id) ? (
                                <AiFillHeart className="fs-5 text-danger" />
                              ) : (
                                <AiOutlineHeart className="fs-5" />
                              )}
                            </button>
                          </div>
                        </div>
                        <p
                          className="price"
                          style={{
                            color: "#F90004FF",            // Màu đỏ tươi hơn
                            fontWeight: "bold",          // Chữ đậm
                            fontSize: "18px",            // Lớn hơn mặc định
                            display: "inline-block",     // Giữ khối gọn
                          }}
                        >
                          {getPriceRangeFromVariants(item)}
                        </p>
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
                    </div>
                  </div>
                </div>
              ))}
          {/* Dòng "Xem thêm" */}
          
        {productState && productState.filter((item) => item.tags === "featured").length > 8 && (
        <div className="col-12 text-center mt-3">
          <div
            onClick={() => setShowMore(!showMore)}
            className="fancy-toggle-btn"
          >
            <div className="col-12 text-center mt-3">
              <button onClick={() => setShowMore(!showMore)} className="gold-toggle-btn">
                <div className="btn-inner d-flex align-items-center justify-content-center position-relative">
                  <img src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748925264/icon-left_zd68q2.png" alt="left" className="btn-icon icon-left" />
                  <span className="btn-text">{showMore ? "Thu gọn" : "Xem thêm"}</span>
                  <img src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748925445/icon-right_s7mrvo.png" alt="right" className="btn-icon icon-right" />
                </div>
              </button>
            </div>
          </div>
        </div>
      )}


        </div>
        </div>
     
      </Container>
{/* áo dài */}
      <Container class1="featured-wrapper py-4 home-wrapper-y ">
        <div style={{ position: "relative",  zIndex: 0 }}>
          {/* Ảnh góc trên bên trái */}
          <img
            src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748924457/corner-top-left_md0qbu.png"
            alt="top left decoration"
            style={{
              position: "absolute",
              top: "-12px",
              left: "-51px",
              width: "290px",
              height: "auto",
              zIndex: -1,
            }}
          />

          {/* Ảnh góc trên bên phải */}
          <img
            src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748924566/corner-top-rightt_p9uj4x.png"
            alt="top right decoration"
            style={{
              position: "absolute",
              top: "-12px",
              right: "-51px",
              width: "290px",
              height: "auto",
              zIndex: -1,
            }}
          />
          {/* Ảnh góc dưới bên trái */}
            <img
              src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748924711/bottom-left_zliugn.png"
              alt="bottom left decoration"
              style={{
                position: "absolute",
                bottom: "0px",
                left: "-54px",
                width: "540px",
                height: "auto",
                zIndex: -1,
                opacity: 0.3,
              }}
            />

            {/* Ảnh góc dưới bên phải */}
            <img
              src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748924773/bottom-right_d4mbqd.png"
              alt="bottom right decoration"
              style={{
                position: "absolute",
                bottom: "-16px",
                right: "-50px",
                width: "400px",
                height: "auto",
                zIndex: -1,
                opacity: 0.3,
              }}
          />

          {/* Nội dung chính */}
          <div className="row align-items-start">
          <div className="col-12 mb-3">
            <div className="d-flex justify-content-center align-items-center">
              {/* Ảnh bên trái */}
              <img
                src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748924911/Right_hes5y0.png"
                alt="left decoration"
                style={{ width: "130px", height: "60px", objectFit: "contain" }}
              />

              {/* Tiêu đề ở giữa */}
              <h3 className="section-heading text-center mb-0" style={{ color: "#FFFFFFFF" }}>
                Bộ sưu tập áo dài 
              </h3>

              {/* Ảnh bên phải */}
              <img
                src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748925086/Left_niuqcd.png"
                alt="right decoration"
                style={{ width: "130px", height: "60px", objectFit: "contain" }}
              />
            </div>

            {/* Xem tất cả: để dưới nếu vẫn muốn dùng */}
            <div className="text-center mt-2">
              <span
                onClick={() => navigate("/product")}
                style={{
                  cursor: "pointer",
                  color: "#d1d1d1",
                  fontSize: "14px",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#28a745")}
                onMouseLeave={(e) => (e.target.style.color = "#d1d1d1")}
              >
                Xem tất cả
              </span>
            </div>
          </div>
          <div className="col-md-6 mb-4" data-aos="fade-right">

            <div style={{ position: "relative", overflow: "visible" }}>
              <div
                style={{
                  position: "relative",
                  paddingBottom: "56.25%",
                  height: 0,
                  overflow: "hidden",
                  borderRadius: "10px",
                }}
              >
                <iframe
                  id="featured-video"
                  src="https://www.youtube.com/embed/0GGvA32Kzhw?enablejsapi=1"
                  title="YouTube video"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    border: "none",
                    borderRadius: "10px",
                  }}
                ></iframe>
              </div>

              {/* Ảnh đè lên video và tràn ra ngoài một phần */}
              <img
                src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748923819/aodai1_yoctdl.png"
                alt="Decor Overlay"
                style={{
                  position: "absolute",
                  bottom: "-157px", 
                  left: "-106px",   
                  width: "250px",
                  height: "auto",
                  zIndex: 3,
                }}
              />
              <img
                src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748923923/aodai2_xddoqy.png" 
                alt="Decor Bottom Right"
                style={{
                  position: "absolute",
                  bottom: "-150px", 
                  right: "-10px",  
                  width: "450px",
                  height: "auto",
                  zIndex: 3,
                }}
              />
            </div>

          </div>


          <div className="col-md-6">
          <div className="row">
            {productState &&
            [...productState] // Tạo bản sao của mảng để không thay đổi trạng thái ban đầu
              .reverse() // Đảo ngược thứ tự mảng
              .filter((item) =>  item.category?._id === "681f0085fd79f6db173a2173") // Lọc chỉ những sản phẩm có tag "featured"
              .slice(0, showMore ? productState.length : 2) // Hiển thị tất cả khi showMore = true, hoặc 8 sản phẩm đầu tiên
              .map((item, index) => (
                <div
                  key={index}
                  className="col-6 my-2"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                  onMouseEnter={() => setHoveredProduct(index)} // Khi hover, lưu chỉ số sản phẩm
                  onMouseLeave={() => setHoveredProduct(null)} // Khi rời chuột, reset trạng thái
                >
                  <div className="product-card position-relative" style={{ cursor: "pointer" }}>
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
                            ? item?.images[1] // Hiển thị ảnh thứ 2 khi hover
                            : item?.images?.[0] || "/default-image.png" // Dùng ảnh mặc định nếu không có ảnh
                        }
                        alt="product image"
                        height={"250px"}
                        width={"260px"}
                        onClick={() => navigate("/product/" + item?._id)}
                        style={{
                          objectFit: "cover",
                          display: "block",
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                        }}
                      />
                    </div>
                    <div className="product-details" style={{ padding: "15px", }}>
                      {/* Name và Brand luôn hiển thị */}
                      <div className="d-flex justify-content-between align-items-center">
                        <h8 className="brand">{item?.brand}</h8>
                        <p style={{ fontSize: "13px", marginBottom: "0"}}>
                          Đã bán: {item?.inventory?.totalQuantitySell ?? 0}
                        </p>
                      </div>
                      <h5 className="product-title" style={{ color: "#020202",}}>
                        {item?.name?.length > 35 ? item.name.substr(0, 35) + "..." : item?.name}
                      </h5>
                      {/* 3 phần còn lại chỉ hiển thị khi hover */}
                      <div
                        className={`hover-details ${hoveredProduct === index ? "hovered" : ""}`}
                        style={{
                          opacity: hoveredProduct === index ? 1 : 0,
                          visibility: hoveredProduct === index ? "visible" : "hidden",
                          transition: "opacity 0.3s ease, visibility 0.3s ease",
                        }}
                      >
                        <div className="d-flex align-items-center">
                          <ReactStars
                            count={+5}
                            size={24}
                            value={+item?.rating?.toString()}
                            isHalf={true}
                            edit={false}
                            color="#ccc"
                            activeColor="#ffd700"
                          />
                          
                          <div className="wishlist-icon ms-auto">
                            <button
                              className="border-0 bg-transparent"
                              onClick={() => handleWishlistToggle(item?._id)}
                            >
                              {isProductInWishlist(item?._id) ? (
                                <AiFillHeart className="fs-5 text-danger" />
                              ) : (
                                <AiOutlineHeart className="fs-5" />
                              )}
                            </button>
                          </div>
                        </div>
                        <p
                          className="price"
                          style={{
                            color: "#F90004FF",            // Màu đỏ tươi hơn
                            fontWeight: "bold",          // Chữ đậm
                            fontSize: "18px",            // Lớn hơn mặc định
                            display: "inline-block",     // Giữ khối gọn
                          }}
                        >
                          {getPriceRangeFromVariants(item)}
                        </p>
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
                    </div>
                  </div>
                </div>
              ))}
            </div>
         {/* Dòng "Xem thêm" */}
           {productState && productState.filter((item) => item.category?._id === "681f0085fd79f6db173a2173").length > 2 && (
            <div className="col-12 text-center mt-3">
              <div
                onClick={() => setShowMore(!showMore)}
                className="fancy-toggle-btn"
              >
                <div className="col-12 text-center mt-3">
                  <button onClick={() => setShowMore(!showMore)} className="gold-toggle-btn">
                    <div className="btn-inner d-flex align-items-center justify-content-center position-relative">
                      <img src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748925264/icon-left_zd68q2.png" alt="left" className="btn-icon icon-left" />
                      <span className="btn-text">{showMore ? "Thu gọn" : "Xem thêm"}</span>
                      <img src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748925445/icon-right_s7mrvo.png" alt="right" className="btn-icon icon-right" />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}  
          </div>
        </div>
      </div>
      </Container>

      <Container class1="famous-wrapper py-3 home-wrapper-2">
        <div className="row">
          <div className="col-3">
            <div className="famous-card position-relative">
              <img
                src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748925594/famous-11_dhrzke.jpg"
                className="img-fluid"
                alt="famous"
              />
              <div className="famous-content position-absolute">
                <h5>Bản sắc Việt</h5>
                <h6>Áo dài Việt</h6>
                <p>Chỉ từ 900.000đ</p>
              </div>
            </div>
          </div>
          <div className="col-3">
            <div className="famous-card position-relative">
              <img
                src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748925628/famous-2_lwa40w.jpg"
                className="img-fluid"
                alt="famous"
              />
              <div className="famous-content position-absolute">
                <h5
                  className="text-dark"
                  style={{
                    textShadow: "2px 2px 5px rgba(0, 0, 0, 0.7)", // Thêm bóng cho chữ
                  }}
                >
                  Ấn tượng
                </h5>
                <h6
                  className="text-dark"
                  style={{
                    textShadow: "2px 2px 5px rgba(0, 0, 0, 0.6)", // Thêm bóng cho chữ
                  }}
                >
                  Đa dạng màu sắc.
                </h6>
                <p
                  className="text-dark"
                  style={{
                    textShadow: "2px 2px 5px rgba(0, 0, 0, 0.6)", // Thêm bóng cho chữ
                  }}
                >
                  Hơi hướng hiện đại
                </p>
              </div>
            </div>
          </div>
          <div className="col-3">
            <div className="famous-card position-relative">
              <img
                src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748925657/famous-3_uwsnao.jpg"
                className="img-fluid"
                alt="famous"
              />
              <div className="famous-content position-absolute">
                <h5
                  className="text-dark"
                  style={{
                    textShadow: "2px 2px 5px rgba(0, 0, 0, 0.6)", // Thêm bóng cho chữ
                  }}
                >
                  Sáng tạo
                </h5>
                <h6
                  className="text-dark"
                  style={{
                    textShadow: "2px 2px 5px rgba(0, 0, 0, 0.6)", // Thêm bóng cho chữ
                  }}
                >
                  Kết hợp độc đáo
                </h6>
                <p
                  className="text-dark"
                  style={{
                    textShadow: "2px 2px 5px rgba(0, 0, 0, 0.6)", // Thêm bóng cho chữ
                  }}
                >
                  Phong cách cá nhân
                </p>
              </div>
            </div>
          </div>
          <div className="col-3">
            <div className="famous-card position-relative">
              <img
                src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748925681/famous-4_n9gbrw.jpg"
                className="img-fluid"
                alt="famous"
              />
              <div className="famous-content position-absolute">
                <h5
                  className="text-dark"
                  style={{
                    textShadow: "2px 2px 5px rgba(0, 0, 0, 0.6)", // Thêm bóng cho chữ
                  }}
                >
                  Truyền thống
                </h5>
                <h6
                  className="text-dark"
                  style={{
                    textShadow: "2px 2px 5px rgba(255, 255, 255, 1)", // Thêm bóng cho chữ
                  }}
                >
                  Giữ dìn bản sắc
                </h6>
                <p
                  className="text-dark"
                  style={{
                    textShadow: "2px 2px 5px rgba(0, 0, 0, 0.6)", // Thêm bóng cho chữ
                  }}
                >
                  Tôn vinh vẽ đẹp Việt
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
      
{/* đặc biệt */}
      <Container class1="featured-wrapper py-4 home-wrapper-2x">
        <div style={{ position: "relative",  zIndex: 0 }}>
          {/* Ảnh góc trên bên trái */}
          <img
            src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748924457/corner-top-left_md0qbu.png"
            alt="top left decoration"
            style={{
              position: "absolute",
              top: "-12px",
              left: "-51px",
              width: "290px",
              height: "auto",
              zIndex: -1,
            }}
          />

          {/* Ảnh góc trên bên phải */}
          <img
            src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748924566/corner-top-rightt_p9uj4x.png"
            alt="top right decoration"
            style={{
              position: "absolute",
              top: "-12px",
              right: "-51px",
              width: "290px",
              height: "auto",
              zIndex: -1,
            }}
          />
          {/* Ảnh góc dưới bên trái */}
            <img
              src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748924711/bottom-left_zliugn.png"
              alt="bottom left decoration"
              style={{
                position: "absolute",
                bottom: "0px",
                left: "-54px",
                width: "540px",
                height: "auto",
                zIndex: -1,
                opacity: 0.3,
              }}
            />

            {/* Ảnh góc dưới bên phải */}
            <img
              src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748924773/bottom-right_d4mbqd.png"
              alt="bottom right decoration"
              style={{
                position: "absolute",
                bottom: "-16px",
                right: "-50px",
                width: "400px",
                height: "auto",
                zIndex: -1,
                opacity: 0.3,
              }}
          />

          {/* Nội dung chính */}
          <div className="row">
          <div className="col-12 mb-3">
            <div className="d-flex justify-content-center align-items-center">
              {/* Ảnh bên trái */}
              <img
                src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748924911/Right_hes5y0.png"
                alt="left decoration"
                style={{ width: "130px", height: "60px", objectFit: "contain" }}
              />

              {/* Tiêu đề ở giữa */}
              <h3 className="section-heading text-center mb-0" style={{ color: "#000000" }}>
                Bộ sưu tập đặc biệt 
              </h3>

              {/* Ảnh bên phải */}
              <img
                src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748925086/Left_niuqcd.png"
                alt="right decoration"
                style={{ width: "130px", height: "60px", objectFit: "contain" }}
              />
            </div>

            {/* Xem tất cả: để dưới nếu vẫn muốn dùng */}
            <div className="text-center mt-2">
              <span
                onClick={() => navigate("/product")}
                style={{
                  cursor: "pointer",
                  color: "#d1d1d1",
                  fontSize: "14px",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#28a745")}
                onMouseLeave={(e) => (e.target.style.color = "#d1d1d1")}
              >
                Xem tất cả
              </span>
            </div>
          </div>

          {productState &&
            [...productState] // Tạo bản sao của mảng để không thay đổi trạng thái ban đầu
              .reverse() // Đảo ngược thứ tự mảng
              .filter((item) => item.tags === "special") // Lọc chỉ những sản phẩm có tag "featured"
              .slice(0, showMore ? productState.length : 4) // Hiển thị tất cả khi showMore = true, hoặc 8 sản phẩm đầu tiên
              .map((item, index) => (
                <div
                  key={index}
                  className="col-3 my-2"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                  onMouseEnter={() => setHoveredProduct(index)} // Khi hover, lưu chỉ số sản phẩm
                  onMouseLeave={() => setHoveredProduct(null)} // Khi rời chuột, reset trạng thái
                >
                  <div className="product-card position-relative" style={{ cursor: "pointer" }}>
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
                            ? item?.images[1] // Hiển thị ảnh thứ 2 khi hover
                            : item?.images?.[0] || "/default-image.png" // Dùng ảnh mặc định nếu không có ảnh
                        }
                        alt="product image"
                        height={"250px"}
                        width={"260px"}
                        onClick={() => navigate("/product/" + item?._id)}
                        style={{
                          objectFit: "cover",
                          display: "block",
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                        }}
                      />
                    </div>
                    <div className="product-details" style={{ padding: "15px", color: "#000000",  }}>
                      {/* Name và Brand luôn hiển thị */}
                      <div className="d-flex justify-content-between align-items-center">
                        <h8 className="brand">{item?.brand}</h8>
                        <p style={{ fontSize: "13px", marginBottom: "0", color: "#000000" }}>
                          Đã bán: {item?.inventory?.totalQuantitySell ?? 0}
                        </p>
                      </div>
                      <h5 className="product-title" style={{ color: "#020202",}}>
                        {item?.name?.length > 35 ? item.name.substr(0, 35) + "..." : item?.name}
                      </h5>
                      {/* 3 phần còn lại chỉ hiển thị khi hover */}
                      <div
                        className={`hover-details ${hoveredProduct === index ? "hovered" : ""}`}
                        style={{
                          opacity: hoveredProduct === index ? 1 : 0,
                          visibility: hoveredProduct === index ? "visible" : "hidden",
                          transition: "opacity 0.3s ease, visibility 0.3s ease",
                        }}
                      >
                        <div className="d-flex align-items-center">
                          <ReactStars
                            count={+5}
                            size={24}
                            value={+item?.rating?.toString()}
                            isHalf={true}
                            edit={false}
                            color="#ccc"
                            activeColor="#ffd700"
                          />
                          
                          <div className="wishlist-icon ms-auto">
                            <button
                              className="border-0 bg-transparent"
                              onClick={() => handleWishlistToggle(item?._id)}
                            >
                              {isProductInWishlist(item?._id) ? (
                                <AiFillHeart className="fs-5 text-danger" />
                              ) : (
                                <AiOutlineHeart className="fs-5" />
                              )}
                            </button>
                          </div>
                        </div>
                        <p
                          className="price"
                          style={{
                            color: "#F90004FF",            // Màu đỏ tươi hơn
                            fontWeight: "bold",          // Chữ đậm
                            fontSize: "18px",            // Lớn hơn mặc định
                            display: "inline-block",     // Giữ khối gọn
                          }}
                        >
                          {getPriceRangeFromVariants(item)}
                        </p>
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
                    </div>
                  </div>
                </div>
              ))}
          {/* Dòng "Xem thêm" */}
          {productState && productState.filter((item) => item.tags === "special").length > 4 && (
            <div className="col-12 text-center mt-3">
              <div
                onClick={() => setShowMore(!showMore)}
                className="fancy-toggle-btn"
              >
                <div className="col-12 text-center mt-3">
                  <button onClick={() => setShowMore(!showMore)} className="gold-toggle-btn">
                    <div className="btn-inner d-flex align-items-center justify-content-center position-relative">
                      <img src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748925264/icon-left_zd68q2.png" alt="left" className="btn-icon icon-left" />
                      <span className="btn-text">{showMore ? "Thu gọn" : "Xem thêm"}</span>
                      <img src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748925445/icon-right_s7mrvo.png" alt="right" className="btn-icon icon-right" />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}  
        
        </div>
        </div>
      </Container>

{/* phổ biến */}
      <Container class1="featured-wrapper py-4 home-wrapper-z">
        <div style={{ position: "relative",  zIndex: 0 }}>
          {/* Ảnh góc trên bên trái */}
          <img
            src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748924457/corner-top-left_md0qbu.png"
            alt="top left decoration"
            style={{
              position: "absolute",
              top: "-12px",
              left: "-51px",
              width: "290px",
              height: "auto",
              zIndex: -1,
            }}
          />

          {/* Ảnh góc trên bên phải */}
          <img
            src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748924566/corner-top-rightt_p9uj4x.png"
            alt="top right decoration"
            style={{
              position: "absolute",
              top: "-12px",
              right: "-51px",
              width: "290px",
              height: "auto",
              zIndex: -1,
            }}
          />
          {/* Ảnh góc dưới bên trái */}
            <img
              src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748924711/bottom-left_zliugn.png"
              alt="bottom left decoration"
              style={{
                position: "absolute",
                bottom: "0px",
                left: "-54px",
                width: "540px",
                height: "auto",
                zIndex: -1,
                opacity: 0.3,
              }}
            />

            {/* Ảnh góc dưới bên phải */}
            <img
              src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748924773/bottom-right_d4mbqd.png"
              alt="bottom right decoration"
              style={{
                position: "absolute",
                bottom: "-16px",
                right: "-50px",
                width: "400px",
                height: "auto",
                zIndex: -1,
                opacity: 0.3,
              }}
          />

          {/* Nội dung chính */}
          <div className="row">
          <div className="col-12 mb-3">
            <div className="d-flex justify-content-center align-items-center">
              {/* Ảnh bên trái */}
              <img
                src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748924911/Right_hes5y0.png"
                alt="left decoration"
                style={{ width: "130px", height: "60px", objectFit: "contain" }}
              />

              {/* Tiêu đề ở giữa */}
              <h3 className="section-heading text-center mb-0" style={{ color: "#fff" }}>
                Bộ sưu tập phổ biến
              </h3>

              {/* Ảnh bên phải */}
              <img
                src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748925086/Left_niuqcd.png"
                alt="right decoration"
                style={{ width: "130px", height: "60px", objectFit: "contain" }}
              />
            </div>

            {/* Xem tất cả: để dưới nếu vẫn muốn dùng */}
            <div className="text-center mt-2">
              <span
                onClick={() => navigate("/product")}
                style={{
                  cursor: "pointer",
                  color: "#d1d1d1",
                  fontSize: "14px",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#28a745")}
                onMouseLeave={(e) => (e.target.style.color = "#d1d1d1")}
              >
                Xem tất cả
              </span>
            </div>
          </div>

          {productState &&
            [...productState] // Tạo bản sao của mảng để không thay đổi trạng thái ban đầu
              .reverse() // Đảo ngược thứ tự mảng
              .filter((item) => item.tags === "popular") // Lọc chỉ những sản phẩm có tag "featured"
              .slice(0, showMore ? productState.length : 8) // Hiển thị tất cả khi showMore = true, hoặc 8 sản phẩm đầu tiên
              .map((item, index) => (
                <div
                  key={index}
                  className="col-3 my-2"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                  onMouseEnter={() => setHoveredProduct(index)} // Khi hover, lưu chỉ số sản phẩm
                  onMouseLeave={() => setHoveredProduct(null)} // Khi rời chuột, reset trạng thái
                >
                  <div className="product-card position-relative" style={{ cursor: "pointer" }}>
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
                            ? item?.images[1] // Hiển thị ảnh thứ 2 khi hover
                            : item?.images?.[0] || "/default-image.png" // Dùng ảnh mặc định nếu không có ảnh
                        }
                        alt="product image"
                        height={"250px"}
                        width={"260px"}
                        onClick={() => navigate("/product/" + item?._id)}
                        style={{
                          objectFit: "cover",
                          display: "block",
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                        }}
                      />
                    </div>
                    <div className="product-details" style={{ padding: "15px", color: "#fff", textShadow: "0 1px 2px rgba(0, 0, 0, 0.6)", }}>
                      {/* Name và Brand luôn hiển thị */}
                      <div className="d-flex justify-content-between align-items-center">
                        <h8 className="brand">{item?.brand}</h8>
                        <p style={{ fontSize: "13px", marginBottom: "0", color: "#fff" }}>
                          Đã bán: {item?.inventory?.totalQuantitySell ?? 0}
                        </p>
                      </div>
                      <h5 className="product-title" style={{ color: "#fff", textShadow: "0 1px 2px rgba(0, 0, 0, 0.6)", }}>
                        {item?.name?.length > 35 ? item.name.substr(0, 35) + "..." : item?.name}
                      </h5>
                      {/* 3 phần còn lại chỉ hiển thị khi hover */}
                      <div
                        className={`hover-details ${hoveredProduct === index ? "hovered" : ""}`}
                        style={{
                          opacity: hoveredProduct === index ? 1 : 0,
                          visibility: hoveredProduct === index ? "visible" : "hidden",
                          transition: "opacity 0.3s ease, visibility 0.3s ease",
                        }}
                      >
                        <div className="d-flex align-items-center">
                          <ReactStars
                            count={+5}
                            size={24}
                            value={+item?.rating?.toString()}
                            isHalf={true}
                            edit={false}
                            color="#ccc"
                            activeColor="#ffd700"
                          />
                          
                          <div className="wishlist-icon ms-auto">
                            <button
                              className="border-0 bg-transparent"
                              onClick={() => handleWishlistToggle(item?._id)}
                            >
                              {isProductInWishlist(item?._id) ? (
                                <AiFillHeart className="fs-5 text-danger" />
                              ) : (
                                <AiOutlineHeart className="fs-5" />
                              )}
                            </button>
                          </div>
                        </div>
                        <p
                          className="price"
                          style={{
                            color: "#F90004FF",            // Màu đỏ tươi hơn
                            fontWeight: "bold",          // Chữ đậm
                            fontSize: "18px",            // Lớn hơn mặc định
                            display: "inline-block",     // Giữ khối gọn
                          }}
                        >
                          {getPriceRangeFromVariants(item)}
                        </p>
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
                    </div>
                  </div>
                </div>
              ))}
          {/* Dòng "Xem thêm" */}
          
        {productState && productState.filter((item) => item.tags === "popular").length > 8 && (
        <div className="col-12 text-center mt-3">
          <div
            onClick={() => setShowMore(!showMore)}
            className="fancy-toggle-btn"
          >
            <div className="col-12 text-center mt-3">
              <button onClick={() => setShowMore(!showMore)} className="gold-toggle-btn">
                <div className="btn-inner d-flex align-items-center justify-content-center position-relative">
                  <img src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748925264/icon-left_zd68q2.png" alt="left" className="btn-icon icon-left" />
                  <span className="btn-text">{showMore ? "Thu gọn" : "Xem thêm"}</span>
                  <img src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748925445/icon-right_s7mrvo.png" alt="right" className="btn-icon icon-right" />
                </div>
              </button>
            </div>
          </div>
        </div>
      )}


        </div>
        </div>
      </Container>

{/* áo nhật bình */}
      <Container class1="featured-wrapper py-4 home-wrapper-y2 ">
        <div style={{ position: "relative",  zIndex: 0 }}>
          {/* Ảnh góc trên bên trái */}
          <img
            src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748924457/corner-top-left_md0qbu.png"
            alt="top left decoration"
            style={{
              position: "absolute",
              top: "-12px",
              left: "-51px",
              width: "290px",
              height: "auto",
              zIndex: -1,
            }}
          />

          {/* Ảnh góc trên bên phải */}
          <img
            src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748924566/corner-top-rightt_p9uj4x.png"
            alt="top right decoration"
            style={{
              position: "absolute",
              top: "-12px",
              right: "-51px",
              width: "290px",
              height: "auto",
              zIndex: -1,
            }}
          />
          {/* Ảnh góc dưới bên trái */}
            <img
              src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748924711/bottom-left_zliugn.png"
              alt="bottom left decoration"
              style={{
                position: "absolute",
                bottom: "0px",
                left: "-54px",
                width: "540px",
                height: "auto",
                zIndex: -1,
                opacity: 0.3,
              }}
            />

            {/* Ảnh góc dưới bên phải */}
            <img
              src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748924773/bottom-right_d4mbqd.png"
              alt="bottom right decoration"
              style={{
                position: "absolute",
                bottom: "-16px",
                right: "-50px",
                width: "400px",
                height: "auto",
                zIndex: -1,
                opacity: 0.3,
              }}
          />

          {/* Nội dung chính */}
          <div className="row align-items-start">
          <div className="col-12 mb-3">
            <div className="d-flex justify-content-center align-items-center">
              {/* Ảnh bên trái */}
              <img
                src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748924911/Right_hes5y0.png"
                alt="left decoration"
                style={{ width: "130px", height: "60px", objectFit: "contain" }}
              />

              {/* Tiêu đề ở giữa */}
              <h3 className="section-heading text-center mb-0" style={{ color: "#FFFFFFFF" }}>
                Bộ sưu tập áo nhật bình 
              </h3>

              {/* Ảnh bên phải */}
              <img
                src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748925086/Left_niuqcd.png"
                alt="right decoration"
                style={{ width: "130px", height: "60px", objectFit: "contain" }}
              />
            </div>

            {/* Xem tất cả: để dưới nếu vẫn muốn dùng */}
            <div className="text-center mt-2">
              <span
                onClick={() => navigate("/product")}
                style={{
                  cursor: "pointer",
                  color: "#d1d1d1",
                  fontSize: "14px",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#28a745")}
                onMouseLeave={(e) => (e.target.style.color = "#d1d1d1")}
              >
                Xem tất cả
              </span>
            </div>
          </div>



          <div className="col-md-6 mb-4">
          <div className="row">
            {productState &&
            [...productState] // Tạo bản sao của mảng để không thay đổi trạng thái ban đầu
              .reverse() // Đảo ngược thứ tự mảng
              .filter((item) =>  item.category?._id === "681f0071fd79f6db173a216b") // Lọc chỉ những sản phẩm có tag "featured"
              .slice(0, showMore ? productState.length : 2) // Hiển thị tất cả khi showMore = true, hoặc 8 sản phẩm đầu tiên
              .map((item, index) => (
                <div
                  key={index}
                  className="col-6 my-2"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                  onMouseEnter={() => setHoveredProduct(index)} // Khi hover, lưu chỉ số sản phẩm
                  onMouseLeave={() => setHoveredProduct(null)} // Khi rời chuột, reset trạng thái
                >
                  <div className="product-card position-relative" style={{ cursor: "pointer" }}>
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
                            ? item?.images[1] // Hiển thị ảnh thứ 2 khi hover
                            : item?.images?.[0] || "/default-image.png" // Dùng ảnh mặc định nếu không có ảnh
                        }
                        alt="product image"
                        height={"250px"}
                        width={"260px"}
                        onClick={() => navigate("/product/" + item?._id)}
                        style={{
                          objectFit: "cover",
                          display: "block",
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                        }}
                      />
                    </div>
                    <div className="product-details" style={{ padding: "15px", }}>
                      {/* Name và Brand luôn hiển thị */}
                      <div className="d-flex justify-content-between align-items-center">
                        <h8 className="brand">{item?.brand}</h8>
                        <p style={{ fontSize: "13px", marginBottom: "0"}}>
                          Đã bán: {item?.inventory?.totalQuantitySell ?? 0}
                        </p>
                      </div>
                      <h5 className="product-title" style={{ color: "#020202",}}>
                        {item?.name?.length > 35 ? item.name.substr(0, 35) + "..." : item?.name}
                      </h5>
                      {/* 3 phần còn lại chỉ hiển thị khi hover */}
                      <div
                        className={`hover-details ${hoveredProduct === index ? "hovered" : ""}`}
                        style={{
                          opacity: hoveredProduct === index ? 1 : 0,
                          visibility: hoveredProduct === index ? "visible" : "hidden",
                          transition: "opacity 0.3s ease, visibility 0.3s ease",
                        }}
                      >
                        <div className="d-flex align-items-center">
                          <ReactStars
                            count={+5}
                            size={24}
                            value={+item?.rating?.toString()}
                            isHalf={true}
                            edit={false}
                            color="#ccc"
                            activeColor="#ffd700"
                          />
                          
                          <div className="wishlist-icon ms-auto">
                            <button
                              className="border-0 bg-transparent"
                              onClick={() => handleWishlistToggle(item?._id)}
                            >
                              {isProductInWishlist(item?._id) ? (
                                <AiFillHeart className="fs-5 text-danger" />
                              ) : (
                                <AiOutlineHeart className="fs-5" />
                              )}
                            </button>
                          </div>
                        </div>
                        <p
                          className="price"
                          style={{
                            color: "#F90004FF",            // Màu đỏ tươi hơn
                            fontWeight: "bold",          // Chữ đậm
                            fontSize: "18px",            // Lớn hơn mặc định
                            display: "inline-block",     // Giữ khối gọn
                          }}
                        >
                          {getPriceRangeFromVariants(item)}
                        </p>
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
                    </div>
                  </div>
                </div>
              ))}
            </div>
         {/* Dòng "Xem thêm" */}
           {productState && productState.filter((item) => item.category?._id === "681f0071fd79f6db173a216b").length > 2 && (
            <div className="col-12 text-center mt-3">
              <div
                onClick={() => setShowMore(!showMore)}
                className="fancy-toggle-btn"
              >
                <div className="col-12 text-center mt-3">
                  <button onClick={() => setShowMore(!showMore)} className="gold-toggle-btn">
                    <div className="btn-inner d-flex align-items-center justify-content-center position-relative">
                      <img src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748925264/icon-left_zd68q2.png" alt="left" className="btn-icon icon-left" />
                      <span className="btn-text">{showMore ? "Thu gọn" : "Xem thêm"}</span>
                      <img src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748925445/icon-right_s7mrvo.png" alt="right" className="btn-icon icon-right" />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}  
          </div>
          <div className="col-md-6 mb-4" data-aos="fade-right">

            <div style={{ position: "relative", overflow: "visible" }}>
              <div
                style={{
                  position: "relative",
                  paddingBottom: "56.25%",
                  height: 0,
                  overflow: "hidden",
                  borderRadius: "10px",
                }}
              >
                <iframe
                  id="featured-video"

                  src="https://www.youtube.com/embed/pOX7wuIzju4?enablejsapi=1"
                  title="YouTube video"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    border: "none",
                    borderRadius: "10px",
                  }}
                ></iframe>
              </div>

              {/* Ảnh đè lên video và tràn ra ngoài một phần */}
              <img
                src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748925725/nhatbinh2_yelabo.png"
                alt="Decor Overlay"
                style={{
                  position: "absolute",
                  bottom: "-180px", 
                  left: "-76px",   
                  width: "250px",
                  height: "auto",
                  zIndex: 3,
                }}
              />
              <img
                src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748925750/nhatbinh1_uefadu.png" 
                alt="Decor Bottom Right"
                style={{
                  position: "absolute",
                  bottom: "-180px", 
                  right: "-50px",  
                  width: "250px",
                  height: "auto",
                  zIndex: 3,
                }}
              />
            </div>

          </div>
        </div>
      </div>
      </Container>

{/* yêu thích */}
      {authState?.user && wishlistState && wishlistState.length > 0 && (
        <Container class1="featured-wrapper py-4 home-wrapper-2x">
          <div style={{ position: "relative", zIndex: 0 }}>
            {/* Ảnh góc trang trí */}
            <img src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748924457/corner-top-left_md0qbu.png" alt="top left decoration" style={{ position: "absolute", top: "-12px", left: "-51px", width: "290px", zIndex: -1 }} />
            <img src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748924566/corner-top-rightt_p9uj4x.png" alt="top right decoration" style={{ position: "absolute", top: "-12px", right: "-51px", width: "290px", zIndex: -1 }} />
            {/* <img src="images/bottom-left.png" alt="bottom left decoration" style={{ position: "absolute", bottom: "0px", left: "-54px", width: "540px", opacity: 0.3, zIndex: -1 }} />
            <img src="images/bottom-right.png" alt="bottom right decoration" style={{ position: "absolute", bottom: "-16px", right: "-50px", width: "400px", opacity: 0.3, zIndex: -1 }} /> */}

            <div className="row">
              <div className="col-12 mb-3">
                <div className="d-flex justify-content-center align-items-center">
                  <img src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748924911/Right_hes5y0.png" alt="left decoration" style={{ width: "130px", height: "60px", objectFit: "contain" }} />
                  <h3 className="section-heading text-center mb-0" style={{ color: "#000000" }}>
                    Sản phẩm yêu thích
                  </h3>
                  <img src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748925086/Left_niuqcd.png" alt="right decoration" style={{ width: "130px", height: "60px", objectFit: "contain" }} />
                </div>
                <div className="text-center mt-2">
                  <span
                    onClick={() => navigate("/wishlist")}
                    style={{
                      cursor: "pointer",
                      color: "#d1d1d1",
                      fontSize: "14px",
                    }}
                    onMouseEnter={(e) => (e.target.style.color = "#28a745")}
                    onMouseLeave={(e) => (e.target.style.color = "#d1d1d1")}
                  >
                    Xem tất cả
                  </span>
                </div>
              </div>

              {[...wishlistState]
                .reverse()
                .slice(0, showMore ? wishlistState.length : 4)
                .map((item, index) => (
                  <div
                    key={index}
                    className="col-3 my-2"
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                    onMouseEnter={() => setHoveredProduct(index)}
                    onMouseLeave={() => setHoveredProduct(null)}
                  >
                    <div className="product-card position-relative" style={{ cursor: "pointer" }}>
                      <div className="product-image" style={{ position: "relative", width: "100%", height: "0", paddingBottom: "150%" }}>
                        <img
                          src={
                            hoveredProduct === index && item?.images?.[1]
                              ? item?.images[1]
                              : item?.images?.[0] || "/default-image.png"
                          }
                          alt="product"
                          onClick={() => navigate("/product/" + item?._id)}
                          style={{
                            objectFit: "cover",
                            display: "block",
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                          }}
                        />
                      </div>
                      <div className="product-details" style={{ padding: "15px", color: "#000" }}>
                        <div className="d-flex justify-content-between align-items-center">
                          <h8 className="brand">{item?.brand}</h8>
                          <p style={{ fontSize: "13px", marginBottom: 0 }}>
                            Đã bán: {item?.inventory?.totalQuantitySell ?? 0}
                          </p>
                        </div>
                        <h5 className="product-title">
                          {item?.name?.length > 35 ? item.name.substr(0, 35) + "..." : item?.name}
                        </h5>

                        <div
                          className={`hover-details ${hoveredProduct === index ? "hovered" : ""}`}
                          style={{
                            opacity: hoveredProduct === index ? 1 : 0,
                            visibility: hoveredProduct === index ? "visible" : "hidden",
                            transition: "opacity 0.3s ease, visibility 0.3s ease",
                          }}
                        >
                          <div className="d-flex align-items-center">
                            <ReactStars
                              count={5}
                              size={24}
                              value={+item?.rating?.toString()}
                              isHalf={true}
                              edit={false}
                              color="#ccc"
                              activeColor="#ffd700"
                            />
                            <div className="wishlist-icon ms-auto">
                              <button
                                className="border-0 bg-transparent"
                                onClick={() => handleWishlistToggle(item?._id)}
                              >
                                {isProductInWishlist(item?._id) ? (
                                  <AiFillHeart className="fs-5 text-danger" />
                                ) : (
                                  <AiOutlineHeart className="fs-5" />
                                )}
                              </button>
                            </div>
                          </div>
                          <p className="price" style={{ color: "#F90004", fontWeight: "bold", fontSize: "18px" }}>
                            {getPriceRangeFromVariants(item)}
                          </p>
                          {getUniqueColorsWishlist(item).length > 0 && (
                            <div className="d-flex justify-content-start gap-2">
                              {getUniqueColorsWishlist(item).map((color, idx) => (
                                <div
                                  key={idx}
                                  title={color}
                                  style={{
                                    width: "18px",
                                    height: "18px",
                                    borderRadius: "50%",
                                    backgroundColor: color,
                                    border: "1px solid #ccc",
                                  }}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

              {wishlistState.length > 4 && (
                <div className="col-12 text-center mt-3">
                  <button onClick={() => setShowMore(!showMore)} className="gold-toggle-btn">
                    <div className="btn-inner d-flex align-items-center justify-content-center position-relative">
                      <img src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748925264/icon-left_zd68q2.png" alt="left" className="btn-icon icon-left" />
                      <span className="btn-text">{showMore ? "Thu gọn" : "Xem thêm"}</span>
                      <img src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748925445/icon-right_s7mrvo.png" alt="right" className="btn-icon icon-right" />
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </Container>
      )}

{/* đã xem */}
{authState?.user && historyState && historyState.length > 0 && (
  <Container class1="featured-wrapper py-4 home-wrapper-z">
    <div style={{ position: "relative", zIndex: 0 }}>
      {/* Các ảnh góc trang trí */}
      <img src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748924457/corner-top-left_md0qbu.png" alt="top left decoration" style={{ position: "absolute", top: "-12px", left: "-51px", width: "290px", zIndex: -1 }} />
      <img src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748924566/corner-top-rightt_p9uj4x.png" alt="top right decoration" style={{ position: "absolute", top: "-12px", right: "-51px", width: "290px", zIndex: -1 }} />
      <img src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748924711/bottom-left_zliugn.png" alt="bottom left decoration" style={{ position: "absolute", bottom: "0px", left: "-54px", width: "540px", opacity: 0.3, zIndex: -1 }} />
      <img src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748924773/bottom-right_d4mbqd.png" alt="bottom right decoration" style={{ position: "absolute", bottom: "-16px", right: "-50px", width: "400px", opacity: 0.3, zIndex: -1 }} />

      {/* Nội dung chính */}
      <div className="row">
        <div className="col-12 mb-3">
          <div className="d-flex justify-content-center align-items-center">
            <img src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748924911/Right_hes5y0.png" alt="left decoration" style={{ width: "130px", height: "60px", objectFit: "contain" }} />
            <h3 className="section-heading text-center mb-0" style={{ color: "#fff" }}>Sản phẩm đã xem</h3>
            <img src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748925086/Left_niuqcd.png" alt="right decoration" style={{ width: "130px", height: "60px", objectFit: "contain" }} />
          </div>

          <div className="text-center mt-2">
            <span
              onClick={() => navigate("/product")}
              style={{
                cursor: "pointer",
                color: "#d1d1d1",
                fontSize: "14px",
              }}
              onMouseEnter={(e) => (e.target.style.color = "#28a745")}
              onMouseLeave={(e) => (e.target.style.color = "#d1d1d1")}
            >
              Xem tất cả
            </span>
          </div>
        </div>

        {[...historyState].reverse().slice(0, showMore ? historyState.length : 8).map((item, index) => (
          <div key={index} className="col-3 my-2" data-aos="fade-up" data-aos-delay={index * 100}
            onMouseEnter={() => setHoveredProduct(index)}
            onMouseLeave={() => setHoveredProduct(null)}
          >
            <div className="product-card position-relative" style={{ cursor: "pointer" }}>
              <div className="product-image" style={{ position: "relative", width: "100%", height: "0", paddingBottom: "150%" }}>
                <img
                  src={
                    hoveredProduct === index && item?.images?.[1]
                      ? item?.images[1]
                      : item?.images?.[0] || "/default-image.png"
                  }
                  alt="product"
                  onClick={() => navigate("/product/" + item?._id)}
                  style={{
                    objectFit: "cover",
                    display: "block",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                  }}
                />
              </div>

              <div className="product-details" style={{ padding: "15px", color: "#fff", textShadow: "0 1px 2px rgba(0,0,0,0.6)" }}>
                <div className="d-flex justify-content-between align-items-center">
                  <h8 className="brand">{item?.brand}</h8>
                  <p style={{ fontSize: "13px", marginBottom: "0" }}>
                    Đã bán: {item?.inventory?.totalQuantitySell ?? 0}
                  </p>
                </div>
                <h5 className="product-title" style={{color: "#fff"}}>
                  {item?.name?.length > 35 ? item.name.substr(0, 35) + "..." : item?.name}
                </h5>

                <div className={`hover-details ${hoveredProduct === index ? "hovered" : ""}`}
                  style={{
                    opacity: hoveredProduct === index ? 1 : 0,
                    visibility: hoveredProduct === index ? "visible" : "hidden",
                    transition: "opacity 0.3s ease, visibility 0.3s ease",
                  }}
                >
                  <div className="d-flex align-items-center">
                    <ReactStars
                      count={5}
                      size={24}
                      value={+item?.rating?.toString()}
                      isHalf={true}
                      edit={false}
                      color="#ccc"
                      activeColor="#ffd700"
                    />
                    <div className="wishlist-icon ms-auto">
                      <button
                        className="border-0 bg-transparent"
                        onClick={() => handleWishlistToggle(item?._id)}
                      >
                        {isProductInWishlist(item?._id) ? (
                          <AiFillHeart className="fs-5 text-danger" />
                        ) : (
                          <AiOutlineHeart className="fs-5" />
                        )}
                      </button>
                    </div>
                  </div>
                  <p className="price" style={{ color: "#F90004FF", fontWeight: "bold", fontSize: "18px" }}>
                    {getPriceRangeFromVariants(item)}
                  </p>
                  {getUniqueColorsWishlist(item).length > 0 && (
                  <div className="d-flex justify-content-start gap-2">
                    {getUniqueColorsWishlist(item).map((color, idx) => (
                      <div
                        key={idx}
                        title={color}
                        style={{
                          width: "18px",
                          height: "18px",
                          borderRadius: "50%",
                          backgroundColor: color,
                          border: "1px solid #ccc",
                        }}
                      />
                    ))}
                  </div>
                )}

                </div>
              </div>
            </div>
          </div>
        ))}

        {historyState.length > 8 && (
          <div className="col-12 text-center mt-3">
            <button onClick={() => setShowMore(!showMore)} className="gold-toggle-btn">
              <div className="btn-inner d-flex align-items-center justify-content-center position-relative">
                <img src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748925264/icon-left_zd68q2.png" alt="left" className="btn-icon icon-left" />
                <span className="btn-text">{showMore ? "Thu gọn" : "Xem thêm"}</span>
                <img src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748925445/icon-right_s7mrvo.png" alt="right" className="btn-icon icon-right" />
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  </Container>
)}

      


      <Container class1="blog-wrapper py-3 home-wrapper-2">
        <div className="row">
          <div className="col-12">
          <div className="d-flex justify-content-center align-items-center">
            <img src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748924911/Right_hes5y0.png" alt="left decoration" style={{ width: "130px", height: "60px", objectFit: "contain" }} />
            <h3 className="section-heading text-center mb-0" style={{ color: "#000000" }}>Bài viết mới nhất</h3>
            <img src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748925086/Left_niuqcd.png" alt="right decoration" style={{ width: "130px", height: "60px", objectFit: "contain" }} />
          </div>
          </div>
        </div>
        <div className="row">
          {blogState &&
            blogState?.map((item, index) => {
              if (index < 4) {
                return (
                  <div className="col-3 " key={index}>
                    <BlogCard
                      id={item?._id}
                      title={item?.title}
                      description={item?.description}
                      image={item?.images[0]}
                      date={moment(item?.createdAt).format(
                        "MMMM Do YYYY, h:mm a"
                      )}
                    />
                  </div>
                );
              }
            })}
        </div>
      </Container>
    </>
  );
};

export default Home;
