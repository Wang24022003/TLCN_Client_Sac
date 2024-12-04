import React, { useEffect, useState } from "react";
import ReactStars from "react-rating-stars-component";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import wish from "../images/wish.svg";
import ProductCard from "../components/ProductCard";
import ReactImageZoom from "react-image-zoom";
import Color from "../components/Color";
import { TbGitCompare } from "react-icons/tb";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Container from "../components/Container";
import { addToWishlist } from "../features/products/productSlilce";
import { useDispatch, useSelector } from "react-redux";
import {
  addRating,
  getAProduct,
  getAllProducts,
} from "../features/products/productSlilce";
import { toast } from "react-toastify";
import {
  addProdToCart,
  getUserCart,
  getuserProductWishlist,
} from "../features/user/userSlice";
import "./../Css/CssSingleProduct.css";

const SingleProduct = () => {
  const [color, setColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [alreadyAdded, setAlreadyAdded] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const getProductId = location.pathname.split("/")[2];
  const dispatch = useDispatch();
  const productState = useSelector((state) => state?.product?.singleproduct);
  const isReload = useSelector((state) => state?.isReload);
  const productsState = useSelector((state) => state?.product?.product);
  const cartState = useSelector((state) => state?.auth?.cartProducts);
  const authState = useSelector((state) => state?.auth);
  const wishlistState = useSelector((state) => state?.auth?.wishlist);

  useEffect(() => {
    if (authState.user) {
      dispatch(getAProduct({ id: getProductId, isLogin: true }));
    } else {
      dispatch(getAProduct({ id: getProductId }));
    }
    dispatch(getUserCart());
    dispatch(getAllProducts());
  }, [dispatch, getProductId]);
  useEffect(() => {
    dispatch(getAProduct({ id: getProductId }));
    return () => {};
  }, [isReload]);

  useEffect(() => {
    for (let index = 0; index < cartState?.length; index++) {
      if (getProductId === cartState[index]?.productId?._id) {
        setAlreadyAdded(true);
      }
    }
  }, [cartState, getProductId]);

  const uploadCart = () => {
    if (color === null) {
      toast.error("Please choose Color");
    } else if (quantity > productState?.quantity) {
      toast.error("Selected quantity exceeds available stock");
    } else {
      dispatch(
        addProdToCart({
          product: {
            _id: productState?._id,
            price: productState?.price,
            quantity: +quantity,
            color: color._id,
          },
        })
      );
      navigate("/cart");
    }
  };

  const props = {
    width: 594,
    height: 600,
    zoomWidth: 600,
    img: productState?.images[0]
      ? productState?.images[0]
      : "https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?cs=srgb&dl=pexels-fernando-arcos-190819.jpg&fm=jpg",
  };

  const [orderedProduct, setOrderedProduct] = useState(true);
  const copyToClipboard = (text) => {
    var textField = document.createElement("textarea");
    textField.innerText = text;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand("copy");
    textField.remove();
  };

  const closeModal = () => {};
  const [popularProduct, setPopularProduct] = useState([]);

  useEffect(() => {
    let data = [];
    for (let index = 0; index < productsState.length; index++) {
      const element = productsState[index];
      if (element.tags === "popular") {
        data.push(element);
      }
    }
    setPopularProduct(data);
  }, [productsState]);

  const [star, setStar] = useState(null);
  const [comment, setComment] = useState(null);
  const [like, setLike] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  const handleToggle = () => {
    setIsFilled(!isFilled);
  };

  const addRatingToProduct = () => {
    if (star === null) {
      toast.error("Please add star rating");
      return false;
    } else if (comment === null) {
      toast.error("Please Write Review About the Product");
      return false;
    } else {
      dispatch(
        addRating({
          userId: authState.user._id,
          productId: productState?._id,
          rating: +star,
          comment: comment,
        })
      );
      console.log(
        "🚀 ~ addRatingToProduct ~ getProductId:",
        productState?._idroductId
      );

      setTimeout(() => {
        dispatch(getAProduct(productState?._id));
      }, 100);
    }
    return false;
  };

  // New state to handle image navigation
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Function to handle next image
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === productState?.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Function to handle previous image
  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? productState?.images.length - 1 : prevIndex - 1
    );
  };

  // State and logic for related products
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    if (productState?.category) {
      const filteredProducts = productsState.filter(
        (product) =>
          product.category === productState.category &&
          product._id !== getProductId
      );
      setRelatedProducts(filteredProducts);
    }
  }, [productState, productsState, getProductId]);

  // State and logic for related products by brand
  const [relatedByBrand, setRelatedByBrand] = useState([]);

  useEffect(() => {
    if (productState?.brand) {
      const categories = new Set();
      const filteredProducts = productsState.filter((product) => {
        if (
          product.brand === productState.brand &&
          product._id !== getProductId
        ) {
          if (!categories.has(product.category)) {
            categories.add(product.category);
            return true;
          }
        }
        return false;
      });
      setRelatedByBrand(filteredProducts);
    }
  }, [productState, productsState, getProductId]);

  // -------------------------------------------------------------
  const [error, setError] = useState("");

  const handleQuantityChange = (e) => {
    const value = e.target.value;

    if (value < 1) {
      setError("Số lượng không được nhỏ hơn 1.");
    } else {
      setError(""); // Xóa lỗi nếu nhập đúng
      setQuantity(value);
    }
  };

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
      <Meta title={"Product Name"} />
      <BreadCrumb title={productState?.name} />
      <Container class1="main-product-wrapper py-5 home-wrapper-2">
        <div className="row">
          <div className="col-2">
            <div className="other-product-images d-flex flex-column gap-3 justify-content-center">
              {productState?.images.map((item, index) => (
                <div
                  key={index}
                  className="image-thumbnail"
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <img
                    src={item}
                    className="img-fluid thumbnail-img"
                    alt={`Product Thumbnail ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="col-5">
            <div className="main-product-image">
              <div className="image-container" style={{ position: "relative" }}>
                {productState?.images[currentImageIndex] && (
                  <ReactImageZoom
                    {...props}
                    img={productState?.images[currentImageIndex]}
                  />
                )}
                <button
                  className="prev-button"
                  onClick={prevImage}
                  // style={prevButtonStyle}
                >
                  &#10094;
                </button>
                <button
                  className="next-button"
                  onClick={nextImage}
                  //style={nextButtonStyle}
                >
                  &#10095;
                </button>
              </div>
            </div>
          </div>

          <div className="col-5">
            <div className="main-product-details">
              <div className="border-bottom">
                <h3 className="title">{productState?.name}</h3>
              </div>
              <div className="border-bottom py-3">
                <p className="price">
                  {productState?.price
                    ? productState.price.toLocaleString("vi-VN")
                    : 0}
                  ₫
                </p>

                <div className="d-flex align-items-center gap-10">
                  <ReactStars
                    count={5}
                    size={24}
                    value={productState?.rating?.toString()}
                    edit={false}
                    activeColor="#ffd700"
                  />
                  <p className="mb-0 t-review">
                    ( {productState?.ratings?.length} Đánh giá )
                  </p>
                </div>
                <a className="review-btn" href="#review">
                  Viết đánh giá
                </a>
              </div>
              <div className="py-3">
                <div className="d-flex gap-10 align-items-center my-2">
                  <h3 className="product-heading">Loại :</h3>
                  <p className="product-data">{productState?.category}</p>
                </div>
                <div className="d-flex gap-10 align-items-center my-2">
                  <h3 className="product-heading">Thương hiệu :</h3>
                  <p className="product-data">{productState?.brand}</p>
                </div>
                <div className="d-flex gap-10 align-items-center my-2">
                  <h3 className="product-heading">Danh mục :</h3>
                  <p className="product-data">{productState?.category}</p>
                </div>
                <div className="d-flex gap-10 align-items-center my-2">
                  <h3 className="product-heading">Tags :</h3>
                  <p className="product-data">{productState?.tags}</p>
                </div>
                <div className="d-flex gap-10 align-items-center my-2">
                  <h3 className="product-heading">Tình trạng hàng sẳn có :</h3>
                  <p className="product-data">{productState?.quantity}</p>
                </div>
                {alreadyAdded === false && (
                  <div className="d-flex gap-10 flex-column mt-2 mb-3">
                    <Color
                      setColor={setColor}
                      colorData={productState?.colors}
                    />
                  </div>
                )}
                <div className="wishlist-icon ms-auto">
                  <button
                    className="border-0 bg-transparent"
                    onClick={(e) => {
                      addToWish(productState?._id);
                    }}
                  >
                    <img src={wish} alt="wishlist" />
                  </button>
                </div>

                <div className="d-flex align-items-center gap-15 flex-row mb-3">
                  <h3 className="product-heading">Số lượng :</h3>
                  {alreadyAdded === false && (
                    <div className="">
                      <input
                        type="number"
                        min={1}
                        max={10}
                        className="form-control"
                        style={{ width: "70px" }}
                        // onChange={(e) => setQuantity(e.target.value)}
                        onChange={handleQuantityChange}
                        value={quantity}
                      />
                      {error && <small className="text-danger">{error}</small>}
                    </div>
                  )}
                  <div
                    className={
                      (alreadyAdded ? "ms-0" : "ms-5") +
                      " d-flex align-items-center gap-30"
                    }
                  >
                    <button
                      className="button border-0"
                      type="button"
                      onClick={() => {
                        alreadyAdded ? navigate("/cart") : uploadCart();
                      }}
                    >
                      {alreadyAdded
                        ? "sản phẩm vào giỏ hàng"
                        : "Thêm sản phẩm vào giỏ hàng "}
                    </button>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-15">
                  <div></div>
                </div>
                <div className="d-flex gap-10 flex-column  my-3">
                  <h3 className="product-heading">Vận chuyển & Đổi trả :</h3>
                  <p className="product-data">
                    Miễn phí vận chuyển và đổi trả cho tất cả các đơn hàng!{" "}
                    <br /> Chúng tôi sẽ giao tất cả các đơn hàng nội địa Việt
                    Nam trong vòng
                    <b> 5-10 ngày làm việc!</b>
                  </p>
                </div>
                <div className="d-flex gap-10 align-items-center my-3">
                  <h3 className="product-heading">Link sản phẩm:</h3>
                  <a
                    href="javascript:void(0);"
                    onClick={() => {
                      copyToClipboard(window.location.href);
                    }}
                  >
                    Sao chép Link sản phẩm
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
      <Container class1="description-wrapper py-4 home-wrapper-2">
        <div className="row">
          <div className="col-12">
            <h4>Mô tả</h4>
            <div className="bg-white p-3">
              <p
                dangerouslySetInnerHTML={{ __html: productState?.description }}
              ></p>
            </div>
          </div>
        </div>
      </Container>
      <Container class1="reviews-wrapper home-wrapper-2">
        <div className="row">
          <div className="col-12">
            <h3 id="review">Đánh giá</h3>
            <div className="review-inner-wrapper">
              <div className="review-head d-flex justify-content-between align-items-end">
                <div>
                  <h4 className="mb-2">Đánh giá của khách hàng</h4>
                  <div className="d-flex align-items-center gap-10">
                    <ReactStars
                      count={5}
                      size={24}
                      value={productState?.rating?.toString()}
                      edit={false}
                      activeColor="#ffd700"
                    />
                    <p className="mb-0">
                      Dựa trên {productState?.quantityComments} đánh giá
                    </p>
                  </div>
                </div>
                {orderedProduct && (
                  <div>
                    <a className="text-dark text-decoration-underline" href="">
                      Viết đánh giá
                    </a>
                  </div>
                )}
              </div>
              <div className="review-form py-4">
                <h4>Viết đánh giá</h4>

                <div>
                  <ReactStars
                    count={5}
                    size={24}
                    value={0}
                    edit={true}
                    activeColor="#ffd700"
                    onChange={(e) => {
                      setStar(e);
                    }}
                  />
                </div>
                <div>
                  <textarea
                    name=""
                    id=""
                    className="w-100 form-control"
                    cols="30"
                    rows="4"
                    placeholder="Nội dung..."
                    onChange={(e) => {
                      setComment(e.target.value);
                    }}
                  ></textarea>
                </div>
                <div className="d-flex justify-content-end mt-3">
                  <button
                    onClick={addRatingToProduct}
                    className="button border-0"
                    type="button"
                  >
                    Gửi đánh giá
                  </button>
                </div>
              </div>
              <div className="reviews mt-4">
                {productState &&
                  productState.ratings?.map((item, index) => {
                    return (
                      <div className="review" key={index}>
                        <div className="d-flex gap-10 align-items-center">
                          <h6 className="mb-0">{item?.postedby}</h6>
                          <ReactStars
                            count={5}
                            size={24}
                            value={item?.star}
                            edit={false}
                            activeColor="#ffd700"
                          />
                        </div>
                        <p className="mt-3">{item?.comment}</p>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </Container>
      <Container class1="related-wrapper py-5 home-wrapper-2">
        <div className="row">
          <div className="col-12">
            <h3 className="section-heading">Sản phẩm liên quan</h3>
          </div>
        </div>
        <div className="row">
          <ProductCard data={relatedByBrand} />
        </div>
      </Container>
      <Container class1="popular-wrapper py-5 home-wrapper-2">
        <div className="row">
          <div className="col-12">
            <h3 className="section-heading">Sản phẩm phổ biến</h3>
          </div>
        </div>
        <div className="row">
          <ProductCard data={popularProduct} />
        </div>
      </Container>

      <Container class1="related-wrapper py-5 home-wrapper-2">
        <div className="row">
          <div className="col-12">
            <h3 className="section-heading">Sản phẩm nổi bật</h3>
          </div>
        </div>
        <div className="row">
          <ProductCard data={relatedProducts} />
        </div>
      </Container>
    </>
  );
};

const prevButtonStyle = {
  position: "absolute",
  top: "50%",
  left: "10px", // Adjust this value to move the button further to the left
  transform: "translateY(-50%)",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  color: "white",
  border: "none",
  padding: "10px",
  cursor: "pointer",
  zIndex: 1,
};

const nextButtonStyle = {
  position: "absolute",
  top: "50%",
  right: "10px", // Adjust this value to move the button further to the right
  transform: "translateY(-50%)",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  color: "white",
  border: "none",
  padding: "10px",
  cursor: "pointer",
  zIndex: 1,
};

export default SingleProduct;
