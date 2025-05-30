import React, { useEffect, useState } from "react";
import Container from "../components/Container";
import BreadCrumb from "../components/BreadCrumb";
import { useDispatch, useSelector } from "react-redux";
import { getOrders } from "../features/user/userSlice";
import { FaPlus, FaMinus, FaListUl, FaClipboardList, FaCheckCircle, FaTools, FaTruck, FaBoxOpen, FaTimesCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { updateOrder } from "../features/products/productSlilce";
import { toast } from "react-toastify";
import ReviewPopup from "../components/ReviewPopup";


const Orders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const orderState = useSelector((state) => state?.auth?.getorderedProduct);

  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [expandedOrders, setExpandedOrders] = useState({});
  const [reviewProductId, setReviewProductId] = useState(null);

 useEffect(() => {
  dispatch(getOrders());

  const interval = setInterval(() => {
    dispatch(getOrders());
  }, 5000); // gọi lại sau mỗi 10 giây

  return () => clearInterval(interval); // clear interval khi component bị unmount
}, [dispatch]);

  // useEffect(() => {
  //   if (orderState) {
  //     setFilteredOrders(
  //       statusFilter
  //         ? orderState.filter((order) => order?.statusUser === statusFilter)
  //         : orderState
  //     );
  //   }
  // }, [orderState, statusFilter]);
  useEffect(() => {
    if (orderState) {
      const sortedOrders = [...orderState].sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
  
      setFilteredOrders(
        statusFilter
          ? sortedOrders.filter((order) => order?.statusUser === statusFilter)
          : sortedOrders
      );
    }
  }, [orderState, statusFilter]);
  

  const toggleExpandOrder = (orderId) => {
    setExpandedOrders((prevState) => ({
      ...prevState,
      [orderId]: !prevState[orderId],
    }));
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "badge bg-secondary";
      case "PREPARE":
        return "badge bg-info";
      case "UNCONFIRMED":
        return "badge bg-warning";
      case "ON_DELIVERY":
        return "badge bg-primary";
      case "DELIVERED":
        return "badge bg-success";
      case "CANCEL":
        return "badge bg-danger";
      default:
        return "badge bg-light text-dark";
    }
  };

  const handleReview = (productId) => {
    if (productId) {
      setReviewProductId(productId);
    } else {
      console.error("Không tìm thấy ID sản phẩm");
    }
  };

  const handleCancelOrder = (orderId) => {
    if (orderId) {
      // Gọi API hủy đơn hàng
      dispatch(updateOrder({ id: orderId, status: "Cancelled" }))
        .unwrap()
        .then(() => {
          toast.success("Đơn hàng đã được hủy thành công!");

          dispatch(getOrders());
        })
        .catch((error) => {
          console.error("Lỗi khi hủy đơn hàng:", error);
          toast.error("Không thể hủy đơn hàng. Vui lòng thử lại sau.");
        });
    }
  };

  const styles = {
    orderList: {
      width: "100%",
      maxWidth: "1200px",
      margin: "auto",
      backgroundColor: "#fff",
      borderRadius: "8px",
      boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    },
    orderHeader: {
      display: "flex",
      justifyContent: "space-between",
      padding: "10px 20px",
      borderBottom: "1px solid #ccc",
      backgroundColor: "#f7f7f7",
    },
    orderColumn: {
      flex: 1,
      textAlign: "center",
    },
    orderItem: {
      marginBottom: "20px",
      borderRadius: "8px",
      overflow: "hidden",
      border: "1px solid #ccc",
    },
    orderProducts: {
      backgroundColor: "#fff",
      color: "#000",
      padding: "10px 20px",
    },
    productHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px 0",
      borderBottom: "1px solid #ccc",
    },
    productItem: {
      display: "flex",
      justifyContent: "space-between",
      padding: "10px 0",
      borderBottom: "1px solid #eee",
    },
    productColumn: {
      flex: 1,
      textAlign: "center", // Căn giữa tất cả nội dung
      display: "flex",
      justifyContent: "center",
      alignItems: "center", // Đảm bảo căn giữa cả chiều dọc
    },
    colors: {
      listStyle: "none",
      padding: 0,
      margin: 0,
    },
    colorItem: {
      width: "20px",
      height: "20px",
      borderRadius: "50%",
      display: "inline-block",
    },
    filterContainer: {
      display: "flex",
      justifyContent: "center",
      marginBottom: "20px",
    },
    filterSelect: {
      padding: "10px",
      borderRadius: "4px",
      border: "1px solid #ccc",
    },
    orderDetails: {
      padding: "10px 20px",
      backgroundColor: "#f7f7f7",
      borderBottom: "1px solid #ccc",
    },
    orderDetailsColumn: {
      textAlign: "left",
      paddingBottom: "10px",
    },
    detailSection: {
      marginBottom: "10px",
    },
    toggleButton: {
      cursor: "pointer",
      backgroundColor: "#007bff",
      color: "#fff",
      border: "none",
      borderRadius: "50%",
      width: "30px",
      height: "30px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    image: {
    width: "50px", // Kích thước cố định cho ảnh
    height: "50px",
    objectFit: "cover", // Đảm bảo không bị méo hình
  },
  };

  const translateStatus = (status) => {
  switch (status) {
    case "CONFIRMED":
      return "Đã xác nhận";
    case "PREPARE":
      return "Đang chuẩn bị";
    case "UNCONFIRMED":
      return "Đơn hàng mới";
    case "ON_DELIVERY":
      return "Đang vận chuyển";
    case "DELIVERED":
      return "Đã giao hàng";
    case "CANCEL":
      return "Đã hủy";
    default:
      return "Không xác định";
  }
};

