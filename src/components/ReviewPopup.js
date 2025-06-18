import React, { useState } from "react";
import ReactStars from "react-rating-stars-component";
import Dropzone from "react-dropzone";
import { LuImagePlus } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { addRating } from "../features/products/productSlilce";
import { uploadImg } from "../utils/api";
import { toast } from "react-toastify";
import "../Css/CssSingleProduct.css"; // nếu bạn cần giữ style như SingleProduct

const ReviewPopup = ({ productId, onClose }) => {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  const [star, setStar] = useState(null);
  const [comment, setComment] = useState("");
  const [reviewImages, setReviewImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [showUploadBox, setShowUploadBox] = useState(false);

  const addRatingToProduct = async () => {
    if (star === null) {
      toast.error("Vui lòng chọn số sao đánh giá");
      return;
    }
    if (!comment.trim()) {
      toast.error("Vui lòng nhập nội dung");
      return;
    }

    try {
      let uploadedUrls = [];
      if (reviewImages.length > 0) {
        const uploads = await Promise.all(
          reviewImages.map((file) => uploadImg(file))
        );
        uploadedUrls = uploads.map((res) => res.data[0]);
      }

      await dispatch(
        addRating({
          userId: authState.user._id,
          productId,
          fileUrl: uploadedUrls,
          rating: +star,
          comment,
        })
      ).unwrap();

      toast.success("Đánh giá đã được gửi");
      onClose(); // đóng popup
    } catch (err) {
      toast.error("Lỗi khi gửi đánh giá");
    }
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <h4 className="text-xl font-semibold text-center mb-3">Viết đánh giá</h4>


        <ReactStars
          count={5}
          size={24}
          value={star || 0}
          edit={true}
          activeColor="#ffd700"
          onChange={(e) => {
            setStar(e);
            setShowUploadBox(true);
          }}
        />

        <textarea
          className="w-100 form-control mt-3"
          rows="4"
          placeholder="Nội dung..."
          value={comment}
          onChange={(e) => {
            setComment(e.target.value);
            if (e.target.value.trim() !== "") {
              setShowUploadBox(true);
            }
          }}
        ></textarea>

        {showUploadBox && (
          <div className="mt-3">
            <Dropzone
              onDrop={(acceptedFiles) => {
                setReviewImages(acceptedFiles);
                setPreviewImages(
                  acceptedFiles.map((file) => URL.createObjectURL(file))
                );
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
                    marginTop: "16px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <LuImagePlus size={24} color="#3b82f6" />
                    <p style={{ margin: 0 }}>Upload hoặc kéo ảnh vào đây</p>
                  </div>
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

        <div className="d-flex justify-content-end align-items-center gap-2 mt-3">
          <button className="btn btn-secondary px-4 py-2" style={{ width: "180px" }} onClick={onClose}>
            Hủy
          </button>

          <div className="gold-toggle-btn2" onClick={addRatingToProduct}>
            <div className="btn-inner">
              <span className="btn-text">Gửi đánh giá</span>

              <img
                src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748925264/icon-left_zd68q2.png"
                alt="icon-left"
                className="btn-icon icon-left"
              />
              <img
                src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1748925445/icon-right_s7mrvo.png"
                alt="icon-right"
                className="btn-icon icon-right"
              />
            </div>
          </div>
        </div>


      </div>
    </div>
  );
};

export default ReviewPopup;
