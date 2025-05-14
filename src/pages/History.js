import React, { useEffect, useState } from "react";
import Container from "../components/Container";
import { useDispatch, useSelector } from "react-redux";
import { getuserProductHistory } from "../features/user/userSlice";
import { useNavigate } from "react-router-dom";
import ReactStars from "react-rating-stars-component";

const History = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [hoveredProduct, setHoveredProduct] = useState(null);

  useEffect(() => {
    dispatch(getuserProductHistory());
  }, [dispatch]);

  const historyState = useSelector((state) => state?.auth?.history);

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

  return (
    <Container class1="wishlist-wrapper home-wrapper-2 py-5">
      <div className="row">
        {historyState && historyState.length === 0 && (
          <div className="text-center fs-3">No Data</div>
        )}

        {historyState &&
          historyState.map((item, index) => (
            <div
              className="col-lg-3 col-md-4 col-sm-6 my-3"
              key={index}
              onMouseEnter={() => setHoveredProduct(index)}
              onMouseLeave={() => setHoveredProduct(null)}
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
                        ? item.images[1]
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
                  <h6 className="brand">{item?.brand || "Không rõ thương hiệu"}</h6>
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
                        size={20}
                        value={+item?.rating || 0}
                        isHalf={true}
                        edit={false}
                        activeColor="#ffd700"
                      />
                    </div>
                    <div className="mt-1">
                      <span style={{ color: "red" }}>
                        {getPriceRangeFromVariants(item)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </Container>
  );
};

export default History;