const statusOptions = [
  { value: "", label: "Tất cả", icon: <FaListUl /> },
  { value: "UNCONFIRMED", label: "Đơn hàng mới", icon: <FaClipboardList /> },
  { value: "CONFIRMED", label: "Đã xác nhận", icon: <FaCheckCircle /> },
  { value: "PREPARE", label: "Đang chuẩn bị", icon: <FaTools /> },
  { value: "ON_DELIVERY", label: "Đang vận chuyển", icon: <FaTruck /> },
  { value: "DELIVERED", label: "Đã giao hàng", icon: <FaBoxOpen /> },
  { value: "CANCEL", label: "Đã hủy", icon: <FaTimesCircle /> },
];

const statusCounts = orderState?.reduce((acc, order) => {
  const status = order.statusUser || "UNKNOWN";
  acc[status] = (acc[status] || 0) + 1;
  return acc;
}, {});



  return (
    <>
      <Container class1="cart-wrapper home-wrapper-2 py-5">
      <div className="position-relative d-flex justify-content-center align-items-center mb-4" style={{ height: "90px" }}>
        {/* Thanh ngang phía sau */}
        <div
          style={{
            position: "absolute",
            top: "30px", // đặt giữa icon
            left: 0,
            right: 0,
            height: "4px",
            backgroundColor: "#ccc",
            zIndex: 1,
          }}
        />

        {/* Các hình tròn */}
        <div className="d-flex justify-content-center align-items-center gap-5 flex-wrap" style={{ zIndex: 2 }}>
          {statusOptions.map((status) => (
            <div
              key={status.value}
              onClick={() => setStatusFilter(status.value)}
              style={{
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "6px",
              }}
            >
      <div
        style={{
          position: "relative",
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          border: statusFilter === status.value ? "3px solid #007bff" : "2px solid #ccc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: statusFilter === status.value ? "#e9f5ff" : "#fff",
          transition: "all 0.3s",
          fontSize: "1.2rem",
        }}
      >
        {/* Dot hoặc số đếm */}
        {statusCounts?.[status.value] > 0 && (
          <div
            style={{
              position: "absolute",
              top: "-6px",
              right: "-6px",
              minWidth: "18px",
              height: "18px",
              padding: "0 4px",
              backgroundColor: "red",
              color: "white",
              fontSize: "0.75rem",
              fontWeight: "bold",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              lineHeight: 1,
            }}
          >
            +{statusCounts[status.value]}
          </div>
        )}

        {status.icon}
      </div>


              <div
                style={{
                  fontSize: "0.8rem",
                  textAlign: "center",
                  whiteSpace: "nowrap",
                  maxWidth: "70px",
                }}
              >
                {status.label}
              </div>
            </div>
          ))}
        </div>
      </div>



        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Tình trạng</th>
                <th>Đơn giá</th>
                <th>Ngày đặt</th>
                <th>Tổng sau giảm</th>
                <th>Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders &&
                filteredOrders.map((item, index) => {
                  const totalReceipt = item.items.reduce(
                    (sum, item) => sum + item.quantity * item.price,
                    0
                  );
                  return (
                    <>
                      <React.Fragment key={index}>
                        <tr>
                          <td>{item?._id}</td>
                          <td>
                            <span className={getStatusStyle(item?.statusUser)}>
                              {translateStatus(item?.statusUser)}
                            </span>
                          </td>
                          <td>{totalReceipt.toLocaleString("vi-VN")} ₫</td>
                          <td>{new Date(item?.createdAt)?.toLocaleString()}</td>
                          <td>{item?.total?.toLocaleString("vi-VN")} ₫</td>
                          <td>
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => toggleExpandOrder(item?._id)}
                            >
                              {expandedOrders[item?._id] ? (
                                <FaMinus /> // Biểu tượng "-"
                              ) : (
                                <FaPlus /> // Biểu tượng "+"
                              )}
                            </button>
                          </td>
                        </tr>
                        {expandedOrders[item?._id] && (
                          <tr>
                            <td colSpan={6}>
                              <div className="p-3 bg-light rounded">
                                {/* Thông tin thanh toán */}
                                <h5>Thông tin thanh toán</h5>
                                <p>Hình thức: {item.paymentMethod}</p>

                                {/* Thông tin vận chuyển */}
                                <h5>Thông tin vận chuyển</h5>
                                <p>Tình trạng: {item.statusUser}</p>
                                <p>
                                  Địa chỉ: {item.address.specific}, {item.address.wards}, {item.address.districts},  {item.address.province}
                                 
                                </p>

                                {/* Thông tin người nhận */}
                                <h5>Thông tin người nhận</h5>
                                <p>Họ tên: {item.address.receiver}</p>
                                <p>
                                  Số điện thoại:
                                  {item.address.phone}
                                </p>

                                {(item.orderStatus === "Ordered" ||
                                  item.orderStatus === "Processed") && (
                                  <div className="mt-3">
                                    <button
                                      className="btn btn-sm btn-danger"
                                      onClick={() =>
                                        handleCancelOrder(item?._id)
                                      }
                                    >
                                      Hủy Đơn Hàng
                                    </button>
                                  </div>
                                )}

                                {/* Nếu trạng thái là "Delivered", hiển thị nút Review */}
                                {item.statusUser === "DELIVERED" && (
                                  <div className="mt-3">
                                    <button
                                      className="btn btn-sm btn-success"
                                      onClick={() =>
                                        handleReview(
                                          item?.items[0]?.product?._id
                                        )
                                      }
                                    >
                                      Review Sản Phẩm
                                    </button>
                                  </div>
                                )}

                                <h5>Chi Tiết Sản Phẩm</h5>
                                <div style={styles.productHeader}>
                                  <div style={styles.productColumn}>
                                    <h6>Tên sản phẩm</h6>
                                  </div>                                  
                                  <div style={styles.productColumn}>
                                    <h6>Số lượng</h6>
                                  </div>
                                  <div style={styles.productColumn}>
                                    <h6>Đơn giá</h6>
                                  </div>
                                  <div style={styles.productColumn}>
                                    <h6>Tổng tiền</h6>
                                  </div>
                                </div>

                                {/* Lặp qua danh sách orderItems */}
                                {item?.items?.map((i, index) => {
                                  return (
                                    <div style={styles.productItem} key={index}>
                                      {/* Cột: Tên sản phẩm (ảnh + thông tin bên phải) */}
                                      <div style={styles.productColumn}>
                                        <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                                          {/* Ảnh sản phẩm bên trái */}
                                          <img
                                            src={i?.product?.images?.[0]}
                                            width={60}
                                            height={60}
                                            alt="product"
                                            style={{ objectFit: "cover", borderRadius: "6px", cursor: "pointer" }}
                                            onClick={() => handleReview(i?.product?._id)}
                                          />
                                          {/* Tên + màu + size bên phải, căn lề trái */}
                                          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                                            <span style={{ fontWeight: 600 }}>{i?.product?.name}</span>

                                            {i?.color && (
                                              <div style={{ fontSize: "0.85rem", marginTop: 4 }}>
                                                Màu:{" "}
                                                <span
                                                  style={{
                                                    display: "inline-block",
                                                    width: 14,
                                                    height: 14,
                                                    borderRadius: "50%",
                                                    backgroundColor: i.color,
                                                    border: "1px solid #ccc",
                                                    marginRight: 4,
                                                    verticalAlign: "middle",
                                                  }}
                                                ></span>
                                                {i.color}
                                              </div>
                                            )}

                                            {i?.size && (
                                              <div style={{ fontSize: "0.85rem", marginTop: 4 }}>
                                                Size: {i.size}
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>

                                      {/* Các cột còn lại giữ nguyên */}
                                      <div style={styles.productColumn}>
                                        <p>{i?.quantity}</p>
                                      </div>
                                      <div style={styles.productColumn}>
                                        <p>{i?.price?.toLocaleString("vi-VN")} ₫</p>
                                      </div>
                                      <div style={styles.productColumn}>
                                        <p>{(i?.price * i?.quantity)?.toLocaleString("vi-VN")} ₫</p>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                      
                    </>
                  );
                })}
            </tbody>
          </table>
        </div>
      </Container>
      {reviewProductId && (
        <ReviewPopup
          productId={reviewProductId}
          onClose={() => setReviewProductId(null)}
        />
      )}

    </>
  );
};



export default Orders;
