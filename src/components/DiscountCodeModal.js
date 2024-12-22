import React from "react";
import { Modal, Button } from "react-bootstrap";
import { FaCheckCircle } from "react-icons/fa"; // Thêm icon dấu check
import { formatDate } from "../utils/dayConvert";

const DiscountCodeModal = ({ show, handleClose, handleSelectCode, data }) => {
  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Chọn mã giảm giá</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {data?.couponsUser?.length > 0 ? (
          data.couponsUser.map((discount, index) => (
            <div
              key={index}
              className="discount-code d-flex align-items-center p-3 mb-3 border rounded shadow-sm"
              style={{
                backgroundColor: "#f9f9f9",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
            >
              {/* Ảnh phía trước */}
              <div
                className="discount-image d-flex justify-content-center align-items-center text-white text-uppercase"
                style={{
                  minWidth: "80px",
                  height: "80px",
                  backgroundColor: "#dc3545", // Màu nền đỏ
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "bold",
                  marginRight: "16px",
                }}
              >
                {discount?.code}
              </div>

              {/* Thông tin mã giảm giá */}
              <div className="discount-info flex-grow-1">
                <h5 className="font-weight-bold text-primary">
                  {discount?.name}
                </h5>
                <p>
                  <strong>Hạn sử dụng:</strong> {formatDate(discount?.couponExpired)}
                </p>
              </div>

              {/* Nút chọn */}
              <Button
                variant="success"
                onClick={() => handleSelectCode(discount)}
                className="d-flex align-items-center"
                style={{
                  borderRadius: "50px",
                  padding: "8px 20px",
                  fontSize: "14px",
                }}
              >
                <FaCheckCircle style={{ marginRight: "8px" }} />
                Chọn
              </Button>
            </div>
          ))
        ) : (
          <p className="text-center">Không có mã giảm giá nào.</p>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default DiscountCodeModal;
