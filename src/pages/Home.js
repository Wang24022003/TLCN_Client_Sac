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
import { getAllProducts } from "../features/products/productSlilce";
import ReactStars from "react-rating-stars-component";
import { addToWishlist } from "../features/products/productSlilce";
import { getuserProductWishlist } from "../features/user/userSlice";
import "./../Css/CssHome.css"
const Home = () => {
  const blogState = useSelector((state) => state?.blog?.blog);
  const productState = useSelector((state) => state?.product?.product);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    getblogs();
    getProducts();
    dispatch(getuserProductWishlist());
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

  const [hoveredProduct, setHoveredProduct] = useState(null);


  return (
    <>
      <Container className="home-wrapper-1 py-5">
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
              src="images/Home1.jpg"
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
              src="images/Home2.jpg"
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
              src="images/Home3.jpg"
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
              src="images/Home4.jpg"
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
              src="images/Home5.jpg"
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


      <Container class1="featured-wrapper py-5 home-wrapper-2">
        <div className="row">
          <div className="col-12">
            <h3 className="section-heading">Bộ sưu tập nổi bật</h3>
          </div>
          {productState &&
            productState?.map((item, index) => {
              if (item.tags === "featured") {
                return (
                  <div
                    key={index}
                    className="col-3 my-4"
                    onMouseEnter={() => setHoveredProduct(index)} // Khi hover, lưu chỉ số sản phẩm
                    onMouseLeave={() => setHoveredProduct(null)} // Khi rời chuột, reset trạng thái
                  >
                    <div className="product-card position-relative">
                    
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



                      <div className="product-details">
                  <h6 className="brand">{item?.brand}</h6>
                  <h5 className="product-title">
                    {item?.name?.substr(0, 70) + "..."}
                  </h5>
                  <div className="d-flex align-items-center">
                    <ReactStars
                      count={5}
                      size={24}
                      value={item?.rating.toString()}
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
                        <img src={wish} alt="wishlist" />
                      </button>
                    </div>
                  </div>
                  <p className="price">
                    {item?.price ? item.price.toLocaleString("vi-VN") : 0}₫
                  </p>
                </div>
                    </div>
                  </div>
                );
              }
            })}
        </div>
      </Container>;




      <Container class1="famous-wrapper py-1 home-wrapper-2">
        <div className="row">
          <div className="col-3">
            <div className="famous-card position-relative">
              <img
                src="images/famous-11.jpg"
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
                src="images/famous-2.jpg"
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
                src="images/famous-3.jpg"
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
                src="images/famous-4.jpg"
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
      <Container class1="special-wrapper py-5 home-wrapper-2">
        <div className="row">
          <div className="col-12">
            <h3 className="section-heading">Sản phẩm đặc biệt</h3>
          </div>
        </div>
        <div className="row">
          {productState &&
            productState?.map((item, index) => {
              if (item.tags === "special") {
                return (
                  <SpecialProduct
                    key={index}
                    id={item?._id}
                    title={item?.name}
                    brand={item?.brand}
                    totalrating={item?.rating.toString()}
                    price={item?.price ? item.price.toLocaleString("vi-VN") : 0}
                    img={item?.images[0]}
                    sold={item?.sold}
                    quantity={item?.quantity}
                  />
                );
              }
            })}
        </div>
      </Container>

      <Container class1="popular-wrapper py-1 home-wrapper-2">
        <div className="row">
          <div className="col-12">
            <h3 className="section-heading">Sản phẩm phổ biến</h3>
          </div>
        </div>
        <div className="row">
          {productState &&
            productState?.map((item, index) => {
              if (item.tags === "popular") {
                return (
                  <div
                    key={index}
                    className="col-3 my-4"
                    onMouseEnter={() => setHoveredProduct(index)} // Khi hover, lưu chỉ số sản phẩm
                    onMouseLeave={() => setHoveredProduct(null)} // Khi rời chuột, reset trạng thái
                  >
                    <div className="product-card position-relative">

                      

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

                      <div className="product-details">
                        <h6 className="brand">{item?.brand}</h6>
                        <h5 className="product-title">
                          {item?.name?.substr(0, 70) + "..."}
                        </h5>
                        <div className="d-flex align-items-center">
                        <ReactStars
                          count={5}
                          size={24}
                          value={item?.rating.toString()}
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
                            <img src={wish} alt="wishlist" />
                          </button>
                        </div>
                        </div>
                        <p className="price">
                          {item?.price ? item.price.toLocaleString("vi-VN") : 0}
                          ₫
                        </p>
                      </div>
                    </div>
                  </div>
                );
              }
            })}
        </div>
      </Container>
      <Container class1="blog-wrapper py-5 home-wrapper-2">
        <div className="row">
          <div className="col-12">
            <h3 className="section-heading">Bài viết mới nhất</h3>
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
