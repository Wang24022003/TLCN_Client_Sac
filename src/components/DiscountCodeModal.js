import React from "react";
import { Modal, Button } from "react-bootstrap";
import { formatDate } from "../utils/dayConvert";

const DiscountCodeModal = ({ show, handleClose, handleSelectCode, data }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Chọn mã giảm giá</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {data?.couponsUser?.map((discount, index) => (
          <div key={index} className="discount-code">
            <h5>Code :{discount?.code}</h5>
            <p>Mô tả: {discount?.name}</p>
            <p>Có giá trị đến ngày {formatDate(discount?.couponExpired)}</p>
            <Button
              variant="success"
              onClick={() => handleSelectCode(discount)}
            >
              Chọn
            </Button>
          </div>
        ))}
      </Modal.Body>
    </Modal>
  );
};

export default DiscountCodeModal;
