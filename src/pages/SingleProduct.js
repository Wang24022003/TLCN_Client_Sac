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
import { FaMinus, FaPlus, FaRulerHorizontal } from "react-icons/fa";
import { BsShield } from "react-icons/bs";
import { IoColorPaletteOutline } from "react-icons/io5";
import { HiOutlineMail } from "react-icons/hi";
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
import { getRatingsUser } from "../utils/api";
import SizeSelect from "../components/SizeSelect";
import { getAProductCategory } from "../features/pcategory/pcategorySlice";
import { FiHeart, FiLayers } from "react-icons/fi";
import { AiOutlineShareAlt } from "react-icons/ai";

const SingleProduct = () => {
  const { categoryName } = useSelector((state) => state.pCategory);
  const [color, setColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [alreadyAdded, setAlreadyAdded] = useState(false);
  const [reviews, setReviews] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const getProductId = location.pathname.split("/")[2];
  const dispatch = useDispatch();
  const productState = useSelector((state) => state?.product?.singleproduct);
  const isReload = useSelector((state) => state?.isReload);
  const productsState = useSelector((state) => state?.product?.product);
  const cartState = useSelector((state) => state?.auth?.cartProducts);
  const authState = useSelector((state) => state?.auth);
  // const wishlistState = useSelector((state) => state?.auth?.wishlist);
  const getListReview = async () => {
    const re = await getRatingsUser(getProductId);
    if (re && re.data) {
      setReviews(re.data.result);
    }
  };

  useEffect(() => {
    if (authState.user) {
      dispatch(getAProduct({ id: getProductId, isLogin: true }));
    } else {
      dispatch(getAProduct({ id: getProductId }));
    }
    dispatch(getUserCart());
    dispatch(getAllProducts());
    getListReview();
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

  const uploadCart = async () => {
    const hasColor = features.includes("color");
    const hasSize = features.includes("size");
  
    if (hasColor && hasSize && (!selectedColor || !selectedSize)) {
      toast.error("Vui lòng chọn cả màu và kích thước");
      return;
    }
  
    if (hasColor && !hasSize && !selectedColor) {
      toast.error("Vui lòng chọn màu sắc");
      return;
    }
  
    if (!hasColor && hasSize && !selectedSize) {
      toast.error("Vui lòng chọn kích thước");
      return;
    }
  
    if (quantity > getSelectedVariantStock()) {
      toast.error("Số lượng vượt quá tồn kho");
      return;
    }
  
    const productPayload = {
      _id: productState?._id,
      price: getSelectedVariantPriceValue(),
      quantity: +quantity,
    };
  
    if (hasColor) productPayload.color = selectedColor;
    if (hasSize) productPayload.size = selectedSize;
  
    try {
      await dispatch(addProdToCart({ product: productPayload })).unwrap(); // đợi xong thêm
      await dispatch(getUserCart()).unwrap(); // đảm bảo đã cập nhật giỏ hàng
      navigate("/cart");
    } catch (err) {
      toast.error("Thêm vào giỏ hàng thất bại");
    }
  };
  
  
  

  const getSelectedVariantPriceValue = () => {
    const variants = productState?.inventory?.productInventory?.productVariants;
    if (!variants || variants.length === 0) return 0;
  
    let matchedVariant;
  
    if (selectedColor && selectedSize) {
      matchedVariant = variants.find(
        (v) =>
          v.attributes.color === selectedColor &&
          v.attributes.size === selectedSize
      );
    } else if (selectedColor) {
      matchedVariant = variants.find(
        (v) => v.attributes.color === selectedColor
      );
    } else if (selectedSize) {
      matchedVariant = variants.find(
        (v) => v.attributes.size === selectedSize
      );
    }
  
    return matchedVariant?.sellPrice || 0;
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

  const wishlistState = useSelector((state) => state?.auth?.wishlist);
  const handleWishlistToggle = (productId) => {
    dispatch(addToWishlist({ _id: productId })).then(() => {
      dispatch(getuserProductWishlist());
    });
  };

  const isProductInWishlist = (productId) =>
    wishlistState?.some((item) => item._id === productId);

  const [hoveredProduct, setHoveredProduct] = useState(null);

  //--------------------------Xử lý màu sắc và size-----------------------------------------
  const variants = productState?.variants || [];
  const features = productState?.features || [];
  
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  
  // Tạo danh sách unique
  const allColors = Array.from(new Set(variants.map(v => v.attributes.color.name)));
  const allSizes = Array.from(new Set(variants.map(v => v.attributes.size.name)));
  
  // Tạo bản đồ kiểm tra
  const colorToSizes = {};
  const sizeToColors = {};
  
  variants.forEach(variant => {
    const color = variant.attributes.color.name;
    const size = variant.attributes.size.name;
  
    if (!colorToSizes[color]) colorToSizes[color] = new Set();
    if (!sizeToColors[size]) sizeToColors[size] = new Set();
  
    colorToSizes[color].add(size);
    sizeToColors[size].add(color);
  });
  

  useEffect(() => {
    if (productState?.category) {
      dispatch(getAProductCategory(productState.category));
    }
  }, [dispatch, productState?.category]);
  
  //------------tìm khoảng giá----------------
  const getPriceRange = () => {
    const variants = productState?.inventory?.productInventory?.productVariants;
    if (!variants || !Array.isArray(variants) || variants.length === 0) {
      return "Đang cập nhật giá";
    }
    
    const prices = variants.map(v => v.sellPrice);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
  
    return min === max
      ? `${min.toLocaleString("vi-VN")} ₫`
      : `${min.toLocaleString("vi-VN")} ₫ - ${max.toLocaleString("vi-VN")} ₫`;
  };
  

  const getSelectedVariantPrice = () => {
    const variants = productState?.inventory?.productInventory?.productVariants;
    if (!variants || !Array.isArray(variants) || variants.length === 0) {
      return "Đang cập nhật giá";
    }
  
    let matchedVariant;
  
    // Nếu có cả màu và size
    if (selectedColor && selectedSize) {
      matchedVariant = variants.find(
        (v) =>
          v.attributes.color === selectedColor &&
          v.attributes.size === selectedSize
      );
    }
    // Nếu chỉ có màu
    else if (selectedColor) {
      matchedVariant = variants.find(
        (v) => v.attributes.color === selectedColor
      );
    }
    // Nếu chỉ có size
    else if (selectedSize) {
      matchedVariant = variants.find(
        (v) => v.attributes.size === selectedSize
      );
    }
  
    if (matchedVariant && matchedVariant.sellPrice !== undefined) {
      return `${matchedVariant.sellPrice.toLocaleString("vi-VN")} ₫`;
    }
  
    // Trường hợp chưa chọn gì hoặc không khớp → trả về khoảng giá
    return getPriceRange();
  };
  

  const getSelectedVariantStock = () => {
    const inventory = productState?.inventory?.productInventory;
    const variants = inventory?.productVariants;
  
    // Nếu đã chọn cả màu và size → tìm đúng biến thể
    if (
      selectedColor &&
      selectedSize &&
      variants &&
      Array.isArray(variants)
    ) {
      const matchedVariant = variants.find(
        (v) =>
          v.attributes.color === selectedColor &&
          v.attributes.size === selectedSize
      );
  
      if (matchedVariant) {
        return matchedVariant.stock;
      }
    }
  
    // Nếu chưa chọn đủ → hiển thị tổng tồn kho
    return inventory?.totalQuantity ?? "Đang cập nhật";
  };
  
  

  //----------------tạo mảng ảnh------------------
  const colorImageMap = productState?.variants?.reduce((acc, variant) => {
    const colorName = variant.attributes.color.name;
    const imgUrl = variant.attributes.color.desc;
  
    // Tránh trùng lặp màu
    if (!acc[colorName]) {
      acc[colorName] = imgUrl;
    }
  
    return acc;
  }, {});

  const [currentImage, setCurrentImage] = useState(null); // ảnh chính từ màu

  const defaultImages = productState?.images || [];

  const colorImages = productState?.variants?.reduce((acc, variant) => {
    const colorName = variant.attributes?.color?.name;
    const colorUrl = variant.attributes?.color?.desc;
    if (colorUrl && !acc.find((i) => i.url === colorUrl)) {
      acc.push({ url: colorUrl, color: colorName });
    }
    return acc;
  }, []);
  
  const allThumbnails = [
    ...defaultImages.map((img) => ({ url: img, color: null })),
    ...(colorImages || []),
  ];
  
  
  return (
    <>
      <Meta title={"Product Name"} />
      <BreadCrumb title={productState?.name} />
      <Container class1="main-product-wrapper py-5 home-wrapper-2">
        <div className="row">
          <div className="col-12">
            <div className="product-wrapper-box flex flex-wrap gap-3 w-full">
              <div className="w-[16.666%]">
                <div className="other-product-images scrollable-thumbnails">
                {allThumbnails.map((item, index) => (
                  <div
                    key={index}
                    className={`image-thumbnail ${
                      item.url === currentImage ? "active-thumbnail" : ""
                    }`}
                    onClick={() => {
                      setCurrentImage(item.url);
                      setCurrentImageIndex(index);

                      if (item.color) {
                        setSelectedColor(item.color);
                        // Optionally reset size nếu size không hợp với màu mới
                        if (
                          selectedSize &&
                          !colorToSizes[item.color]?.has(selectedSize)
                        ) {
                          setSelectedSize(null);
                        }
                      }
                    }}
                  >
                    <img
                      src={item.url}
                      className="img-fluid thumbnail-img"
                      alt={`Thumbnail ${index + 1}`}
                    />
                  </div>
                ))}

                </div>
              </div>

              <div className="w-[33.333%]">
                <div className="main-product-image">
                  <div className="image-container">
                    {currentImage ? (
                      <img
                        src={currentImage}
                        alt="Main Product by Color"
                        className="img-fluid"
                      />
                    ) : productState?.images[currentImageIndex] ? (
                      <img
                        src={productState?.images[currentImageIndex]}
                        alt="Main Product"
                        className="img-fluid"
                      />
                    ) : null}

                    <button className="prev-button" onClick={() => {
                      setCurrentImageIndex(prev =>
                        prev === 0
                          ? productState.images.length - 1
                          : prev - 1
                      );
                      setCurrentImage(null);
                    }}>
                      &#10094;
                    </button>

                    <button className="next-button" onClick={() => {
                      setCurrentImageIndex(prev =>
                        prev === productState.images.length - 1
                          ? 0
                          : prev + 1
                      );
                      setCurrentImage(null);
                    }}>
                      &#10095;
                    </button>
                  </div>
                </div>
              </div>

              <div className="w-[47%]">
                <div className="main-product-details">
                  <div
                    className="d-flex align-items-center border-bottom"
                    style={{ gap: "10px" }}
                  >
                    <h2
                      className="title mb-0 d-flex align-items-center"
                      style={{ gap: "10px" }}
                    >
                      {productState?.name}
                      <div className="wishlist-icon">
                        <button
                          className="border-0 bg-transparent"
                          onClick={() => handleWishlistToggle(productState?._id)}
                        >
                          {isProductInWishlist(productState?._id) ? (
                            <AiFillHeart className="fs-5 text-danger" />
                          ) : (
                            <AiOutlineHeart className="fs-5" />
                          )}
                        </button>
                      </div>
                    </h2>
                  </div>

                  <div className="border-bottom py-3">
                  <div className="w-full bg-red-100 px-4 py-3 rounded-lg mb-4">
                    <p className="text-red-600 text-2xl font-bold m-0">
                      {getSelectedVariantPrice()}
                    </p>
                  </div>

                    <div className="d-flex align-items-center gap-10">
                      <ReactStars
                        count={+5}
                        size={24}
                        value={+productState?.totalrating?.toString()}
                        edit={false}
                        activeColor="#ffd700"
                      />
                      <p className="mb-0 t-review">
                        ( {productState?.quantityComments} Đánh giá )
                      </p>
                    </div>
                    <a className="review-btn" href="#review">
                      Viết đánh giá
                    </a>
                  </div>
                  <div className="py-3">
                    {/* <div className="d-flex gap-10 align-items-center my-2">
                      <h3 className="product-heading">Loại :</h3>
                      <p className="product-data">{productState?.category}</p>
                    </div> */}
                    <div className="d-flex gap-10 align-items-center my-2">
                      <h3 className="product-heading">Thương hiệu :</h3>
                      <p className="product-data">{productState?.brand}</p>
                    </div>
                    <div className="d-flex gap-10 align-items-center my-2">
                      <h3 className="product-heading">Danh mục :</h3>
                      <p className="product-data">{categoryName}</p>
                    </div>
                    <div className="d-flex gap-10 align-items-center my-2">
                      <h3 className="product-heading">Tags :</h3>
                      <p className="product-data">{productState?.tags}</p>
                    </div>
                    {features.includes("color") && (
                      <div className="mb-3">
                        <strong>Màu:</strong>
                        <div style={{ display: "flex", gap: "10px", marginTop: "5px" }}>
                          {allColors.map((colorCode, idx) => {
                            const isDisabled = selectedSize
                              ? !sizeToColors[selectedSize].has(colorCode)
                              : false;
                            const isSelected = selectedColor === colorCode;

                            return (
                              <div
                                key={idx}
                                onClick={() => {
                                  if (!isDisabled) {
                                    setSelectedColor(colorCode === selectedColor ? null : colorCode);
                                    setCurrentImage(
                                      colorImageMap[colorCode === selectedColor ? null : colorCode]
                                    );
                                  }
                                }}
                                style={{
                                  backgroundColor: colorCode,
                                  border: isSelected ? "2px solid black" : "1px solid #ccc",
                                  opacity: isDisabled ? 0.4 : 1,
                                  borderRadius: "50%",
                                  width: "24px",
                                  height: "24px",
                                  cursor: isDisabled ? "not-allowed" : "pointer",
                                }}
                              ></div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {features.includes("size") && (
                      <div className="mb-3">
                        <strong>Kích thước:</strong>
                        <div style={{ display: "flex", gap: "10px", marginTop: "5px" }}>
                          {allSizes.map((sizeName, idx) => {
                            const isDisabled = selectedColor
                              ? !colorToSizes[selectedColor]?.has(sizeName)
                              : false;
                            const isSelected = selectedSize === sizeName;

                            return (
                              <button
                                key={idx}
                                onClick={() => {
                                  if (!isDisabled) {
                                    setSelectedSize(sizeName === selectedSize ? null : sizeName);
                                  }
                                }}
                                style={{
                                  padding: "5px 10px",
                                  border: isSelected ? "2px solid black" : "1px solid #ccc",
                                  backgroundColor: isSelected ? "#000" : "#fff",
                                  color: isSelected ? "#fff" : "#000",
                                  opacity: isDisabled ? 0.4 : 1,
                                  cursor: isDisabled ? "not-allowed" : "pointer",
                                }}
                              >
                                {sizeName.toUpperCase()}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-14 my-3">
                      <h6 className="shrink-0 font-bold text-#000000-600">Số lượng:</h6>

                      <div className="-ms-2 flex items-center gap-5">
                        <div className="flex items-center border rounded overflow-hidden">
                          <button
                            onClick={() => {
                              if (quantity > 1) setQuantity(quantity - 1);
                            }}
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100"
                          >
                            <FaMinus />
                          </button>

                          <input
                            type="number"
                            value={quantity}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setQuantity(val);
                            }}
                            onBlur={() => {
                              if (quantity < 1) setQuantity(1);
                              else if (quantity > getSelectedVariantStock()) {
                                setQuantity(getSelectedVariantStock());
                                toast.error("Số lượng trong kho không đủ");
                              }
                            }}
                            className="w-16 text-center text-lg outline-none border-l border-r py-1"
                          />

                          <button
                            onClick={() => {
                              if (quantity < getSelectedVariantStock()) {
                                setQuantity(quantity + 1);
                              } else {
                                toast.error("Số lượng trong kho không đủ");
                              }
                            }}
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100"
                          >
                            <FaPlus />
                          </button>
                        </div>
                        <div>
                          <p className="text-blue-500">{getSelectedVariantStock()} sản phẩm có sẵn</p>
                        </div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="d-flex align-items-center">
                        <button
                          className="button border-0"
                          type="button"
                          onClick={() => {
                            if (alreadyAdded) {
                              navigate("/cart");      
                            } else {
                              uploadCart();
                            }
                          }}
                        >
                          {alreadyAdded ? "Sản phẩm vào giỏ hàng" : "Mua ngay"}
                        </button>
                      </div>
                    </div>

                    <div className="border-bottom d-flex align-items-center gap-15">
                      <div></div>
                    </div>

                    <div className="flex flex-col md:flex-row border-b py-1 text-sm">
                      <div className="flex cursor-pointer gap-1 p-3 items-center leading-none">
                        <FaRulerHorizontal className="text-sm" />
                        Kích thước
                      </div>
                      <div className="flex cursor-pointer gap-1 p-3 items-center leading-none">
                        <BsShield className="text-sm" />
                        Vận chuyển & trả hàng
                      </div>
                      <div className="flex cursor-pointer gap-1 p-3 items-center leading-none">
                        <IoColorPaletteOutline className="text-sm" />
                        Màu sắc
                      </div>
                      <div className="flex cursor-pointer gap-1 p-3 items-center leading-none">
                        <HiOutlineMail className="text-sm" />
                        Hỗ trợ
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between border-b py-1 text-sm">
                      <div className="flex flex-col md:flex-row">
                        <div className="flex cursor-pointer gap-1 p-3 items-center leading-none">
                          <FiHeart className="text-sm" />
                          Thêm vào yêu thích
                        </div>
                        <div className="flex cursor-pointer gap-1 p-3 items-center leading-none">
                          <FiLayers className="text-sm" />
                          So sánh
                        </div>
                      </div>
                      
                      <div className="flex cursor-pointer gap-1 p-3 items-center leading-none ml-auto">
                        <AiOutlineShareAlt className="text-sm" />
                        Share
                      </div>
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
          </div>
          
        </div>
      </Container>
      <Container class1="description-wrapper py-2 home-wrapper-2">
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
                      count={+5}
                      size={24}
                      value={+productState?.totalrating?.toString()}
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
                    count={+5}
                    size={24}
                    value={+0}
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
                {/* fix */}
                {reviews &&
                  reviews.map((item, index) => {
                    return (
                      <div className="review" key={index}>
                        <div className="d-flex gap-10 align-items-center">
                          {/* Hiển thị ảnh avatar */}
                          <img
                            src={item?.userId.avatar}
                            alt={`${item?.userId.name}'s avatar`}
                            className="rounded-circle"
                            style={{
                              width: "40px",
                              height: "40px",
                              objectFit: "cover",
                            }}
                          />
                          <h6 className="mb-0">{item?.userId.name}</h6>
                          <ReactStars
                            count={+5}
                            size={24}
                            value={+item?.rating}
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
      <Container class1="popular-wrapper py-3 home-wrapper-2">
        <div className="row">
          <div className="col-12">
            <h3 className="section-heading">Sản phẩm phổ biến</h3>
          </div>
        </div>
        <div className="row">
          <ProductCard data={popularProduct} />
        </div>
      </Container>

      <Container class1="related-wrapper py-3 home-wrapper-2">
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
