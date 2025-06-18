import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactStars from "react-rating-stars-component";
import { getUserReviews } from "../features/products/productSlilce";
import { useNavigate } from "react-router-dom";

const UserReviewsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userReviews, isLoading } = useSelector((state) => state.product);
  const { user } = useSelector((state) => state.auth);

  const [selectedRating, setSelectedRating] = useState(0); // ⭐ số sao cần lọc

  const myReviews = userReviews.filter(
    (review) => String(review?.userId?._id) === String(user?._id)
  );

  const filteredReviews = selectedRating
    ? myReviews.filter((r) => r.rating === selectedRating)
    : myReviews;

  useEffect(() => {
    if (user?._id) {
      dispatch(getUserReviews({ current: 1, pageSize: 100 }));
    }
  }, [dispatch, user]);

  return (
    <div className="container py-1">


      {/* ⭐ Bộ lọc số sao */}
      <div className="mb-4">
        <p className="mb-2">Lọc theo số sao:</p>
        <ReactStars
          count={5}
          value={selectedRating}
          onChange={(newRating) => setSelectedRating(newRating)}
          size={24}
          activeColor="#ffd700"
        />
        {selectedRating > 0 && (
          <button
            className="btn btn-sm btn-outline-secondary mt-2"
            onClick={() => setSelectedRating(0)}
          >
            Xóa lọc
          </button>
        )}
      </div>

      {/* Danh sách đánh giá */}
      {isLoading ? (
        <p>Đang tải đánh giá...</p>
      ) : filteredReviews.length === 0 ? (
        <p>Không có đánh giá nào phù hợp.</p>
      ) : (
        filteredReviews.map((review, index) => (
          <div
            key={index}
            className="mb-4 p-3 rounded shadow-sm"
            style={{
              background: "#f9f9f9",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            onClick={() => navigate(`/product/${review.productId}`)}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "#f1f1f1")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "#f9f9f9")
            }
          >
            <div className="d-flex gap-3 align-items-center mb-2">
              <img
                src={review?.userId?.avatar}
                alt="avatar"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
              <div>
                <strong>{review?.userId?.name}</strong>
                <ReactStars
                  count={5}
                  size={20}
                  value={review.rating}
                  edit={false}
                  activeColor="#ffd700"
                />
                <div className="text-muted" style={{ fontSize: "0.85rem" }}>
                  {new Date(review.createdAt).toLocaleString("vi-VN")}
                </div>
              </div>
            </div>
            <p>{review.comment}</p>

            {review?.fileUrl?.length > 0 && (
              <div className="d-flex gap-2 flex-wrap">
                {review.fileUrl.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`review-img-${i}`}
                    style={{
                      width: 100,
                      height: 100,
                      objectFit: "cover",
                      borderRadius: 6,
                      border: "1px solid #ccc",
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default UserReviewsPage;
