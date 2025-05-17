import React from "react";
import { Modal, Button } from "react-bootstrap";
import { FaPlus, FaRegCheckCircle } from "react-icons/fa"; // Icon dấu cộng và icon địa chỉ mặc định

const AddressListModal = ({
  show,
  handleClose,
  handleSelectAddress,
  data,
  setStateReceiptDefaultAddress,
}) => {
  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Danh sách địa chỉ</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {data?.length > 0 ? (
          data?.map((address) => {
            return (
              <div
                key={address.id}
                className={`address-item p-4 mb-3 border rounded position-relative ${
                  address.isDefault ? "bg-light border-primary" : ""
                }`}
              >
                {address.isDefault && (
                  <div className="d-flex align-items-center mb-3">
                    <FaRegCheckCircle color="green" size={20} />
                    <span className="ms-2 text-success font-weight-bold">
                      Địa chỉ mặc định
                    </span>
                  </div>
                )}
                <h5 className="font-weight-bold">Người nhận: {address.receiver}</h5>
                <p>Số điện thoại: {address.phone}</p>
                <p>
                <strong>Địa chỉ: </strong> 
                  {`${address.specific}, ${address.wards}, ${address.districts}, ${address.province}`}
                </p>
                {/* Icon dấu cộng ở góc trên cùng bên phải */}
                <FaPlus
                  className="address-select-icon position-absolute"
                  style={{
                    top: "10px",
                    right: "10px",
                    fontSize: "24px",
                    border: "2px solid #888", // Màu xám mặc định
                    borderRadius: "50%",
                    padding: "5px",
                    cursor: "pointer",
                    color: "#888", // Màu xám mặc định
                    transition: "color 0.3s, border-color 0.3s", // Hiệu ứng chuyển màu mượt mà
                  }}
                  onClick={() => {
                    const {
                      _id,
                      receiver,
                      phone,
                      province,
                      districts,
                      specific,
                      wards,
                    } = address;
                    const data = {
                      _id,
                      receiver,
                      phone,
                      address,
                      province,
                      districts,
                      specific,
                      wards,
                      paymentMethod: "VNPay",
                    };
                    setStateReceiptDefaultAddress(data);
                    handleClose();
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = "red"; // Màu đỏ khi hover
                    e.target.style.borderColor = "red"; // Màu viền đỏ khi hover
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = "#888"; // Quay lại màu xám khi bỏ hover
                    e.target.style.borderColor = "#888"; // Quay lại màu viền xám khi bỏ hover
                  }}
                />
              </div>
            );
          })
        ) : (
          <p className="text-center">Không có địa chỉ nào được lưu!</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddressListModal;
