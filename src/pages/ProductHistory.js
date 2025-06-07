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
import ReactStars from "react-rating-stars-component";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";


const ProductHistory = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    getWishlistFromDb();
  }, []);
  const getWishlistFromDb = () => {
    dispatch(getProductUserRecentView());
    dispatch(getuserProductWishlist());
  };

  const navigate = useNavigate();
  const wishlist = useSelector((state) => state?.auth?.wishlist);

  const wishlistState = useSelector((state) => state?.auth?.recentView || []);

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

  const isProductInWishlist = (productId) =>
    wishlist?.some((item) => item._id === productId);  

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

  const [hoveredProduct, setHoveredProduct] = useState(null);


  const [selectedFilter, setSelectedFilter] = useState("all");

//------------Lọc dữ liệu theo time----------------------------
const filterOptions = [
  { label: "Tất cả", value: "all" },
  { label: "Hôm nay", value: "today" },
  { label: "7 ngày qua", value: "last7days" },
  { label: "30 ngày qua", value: "last30days" },
];

const filterByTime = (list = []) => {
  if (!Array.isArray(list)) return [];
  if (selectedFilter === "all") return list;

  const now = new Date();
  return list.filter((item) => {
    const viewTime = new Date(item?.timeView);
    if (!item?.timeView) return false;

    if (selectedFilter === "today") {
      return viewTime.toDateString() === now.toDateString();
    } else if (selectedFilter === "last7days") {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(now.getDate() - 7);
      return viewTime >= sevenDaysAgo;
    } else if (selectedFilter === "last30days") {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(now.getDate() - 30);
      return viewTime >= thirtyDaysAgo;
    }

    return true;
  });
};

const filteredWishlist = filterByTime(wishlistState);
// const chartData = getChartData(filteredWishlist);

// const getChartData = (data) => {
//   const grouped = {};

//   data.forEach((item) => {
//     if (!item.timeView) return;
//     const dateKey = new Date(item.timeView).toLocaleDateString("vi-VN");
//     grouped[dateKey] = (grouped[dateKey] || 0) + 1;
//   });

//   return Object.entries(grouped)
//     .map(([date, count]) => ({ date, count }))
//     .sort((a, b) => new Date(a.date) - new Date(b.date));
// };


const sortedWishlist = [...filteredWishlist].sort((a, b) => new Date(b.timeView) - new Date(a.timeView));


  return (
    <>
      <Container class1="wishlist-wrapper home-wrapper-2 py-5">
        <div className="row">
        <div className="col-12 mb-4">
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
            <select
              className="form-select w-auto"
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
            >
              {filterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* <div style={{ width: "400px", minWidth: "300px" }} className="bg-white p-2 rounded shadow-sm">
              <h6 className="text-center mb-2" style={{ fontSize: "14px" }}>
                Biểu đồ lượt xem
              </h6>
              {chartData.length === 0 ? (
                <p className="text-muted text-center mb-0" style={{ fontSize: "13px" }}>Không có dữ liệu</p>
              ) : (
                <ResponsiveContainer width="100%" height={150}>
                  <BarChart data={chartData}>
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                    <YAxis allowDecimals={false} hide />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#f8f9fa", border: "1px solid #ccc" }}
                      formatter={(value) => [`${value} lượt xem`, "Số lượng"]}
                      labelFormatter={(label) => `Ngày: ${label}`}
                    />
                    <Bar dataKey="count" fill="#002E27" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div> */}
          </div>
        </div>

          {wishlistState && wishlistState.length === 0 && (
            <div className="text-center fs-3">No Data</div>
          )}
          {filteredWishlist && filteredWishlist.length === 0 && (
            <div className="text-center fs-3">Không có sản phẩm phù hợp</div>
          )}
          {sortedWishlist  &&
            sortedWishlist?.map((item, index) => {

              return (
                <div className="col-lg-3 col-md-4 col-sm-6 my-3" key={index}
                  onMouseEnter={() => setHoveredProduct(index)} // Khi hover, lưu chỉ số sản phẩm
                  onMouseLeave={() => setHoveredProduct(null)} // Khi rời chuột, reset trạng thái
                  >
                  <div className="product-card position-relative"
                    style={{ cursor: "pointer" }}
                  >
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

                    <div className="product-details" style={{ padding: "15px" }}>
                        
                      <h6 className="brand">{item?.brand || "No brand"}</h6>
                      <h5 className="product-title">
                        {item?.name?.length > 35 ? item.name.substr(0, 35) + "..." : item?.name}
                      </h5>
                      <p className="view-time text-muted" style={{ fontSize: "12px" }}>
                          Đã xem lúc: {item?.timeView ? new Date(item.timeView).toLocaleString("vi-VN") : "Không rõ thời gian"}
                      </p>

                      {/* Hover details */}
                      <div
                        className={`hover-details ${
                          hoveredProduct === index ? "hovered" : ""
                        }`}
                        style={{
                          opacity: hoveredProduct === index ? 1 : 0,
                          visibility: hoveredProduct === index ? "visible" : "hidden",
                          transition: "opacity 0.3s ease, visibility 0.3s ease",
                        }}
                      >
                        <div className="d-flex align-items-center">
                          <ReactStars
                            count={5}
                            size={20}
                            value={+item?.rating || 0}
                            isHalf={true}
                            edit={false}
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
                        <p className="price" style={{ color: 'red' }}>{getPriceRangeFromVariants(item)}</p>
                        
                      </div>
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
