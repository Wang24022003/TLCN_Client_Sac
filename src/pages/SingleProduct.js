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
import { getRatingsUser, uploadImg } from "../utils/api";
import SizeSelect from "../components/SizeSelect";
import { getAProductCategory } from "../features/pcategory/pcategorySlice";
import { FiGift, FiHeart, FiLayers } from "react-icons/fi";
import { AiOutlineShareAlt } from "react-icons/ai";
import Dropzone from "react-dropzone";
import { LuImagePlus } from "react-icons/lu";
import { motion } from "framer-motion"



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
      matchedVariant = variants.find((v) => v.attributes.size === selectedSize);
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

  const addRatingToProduct = async () => {
    if (star === null) {
      toast.error("Vui lòng chọn số sao đánh giá");
      return;
    }
  
    if (!comment) {
      toast.error("Vui lòng nhập nhận xét");
      return;
    }
  
    let uploadedUrls = [];
  
    try {
      if (reviewImages.length > 0) {
        const uploads = await Promise.all(
          reviewImages.map((file) => uploadImg(file))
        );
        uploadedUrls = uploads.map((res) => res.data[0]); // mỗi upload trả về 1 URL
      }
  
      await dispatch(
        addRating({
          userId: authState.user._id,
          productId: productState._id,
          fileUrl: uploadedUrls,
          rating: +star,
          comment: comment,
        })
      ).unwrap();
  
      toast.success("Đánh giá đã được gửi");
  
      // Reset form
      setStar(null);
      setComment("");
      setReviewImages([]);
      setPreviewImages([]);
      getListReview(); // cập nhật danh sách đánh giá mới
    } catch (err) {
      toast.error("Lỗi khi gửi đánh giá");
    }
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
  if (productState?.category?._id) {
    const filteredProducts = productsState.filter((product) => {
      const productCategoryId =
        typeof product.category === "object"
          ? product.category._id
          : product.category;

      return (
        productCategoryId === productState.category._id &&
        product._id !== getProductId
      );
    });

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
  const allColors = Array.from(
    new Set(variants.map((v) => v.attributes.color.name))
  );
  const allSizes = Array.from(
    new Set(variants.map((v) => v.attributes.size.name))
  );

  // Tạo bản đồ kiểm tra
  const colorToSizes = {};
  const sizeToColors = {};

  variants.forEach((variant) => {
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

    const prices = variants.map((v) => v.sellPrice);
    const min = Math.min(...prices);
    const max = Math.max(...prices);

    return min === max
      ? `${min.toLocaleString("vi-VN")} ₫`
      : `${min.toLocaleString("vi-VN")} ₫ - ${max.toLocaleString("vi-VN")} ₫`;
  };

  const getSelectedVariantPrice = () => {
    const variants = productState?.inventory?.productInventory?.productVariants;
    if (!variants || !Array.isArray(variants) || variants.length === 0) {
      return { sellPrice: null, originalPrice: null };
    }
  
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
      matchedVariant = variants.find((v) => v.attributes.size === selectedSize);
    }
  
    if (matchedVariant) {
      const { sellPrice, importPrice, discount } = matchedVariant;
      const originalPrice = discount > 0
        ? Math.round(sellPrice / (1 - discount / 100))
        : sellPrice;
      return {
        sellPrice: sellPrice.toLocaleString("vi-VN") + " ₫",
        originalPrice:
          discount > 0 ? originalPrice.toLocaleString("vi-VN") + " ₫" : null,
          discount,
      };
    }
  
    return {
      sellPrice: getPriceRange(),
      originalPrice: null,
    };
  };
  

  const getSelectedVariantStock = () => {
    const inventory = productState?.inventory?.productInventory;
    const variants = inventory?.productVariants;

    // Nếu đã chọn cả màu và size → tìm đúng biến thể
    if (selectedColor && selectedSize && variants && Array.isArray(variants)) {
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

  
 
  const [reviewImages, setReviewImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [showUploadBox, setShowUploadBox] = useState(false);


  console.log("Rating value: ", productState?.rating);
  
const [showSizeImage, setShowSizeImage] = useState(false);

useEffect(() => {
  dispatch(getuserProductWishlist());
}, [dispatch]);

const [sameCategoryWishlist, setSameCategoryWishlist] = useState([]);

useEffect(() => {
  if (productState?.category && wishlistState?.length > 0) {
    const currentCategoryId =
      typeof productState.category === "object"
        ? productState.category._id
        : productState.category;

    const filtered = wishlistState.filter((item) => {
      const itemCategoryId =
        typeof item.category === "object" ? item.category._id : item.category;

      return (
        itemCategoryId === currentCategoryId && item._id !== productState._id
      );
    });

    setSameCategoryWishlist(filtered);
  }
}, [productState?.category, productState?._id, wishlistState]);

const [activeTab, setActiveTab] = useState("description");

const floatingIconVariants = {
  animate: {
    x: [0, -5, 0], // hoặc [0, 5, 0] cho icon phải
    transition: {
      repeat: Infinity,
      duration: 1.2,
      ease: "easeInOut",
    },
  },
};

  return (
    <>
      <Meta title={productState?.name} />
      <BreadCrumb title={productState?.name} />
      <Container class1="main-product-wrapper pt-5 home-wrapper-2">
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

                    <button
                      className="prev-button"
                      onClick={() => {
                        setCurrentImageIndex((prev) =>
                          prev === 0 ? productState.images.length - 1 : prev - 1
                        );
                        setCurrentImage(null);
                      }}
                    >
                      &#10094;
                    </button>

                    <button
                      className="next-button"
                      onClick={() => {
                        setCurrentImageIndex((prev) =>
                          prev === productState.images.length - 1 ? 0 : prev + 1
                        );
                        setCurrentImage(null);
                      }}
                    >
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
                          onClick={() =>
                            handleWishlistToggle(productState?._id)
                          }
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
                    {(() => {
                      const { sellPrice, originalPrice, discount } = getSelectedVariantPrice();
                      return (
                        <div
                          className="d-flex align-items-center gap-3"
                          style={{ flexWrap: "wrap" }}
                        >
                          <span className="text-red-600 fw-bold fs-4">{sellPrice}</span>

                          {originalPrice && (
                            <span
                              style={{
                                textDecoration: "line-through",
                                fontSize: "16px",
                                color: "#888",
                              }}
                            >
                              {originalPrice}
                            </span>
                          )}

                          {discount > 0 && (
                            <span
                              style={{
                                backgroundColor: "#fdecea", // nền đỏ nhạt
                                color: "#e53935",           // chữ đỏ
                                padding: "2px 6px",
                                borderRadius: "4px",
                                fontWeight: "bold",
                                fontSize: "14px",
                              }}
                            >
                              -{discount}%
                            </span>
                          )}
                        </div>
                      );
                    })()}
                    </div>
                    <div className="d-flex align-items-center gap-10">
                    {productState?.rating !== undefined && (
                      <ReactStars
                        count={5}
                        size={24}
                        value={Number(productState.rating)}
                        isHalf={true}
                        edit={false}
                        activeColor="#ffd700"
                      />
                    )}
                    <span className="text-muted">
                      {productState?.rating?.toFixed(1)} / 5
                    </span>
                      <p className="mb-0 t-review">
                        ( {productState?.quantityComments} Đánh giá )
                      </p>
                      <a className="text-dark text-decoration-underline ms-3" href="#review">
                        Viết đánh giá
                      </a>
                    </div>
                    
                  </div>
                  <div className="py-3">
                    <div className="d-flex gap-30 align-items-center my-2">
                      <div className="d-flex gap-10 align-items-center">
                        <h3 className="product-heading">Mã sản phẩm:</h3>
                        <p className="product-data">{productState?.code}</p>
                      </div>
                      <div className="d-flex gap-10 align-items-center">
                        <h3 className="product-heading">Thương hiệu:</h3>
                        <p className="product-data">{productState?.brand}</p>
                      </div>
                    </div>

                    {/* Ưu đãi khuyến mãi */}
                    <div
                      style={{
                        border: "2px dashed red",
                        padding: "16px",
                        borderRadius: "8px",
                        marginBottom: "16px",
                        backgroundColor: "#fff5f5",
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <FiGift style={{ color: "red", fontSize: "20px" }} />
                        <strong style={{ color: "red", fontSize: "16px" }}>ƯU ĐÃI</strong>
                      </div>
                      <ul style={{ marginBottom: 0, paddingLeft: "20px", color: "#333", fontSize: "15px" }}>
                        <li>Freeship cho đơn hàng từ 1000K</li>
                        <li>
                          Hỗ trợ đổi hàng trong vòng 7 ngày từ lúc nhận hàng (Không áp dụng cho hàng khuyến mãi trên 10%)
                        </li>
                        <li>Và thêm các mã khuyến mãi bên dưới</li>
                      </ul>
                    </div>

                    {/* <div className="d-flex gap-10 align-items-center my-2">
                      <h3 className="product-heading">Danh mục :</h3>
                      <p className="product-data">
                        {productState?.category?.name || categoryName}
                      </p>
                    </div>
                    <div className="d-flex gap-10 align-items-center my-2">
                      <h3 className="product-heading">Tags :</h3>
                      <p className="product-data">{productState?.tags}</p>
                    </div> */}
                    {features.includes("color") && (
                      <div className="mb-3">
                        <strong>Màu:</strong>
                        <div
                          style={{
                            display: "flex",
                            gap: "10px",
                            marginTop: "5px",
                          }}
                        >
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
                                    setSelectedColor(
                                      colorCode === selectedColor
                                        ? null
                                        : colorCode
                                    );
                                    setCurrentImage(
                                      colorImageMap[
                                        colorCode === selectedColor
                                          ? null
                                          : colorCode
                                      ]
                                    );
                                  }
                                }}
                                style={{
                                  backgroundColor: colorCode,
                                  border: isSelected
                                    ? "2px solid black"
                                    : "1px solid #ccc",
                                  opacity: isDisabled ? 0.4 : 1,
                                  borderRadius: "50%",
                                  width: "24px",
                                  height: "24px",
                                  cursor: isDisabled
                                    ? "not-allowed"
                                    : "pointer",
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
                        <div
                          style={{
                            display: "flex",
                            gap: "10px",
                            marginTop: "5px",
                          }}
                        >
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
                                    setSelectedSize(
                                      sizeName === selectedSize
                                        ? null
                                        : sizeName
                                    );
                                  }
                                }}
                                style={{
                                  padding: "5px 10px",
                                  border: isSelected
                                    ? "2px solid black"
                                    : "1px solid #ccc",
                                  backgroundColor: isSelected ? "#000" : "#fff",
                                  color: isSelected ? "#fff" : "#000",
                                  opacity: isDisabled ? 0.4 : 1,
                                  cursor: isDisabled
                                    ? "not-allowed"
                                    : "pointer",
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
                      <h6 className="shrink-0 font-bold text-#000000-600">
                        Số lượng:
                      </h6>

                      <div className="-ms-2 flex items-center gap-5">
                        <div className="flex items-center border rounded overflow-hidden">
                          <button
                            onClick={() => {
                              if (quantity > 1) setQuantity(quantity - 1);
                            }}
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100"
                          >
                            <FaMinus style={{ opacity: 0.5 }}/>
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
                            <FaPlus style={{ opacity: 0.5 }}/>
                          </button>
                        </div>
                        <div>
                          <p className="text-blue-500">
                            {getSelectedVariantStock()} sản phẩm có sẵn
                          </p>
                        </div>
                      </div>
                    </div>
                    {getSelectedVariantStock() < 100 ? (
                      <div className="mt-5">
                        <p>
                          Nhanh lên! Chỉ còn{" "}
                          <span className="text-lg px-2 text-red-500">
                            {getSelectedVariantStock()}
                          </span>{" "}
                          sản phẩm
                        </p>
                        <div
                          className={`h-1 mt-2 relative before:content-[''] overflow-hidden bg-gray-200 rounded-full`}
                        >
                          <span
                            style={{ width: `${getSelectedVariantStock()}%` }}
                            className="h-1 bg-red-400 absolute top-0 left-0 bottom-0"
                          ></span>
                        </div>
                      </div>
                    ) : null}

                    <div className="mt-4 mb-3 d-flex align-items-center gap-2">
                      {/* Nút đầu tiên (Mua ngay / Sản phẩm vào giỏ hàng / Hết hàng) */}
                      {getSelectedVariantStock() === 0 ? (
                        <button
                          className="button border-0"
                          disabled
                          style={{
                            backgroundColor: "red",
                            color: "white",
                            cursor: "not-allowed",
                          }}
                        >
                          Hết hàng
                        </button>
                      ) : (
                        <button
                          className="btn-order-submit"
                          type="button"
                          onClick={() => {
                            if (alreadyAdded) {
                              navigate("/cart");
                            } else {
                              uploadCart();
                            }
                          }}
                        >
                          <div className="btn-inner-order d-flex align-items-center justify-content-center position-relative">
                            <img
                              src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748925264/icon-left_zd68q2.png"
                              alt="left"
                              className="btn-icon-order icon-left-order"
                            />
                            <span className="btn-text-order">
                              {alreadyAdded ? "Sản phẩm vào giỏ hàng" : "Mua ngay"}
                            </span>
                            <img
                              src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748925445/icon-right_s7mrvo.png"
                              alt="right"
                              className="btn-icon-order icon-right-order"
                            />
                          </div>
                        </button>

                      )}

                      {/* Nút thêm vào giỏ hàng */}
                      <button onClick={async () => {
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
                            await dispatch(addProdToCart({ product: productPayload })).unwrap();
                            await dispatch(getUserCart()).unwrap();
                          } catch (err) {}
                        }}
                        className="gold-toggle-btn-sp"
                      >
                        <div className="btn-inner d-flex align-items-center justify-content-center position-relative">
                          <img
                            src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748925264/icon-left_zd68q2.png"
                            alt="left"
                            className="btn-icon icon-left"
                          />
                          <span className="btn-text">Thêm vào giỏ hàng</span>
                          <img
                            src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748925445/icon-right_s7mrvo.png"
                            alt="right"
                            className="btn-icon icon-right"
                          />
                        </div>
                      </button>

                    </div>


                    <div className="border-bottom d-flex align-items-center gap-15">
                      <div></div>
                    </div>

                    <div className="flex flex-col md:flex-row border-b py-1 text-sm">
                      <div
                        className="flex cursor-pointer gap-1 p-3 items-center leading-none"
                        onClick={() => setShowSizeImage(true)}
                      >
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
                    {showSizeImage && (
                      <div
                    className="fixed inset-0 flex items-center justify-center z-50"
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
                        onClick={() => setShowSizeImage(false)} // Click nền thì đóng
                      >
                        <div
                          className="bg-white rounded-lg max-w-[90%] max-h-[90%] p-2"
                          onClick={(e) => e.stopPropagation()} // Ngăn đóng khi click vào ảnh
                        >
                          <img
                            src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748927097/size_k4s5rt.png"
                            alt="Kích thước"
                            className="max-w-full max-h-[80vh] object-contain"
                          />
                        </div>
                      </div>
                    )}
                    <div className="flex flex-col md:flex-row justify-between border-b py-1 text-sm">
                      <div className="flex flex-col md:flex-row">
                        <div className="flex cursor-pointer gap-1 p-3 items-center leading-none"
                          onClick={() => handleWishlistToggle(productState?._id)}
                        >
                          {isProductInWishlist(productState?._id) ? (
                            <>
                              <AiFillHeart className="text-red-500 text-sm" />
                              Đã yêu thích
                            </>
                          ) : (
                            <>
                              <FiHeart className="text-sm" />
                              Thêm vào yêu thích
                            </>
                          )}
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
                      <h3 className="product-heading">
                        Vận chuyển & Đổi trả :
                      </h3>
                      <p className="product-data">
                        Miễn phí vận chuyển và đổi trả cho tất cả các đơn hàng!{" "}
                        <br /> Chúng tôi sẽ giao tất cả các đơn hàng nội địa
                        Việt Nam trong vòng
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

<Container class1="home-wrapper-2  p-4 rounded-md">
  {/* Phần nút chọn tab với icon trái/phải */}
  <div className="flex items-center justify-center my-4 gap-3">
    <img
      src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748925086/Left_niuqcd.png"
      alt="Left Icon"
      className="w-48 h-15 object-contain"
    />

    <div className="relative flex w-fit border border-gray-300 rounded-md overflow-hidden text-base font-medium h-16">
      {/* Nền trượt */}
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`absolute top-0 bottom-0 w-1/2  z-0 ${
          activeTab === "reviews" ? "left-1/2" : "left-0"
        }`}
        style={{
        background: 'radial-gradient(circle, rgba(0, 82, 72, 1) 0%, rgba(0, 46, 39, 1) 66%, rgba(0, 0, 0, 1) 100%)'
      }}
      />

      {/* Nút Mô tả */}
      <button
        onClick={() => setActiveTab("description")}
        className={`text-2xl relative z-10 min-w-[12rem] flex items-center justify-evenly gap-2 transition-colors duration-200 ${
          activeTab === "description" ? "text-white" : "text-black"
        }`}
      >
        {activeTab === "description" && (
          <motion.img
            src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748925264/icon-left_zd68q2.png"
            alt="icon"
            className="w-10 h-10 object-contain"
            variants={floatingIconVariants}
            animate="animate"
          />
        )}
        Mô tả
        {activeTab === "description" && (
          <motion.img
            src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748925445/icon-right_s7mrvo.png"
            alt="icon"
            className="w-10 h-10 object-contain"
            variants={{
              animate: {
                x: [0, 5, 0],
                transition: {
                  repeat: Infinity,
                  duration: 1.2,
                  ease: "easeInOut",
                },
              },
            }}
            animate="animate"
          />
        )}
      </button>

      {/* Đường ngăn */}
      <div className="w-px bg-gray-300 z-10" />

      {/* Nút Đánh giá */}
      <button
        onClick={() => setActiveTab("reviews")}
        className={`text-2xl relative z-10 min-w-[12rem] flex items-center justify-evenly gap-2 transition-colors duration-200 ${
          activeTab === "reviews" ? "text-white" : "text-black"
        }`}
      >
        {activeTab === "reviews" && (
          <motion.img
            src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748925264/icon-left_zd68q2.png"
            alt="icon"
            className="w-10 h-10 object-contain"
            variants={floatingIconVariants}
            animate="animate"
          />
        )}
        Đánh giá
        {activeTab === "reviews" && (
          <motion.img
            src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748925445/icon-right_s7mrvo.png"
            alt="icon"
            className="w-10 h-10 object-contain"
            variants={{
              animate: {
                x: [0, 5, 0],
                transition: {
                  repeat: Infinity,
                  duration: 1.2,
                  ease: "easeInOut",
                },
              },
            }}
            animate="animate"
          />
        )}
      </button>
    </div>

    <img
      src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748924911/Right_hes5y0.png"
      alt="Right Icon"
      className="w-48 h-15 object-contain"
    />
  </div>

  {/* Phần nội dung tương ứng tab */}
  {activeTab === "description" && (
    <div className="description-wrapper py-2 home-wrapper-2">
      <div className="row">
          <div className="col-12">
            <div className="bg-white p-3">
              <p
                dangerouslySetInnerHTML={{ __html: productState?.description }}
              ></p>
            </div>
          </div>
        </div>
    </div>
  )}

  {activeTab === "reviews" && (
    <div className="reviews-wrapper py-2 home-wrapper-2">
      <div className="row">
          <div className="col-12">
   
            <div className="review-inner-wrapper">
              <div className="review-head d-flex justify-content-between align-items-end">
                <div>
                  <h4 className="mb-2">Đánh giá của khách hàng</h4>
                  <div className="d-flex align-items-center gap-10">
                  {productState?.rating !== undefined && (
                    <ReactStars
                      count={5}
                      size={24}
                      value={Number(productState.rating)}
                      isHalf={true}
                      edit={false}
                      activeColor="#ffd700"
                    />
                  )}
                    <span className="text-muted">
                        {productState?.rating?.toFixed(1)} / 5
                      </span>
                    <p className="mb-0">
                      Dựa trên {productState?.quantityComments} đánh giá
                    </p>
                  </div>
                </div>

                {orderedProduct && (
                  <div>
                    <a className="text-dark text-decoration-underline" href="#review">
                      Viết đánh giá
                    </a>
                  </div>
                )}
              </div>

              {/* FORM đánh giá */}
              <div className="review-form py-4">
                <h4>Viết đánh giá</h4>

                <div>
                  <ReactStars
                    count={+5}
                    size={24}
                    value={star || 0}
                    edit={true}
                    activeColor="#ffd700"
                    onChange={(e) => {
                      setStar(e);
                      setShowUploadBox(true);
                    }}
                  />
                </div>

                <div>
                <textarea
                  className="w-100 form-control"
                  cols="30"
                  rows="4"
                  placeholder="Nội dung..."
                   value={comment || ""}
                  onChange={(e) => {
                    setComment(e.target.value);
                    if (e.target.value.trim() !== "") {
                      setShowUploadBox(true); // 👈 Hiển thị upload khi bắt đầu nhập
                    }
                  }}
                ></textarea>

                </div>
                {showUploadBox && (
                  <div
                    style={{
                      backgroundColor: "#fff",
                      padding: "20px",
                      borderRadius: "8px",
                      marginTop: "16px",
                    }}
                  >
                    <Dropzone
                      onDrop={(acceptedFiles) => {
                        setReviewImages(acceptedFiles);
                        setPreviewImages(acceptedFiles.map((file) => URL.createObjectURL(file)));
                      }}
                      accept={{ "image/*": [] }}
                      multiple
                    >
                      {({ getRootProps, getInputProps }) => (
                        <div
                          {...getRootProps()}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "16px",
                            border: "2px dashed #ccc",
                            borderRadius: "8px",
                            cursor: "pointer",
                            transition: "border-color 0.3s ease",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#3b82f6")}
                          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#ccc")}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <LuImagePlus size={24} color="#3b82f6" />
                            <p style={{ color: "#4B5563", fontSize: "14px", margin: "0" }}>
                              Upload hoặc kéo ảnh vào đây
                            </p>
                          </div>
                          <p style={{ color: "#9CA3AF", fontSize: "14px", margin: "0" }}>
                            JPEG, PNG, GIF...
                          </p>
                          <input {...getInputProps()} />
                        </div>
                      )}
                    </Dropzone>
                  </div>
                )}

                {previewImages.length > 0 && (
                  <div className="d-flex mt-2 flex-wrap gap-2 justify-content-start">
                    {previewImages.map((src, idx) => (
                      <img
                        key={idx}
                        src={src}
                        alt={`preview-${idx}`}
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "cover",
                          borderRadius: "4px",
                          border: "1px solid #ccc",
                        }}
                      />
                    ))}
                  </div>
                )}

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

              {/* Hiển thị danh sách đánh giá */}
              <div className="reviews mt-4">
                {reviews &&
                  reviews.map((item, index) => (
                    <div className="review my-4" key={index}>
                      <div className="d-flex gap-10 align-items-center">
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
                        <div>
                          <h6 className="mb-0">{item?.userId.name}</h6>
                          {item?.createdAt && (
                            <small className="text-muted">
                              {new Date(item.createdAt).toLocaleString("vi-VN", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </small>
                          )}
                        </div>
                        <ReactStars
                          count={+5}
                          size={24}
                          value={+item?.rating}
                          edit={false}
                          activeColor="#ffd700"
                        />
                      </div>
                      <p className="mt-3">{item?.comment}</p>
                      {item?.fileUrl?.length > 0 && (
                        <div className="d-flex gap-2 flex-wrap mt-2 justify-content-start">
                          {item.fileUrl.map((img, i) => (
                            <img
                              key={i}
                              src={img}
                              alt="Đánh giá"
                              style={{
                                width: "100px",
                                height: "100px",
                                objectFit: "cover",
                                borderRadius: "4px",
                                border: "1px solid #ccc",
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
    </div>
  )}
</Container>




    {sameCategoryWishlist.length > 0 && (
      <Container class1="related-wrapper py-2 home-wrapper-2">
        <div className="row">
          <div className="col-12 flex items-center justify-center ">
            {/* Ảnh bên trái */}
            <img src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748925086/Left_niuqcd.png" alt="left icon" className="w-48 h-15 object-contain" />

            {/* Tiêu đề căn giữa */}
            <h3 className="section-heading text-center m-0">Sản phẩm yêu thích liên quan</h3>

            {/* Ảnh bên phải */}
            <img src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748924911/Right_hes5y0.png" alt="right icon" className="w-48 h-15 object-contain" />
          </div>
        </div>
        <div className="row">
          <ProductCard data={sameCategoryWishlist} />
        </div>
      </Container>
    )}



      <Container class1="related-wrapper py-2 home-wrapper-2">
        <div className="row">
          <div className="col-12 flex items-center justify-center ">
            {/* Ảnh bên trái */}
            <img src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748925086/Left_niuqcd.png" alt="left icon" className="w-48 h-15 object-contain" />

            {/* Tiêu đề căn giữa */}
            <h3 className="section-heading text-center m-0">Sản phẩm cùng thương hiệu</h3>

            {/* Ảnh bên phải */}
            <img src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748924911/Right_hes5y0.png" alt="right icon" className="w-48 h-15 object-contain" />
          </div>
        </div>
        <div className="row">
          <ProductCard data={relatedByBrand} />
        </div>
      </Container>
      <Container class1="related-wrapper py-2 home-wrapper-2">
        <div className="row">
          <div className="col-12 flex items-center justify-center ">
            {/* Ảnh bên trái */}
            <img src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748925086/Left_niuqcd.png" alt="left icon" className="w-48 h-15 object-contain" />

            {/* Tiêu đề căn giữa */}
            <h3 className="section-heading text-center m-0">Sản phẩm liên quan</h3>

            {/* Ảnh bên phải */}
            <img src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748924911/Right_hes5y0.png" alt="right icon" className="w-48 h-15 object-contain" />
          </div>
        </div>
        <div className="row">
          <ProductCard data={relatedProducts} />
        </div>
      </Container>
      <Container class1="popular-wrapper py-2 home-wrapper-2">
        <div className="row">
          <div className="col-12 flex items-center justify-center ">
            {/* Ảnh bên trái */}
            <img src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748925086/Left_niuqcd.png" alt="left icon" className="w-48 h-15 object-contain" />

            {/* Tiêu đề căn giữa */}
            <h3 className="section-heading text-center m-0">Sản phẩm phổ biến</h3>

            {/* Ảnh bên phải */}
            <img src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748924911/Right_hes5y0.png" alt="right icon" className="w-48 h-15 object-contain" />
          </div>
        </div>
        <div className="row">
          <ProductCard data={popularProduct} />
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
