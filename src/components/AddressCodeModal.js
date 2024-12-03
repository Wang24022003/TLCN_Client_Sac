import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const AddressListModal = ({ show, handleClose, handleSelectAddress }) => {
  // Danh sách địa chỉ mẫu
  const addresses = [
    {
      id: 1,
      name: 'Nguyễn Văn A',
      phone: '0123456789',
      address: '123 Đường ABC, Phường XYZ, Quận 1, TP. Hồ Chí Minh',
    },
    {
      id: 2,
      name: 'Trần Thị B',
      phone: '0987654321',
      address: '456 Đường DEF, Phường MNO, Quận 3, TP. Hồ Chí Minh',
    },
    {
      id: 3,
      name: 'Lê Văn C',
      phone: '0901234567',
      address: '789 Đường GHI, Phường PQR, Quận 5, TP. Hồ Chí Minh',
    },
  ];

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Danh sách địa chỉ</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {addresses.length > 0 ? (
          addresses.map((address) => (
            <div key={address.id} className="address-item p-3 mb-3 border rounded">
              <h5>{address.name}</h5>
              <p>Số điện thoại: {address.phone}</p>
              <p>Địa chỉ: {address.address}</p>
              <Button variant="primary" onClick={() => handleSelectAddress(address)}>
                Chọn
              </Button>
            </div>
          ))
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
