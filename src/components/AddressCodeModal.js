import React from "react";
import { Modal, Button } from "react-bootstrap";

const AddressListModal = ({
  show,
  handleClose,
  handleSelectAddress,
  data,
  setStateReceiptDefaultAddress,
}) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Danh sách địa chỉ</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {data?.length > 0 ? (
          data?.map((address) => {
            return (
              <div
                key={address.id}
                className="address-item p-3 mb-3 border rounded"
              >
                {address.isDefault ? <h1>Địa chỉ mặc định</h1> : <></>}
                <h5>Người nhận: {address.receiver}</h5>
                <p>Số điện thoại: {address.phone}</p>
                <p>Tỉnh/Thành phố: {address.province}</p>
                <p>Quận/Huyện: {address.districts}</p>
                <p>Phường/Xã: {address.wards}</p>
                <p>Địa chỉ chi tiết: {address.specific}</p>
                <Button
                  variant="primary"
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
                >
                  Chọn
                </Button>
              </div>
            );
          })
        ) : (
          <p>Không có địa chỉ nào được lưu!</p>
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
