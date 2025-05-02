import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import Container from "../components/Container";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import {
  createAnOrder,
  deleteUserCart,
  getAddress,
  getUserCart,
  resetState,
} from "../features/user/userSlice";
import DiscountCodeModal from "../components/DiscountCodeModal"; // Corrected path
import AddressCodeModal from "../components/AddressCodeModal";
import "bootstrap/dist/css/bootstrap.min.css";
import "./../Css/CssCheckout.css";
import Address from "./Address";
import {
  createReceitpUser,
  getAddressDefaultUser,
  getCoupounUserAccept,
} from "../utils/api";
import { toast } from "react-toastify";
import { Formik, Field, Form, ErrorMessage } from "formik";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userState = useSelector((state) => state.auth.user);
  const [stateReceiptDefaultAddress, setStateReceiptDefaultAddress] =
    useState(null);
  const [stateReceiptDefaultCoupon, setStateReceiptDefaultCoupon] =
    useState(null);
  const getAddressUser = async () => {
    const re = await getAddressDefaultUser();
    if (re && re.data) {
      const { receiver, phone, province, districts, specific, wards, _id } =
        re.data;
      const data = {
        _id,
        receiver,
        phone,
        province,
        districts,
        specific,
        wards,
        paymentMethod,
      };
      setStateReceiptDefaultAddress(data);
    } else {
      toast.error("Địa chỉ mặc định chưa có.Vui lòng tạo một địa chỉ mới");
      navigate("/dashboard/address");
    }
  };
  const getCouponUser = async () => {
    const re = await getCoupounUserAccept(userState._id);
    if (re && re.data) {
      setStateReceiptDefaultCoupon(re.data);
    } else {
      console.log("🚀 ~ getCouponUser ~ re:", re);
    }
  };
  const addressUserState = useSelector((state) => state?.auth?.addressUser);
  const getListAddress = () => {
    dispatch(
      getAddress(`&user=${JSON.parse(localStorage.getItem("customer"))._id}`)
    );
  };
  useEffect(() => {
    getAddressUser();
    getCouponUser();
    getListAddress();
    return () => {};
  }, []);

  const cartState = useSelector((state) => state?.auth?.cartProducts?.items);
  const authState = useSelector((state) => state?.auth);
  const [totalAmount, setTotalAmount] = useState(null);
  const [shippingInfo, setShippingInfo] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("VNPAY");
  const [discountCode, setDiscountCode] = useState();
  const [discountAmount, setDiscountAmount] = useState(0);
  const [showModalCode, setShowModalCode] = useState(false); // State to control modal visibility
  const [showModalAddress, setShowModalAddress] = useState(false); // State to control modal visibility
  const [shippingCost, setShippingCost] = useState(0); // State to track shipping cost
  const [selectedShippingMethod, setSelectedShippingMethod] = useState(""); // State to track selected shipping method

  useEffect(() => {
    let sum = 0;
    for (let index = 0; index < cartState?.length; index++) {
      sum = sum + Number(cartState[index].quantity) * cartState[index].price;
    }
    setTotalAmount(sum);
  }, [cartState]);

  useEffect(() => {
    dispatch(getUserCart());
  }, [dispatch]);

  useEffect(() => {
    if (
      authState?.orderedProduct?.order !== null &&
      authState?.orderedProduct?.success === true
    ) {
      dispatch(deleteUserCart());
      dispatch(resetState()); // Xóa giỏ hàng sau khi đặt hàng thành công
      navigate("/my-orders");
    }
  }, [authState, navigate, dispatch]);
  const handleSubmit = (values) => {
    const data = {
      paymentMethod: values.paymentMethod,
      items: cartState.map((item) => ({
        product: item.product._id, // Ensure productId is sent
        color: item.color._id,
        quantity: item.quantity,
        price: item.price,
      })),
      coupons: discountCode ? [discountCode] : [],
      supplier: "x",
      notes: "x",
      address: values?._id,
    };

    setTimeout(() => {
      checkOutHandler(data);
    }, 300);
  };

  const checkOutHandler = async (data) => {
    const re = await createReceitpUser(data);
    console.log("🚀 ~ checkOutHandler ~ re:", re);
    if (re && re.data && re.data.paymentMethod === "COD") {
      toast.success("Create order successful!");
      dispatch(deleteUserCart()); // Xóa giỏ hàng ngay lập tức
      dispatch(resetState()); // Reset trạng thái giỏ hàng
      navigate("/dashboard/my-orders");
    } else if (re && re.data) {
      //alert("Order placed successfully with Cash on Delivery");
      dispatch(deleteUserCart()); // Xóa giỏ hàng ngay lập tức
      dispatch(resetState()); // Reset trạng thái giỏ hàng
      window.location.href = re.data;
    } else {
      if (!re.data) {
        throw new Error("Invalid response from server");
      }
    }
  };

  const handleDiscountCode = () => {
    const discountCodes = {
      // FEE10K: 50000,
      // GIAM500K: 500000,
      // GIAM100K: 100000,
      // GIAM50K: 50000,
      // GIAM20K: 50000,
      // GIAM10K: 10000,
      // DT: 30000,
      // GIAM200K: 200000,
    };

    if (discountCodes[discountCode]) {
      //check api code
      // setDiscountAmount(discountCodes[discountCode]);
      alert("Discount code applied successfully!");
    } else {
      // alert("Invalid discount code.");
    }
  };

  const handleSelectCode = (discount) => {

    console.log("🚀 ~ file: Checkout.js:176 ~ handleSelectCode ~ discount:", discount);

    setDiscountCode(discount.code);
    setDiscountAmount(10000);
    setShowModalCode(false);
  };

  const handleShippingMethodChange = (cost, method) => {
    setShippingCost(cost);
    setSelectedShippingMethod(method);
  };

  return (
    <>
      <Container class1="checkout-wrapper py-5 home-wrapper-2">
        <div className="row">
          <div className="col-7">
            <div className="checkout-left-data">
              <h3 className="website-name">Sắc</h3>
              <nav
                style={{ "--bs-breadcrumb-divider": ">" }}
                aria-label="breadcrumb"
              >
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link className="text-dark total-price" to="/cart">
                      Cart
                    </Link>
                  </li>
                  &nbsp; /&nbsp;
                  <li
                    className="breadcrumb-item total-price active"
                    aria-current="page"
                  >
                    Information
                  </li>
                  &nbsp; /
                  <li className="breadcrumb-item total-price active">
                    Shipping
                  </li>
                  &nbsp; /
                  <li
                    className="breadcrumb-item total-price active"
                    aria-current="page"
                  >
                    Payment
                  </li>
                </ol>
              </nav>
              <h4 className="title total">Thông Tin Liên Hệ</h4>
              <p className="user-details total">
                Đội ngũ nhân viên Sắc (Sac@gmail.com)
              </p>
              <h4 className="mb-3">Địa chỉ giao hàng</h4>
              <div className="col-11">
                <div className="mt-2">
                  <a
                    className="choose-discount-code-link"
                    onClick={() => setShowModalAddress(true)}
                  >
                    Chọn địa chỉ
                  </a>
                </div>
              </div>

              <Formik
                initialValues={stateReceiptDefaultAddress}
                onSubmit={handleSubmit}
                enableReinitialize
              >
                <Form>
                  <div className="row">
                    <div className="col-11">
                      <div className="checkout-left-data">
                        <div className="mb-3">
                          <div className="d-flex justify-content-between gap-3">
                            <div className="flex-grow-1">
                              <label htmlFor="receiver">Người nhận</label>
                              <Field
                                type="text"
                                name="receiver"
                                placeholder="Người nhận"
                                className="form-control"
                                disabled={true}
                              />
                              <ErrorMessage
                                name="receiver"
                                component="div"
                                className="text-danger"
                              />
                            </div>

                            <div className="flex-grow-1">
                              <label htmlFor="phone">Số điện thoại</label>
                              <Field
                                type="text"
                                name="phone"
                                placeholder="Số điện thoại"
                                className="form-control"
                                disabled={true}
                              />
                              <ErrorMessage
                                name="phone"
                                component="div"
                                className="text-danger"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="mb-3">
                          <div className="d-flex justify-content-between gap-3">
                            <div className="flex-grow-1">
                              <label htmlFor="province">Tỉnh / Thành phố</label>
                              <Field
                                type="text"
                                name="province"
                                placeholder="Tỉnh / Thành phố"
                                className="form-control"
                                disabled={true}
                              />
                              <ErrorMessage
                                name="province"
                                component="div"
                                className="text-danger"
                              />
                            </div>

                            <div className="flex-grow-1">
                              <label htmlFor="districts">Quận / Huyện</label>
                              <Field
                                type="text"
                                name="districts"
                                placeholder="Quận / Huyện"
                                className="form-control"
                                disabled={true}
                              />
                              <ErrorMessage
                                name="districts"
                                component="div"
                                className="text-danger"
                              />
                            </div>

                            <div className="flex-grow-1">
                              <label htmlFor="wards">Phường / Xã</label>
                              <Field
                                type="text"
                                name="wards"
                                placeholder="Phường / Xã"
                                className="form-control"
                                disabled={true}
                              />
                              <ErrorMessage
                                name="wards"
                                component="div"
                                className="text-danger"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="mb-3">
                          <label htmlFor="specific">Địa chỉ cụ thể</label>
                          <Field
                            type="text"
                            name="specific"
                            placeholder="Địa chỉ cụ thể"
                            className="form-control"
                            disabled={true}
                          />
                        </div>

                        <div className="mb-3">
                          <h4>Phương thức thanh toán</h4>
                          <div className="form-check">
                            <Field
                              type="radio"
                              name="paymentMethod"
                              value="VNPAY"
                              className="form-check-input"
                            />
                            <label className="form-check-label">VNPAY</label>
                          </div>
                          <div className="form-check">
                            <Field
                              type="radio"
                              name="paymentMethod"
                              value="COD"
                              className="form-check-input"
                            />
                            <label className="form-check-label">
                              Thanh toán khi nhận hàng
                            </label>
                          </div>
                          <ErrorMessage
                            name="paymentMethod"
                            component="div"
                            className="text-danger"
                          />
                        </div>

                        <div className="w-100">
                          <div className="d-flex justify-content-between align-items-center">
                            <Link
                              to="/cart"
                              className="d-flex align-items-center text-dark"
                            >
                              <BiArrowBack className="me-2" />
                              <span>Quay lại giỏ hàng</span>
                            </Link>
                            <Link to="/product" className="button">
                              Tiếp tục mua sắm
                            </Link>
                            <button className="button" type="submit">
                              Đặt hàng
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Form>
              </Formik>
            </div>
          </div>
          <div className="col-5">
          <div className="border-bottom py-4">
            {cartState?.map((item, index) => {
              const hasColor = item.color && /^#([0-9A-F]{3}){1,2}$/i.test(item.color);
              const hasSize = item.size;

              return (
                <div
                  key={index}
                  className="d-flex align-items-center justify-content-between mb-3"
                  style={{ borderBottom: "1px solid #eee", paddingBottom: "1rem" }}
                >
                  {/* Hình ảnh và thông tin sản phẩm */}
                  <div className="d-flex align-items-start gap-3" style={{ width: "70%" }}>
                    <div className="position-relative">
                      <span
                        style={{
                          top: "-8px",
                          right: "-8px",
                          fontSize: "12px",
                          width: "24px",
                          height: "24px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        className="badge bg-secondary text-white rounded-circle position-absolute"
                      >
                        {item.quantity}
                      </span>
                      <img
                        src={item.product.images[0]}
                        width={80}
                        height={80}
                        style={{ objectFit: "cover", borderRadius: "8px" }}
                        alt="product"
                      />
                    </div>
                    <div>
                      <h6 className="mb-1 fw-semibold">{item.product.name}</h6>
                      <div className="d-flex align-items-center gap-2">
                        {hasColor && (
                          <span
                            className="rounded-circle border"
                            style={{
                              width: "18px",
                              height: "18px",
                              backgroundColor: item.color,
                              display: "inline-block",
                            }}
                            title="Màu"
                          ></span>
                        )}
                        {hasSize && (
                          <span style={{ fontSize: "14px" }} className="text-muted">
                            Size: {item.size}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Giá */}
                  <div style={{ textAlign: "right", width: "30%" }}>
                    <h6 className="mb-0 text-danger fw-semibold">
                      {(item.price * item.quantity).toLocaleString("vi-VN")}₫
                    </h6>
                  </div>
                </div>
              );
            })}
          </div>
            <div className="border-bottom py-4">
              <div className="d-flex justify-content-between align-items-center">
                <p className="total">Tạm tính</p>
                <p className="total-price">
                  {totalAmount ? totalAmount.toLocaleString("vi-VN") : "0"}₫
                </p>
              </div>
              {totalAmount < 1000000 && (
                <div className="d-flex flex-column py-2">
                  <h5>Select Shipping Method</h5>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="shippingMethod"
                      id="economy"
                      value="economy"
                      checked={selectedShippingMethod === "economy"}
                      onChange={() =>
                        handleShippingMethodChange(15000, "economy")
                      }
                    />
                    <label className="form-check-label" htmlFor="economy">
                      Economy: 15,000₫ (HCM: 4 - 7 days / Nationwide: 7 - 10
                      days)
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="shippingMethod"
                      id="standard"
                      value="standard"
                      checked={selectedShippingMethod === "standard"}
                      onChange={() =>
                        handleShippingMethodChange(30000, "standard")
                      }
                    />
                    <label className="form-check-label" htmlFor="standard">
                      Standard: 30,000₫ (HCM: 2 - 3 days / Nationwide: 5 - 7
                      days)
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="shippingMethod"
                      id="express"
                      value="express"
                      checked={selectedShippingMethod === "express"}
                      onChange={() =>
                        handleShippingMethodChange(60000, "express")
                      }
                    />
                    <label className="form-check-label" htmlFor="express">
                      Express: 60,000₫ (HCM: 24 hours / Nationwide: 2 - 3 days)
                    </label>
                  </div>
                </div>
              )}
              {totalAmount >= 1000000 && (
                <div className="d-flex justify-content-between align-items-center">
                  <p className="mb-0 total">Phí vận chuyển</p>
                  <p className="mb-0 total-price">Miễn phí</p>
                </div>
              )}
              <div className="d-flex justify-content-between align-items-center">
                <p className="mb-0 total">Sắc Voucher</p>
                <p className="mb-0 total-price">
                  {discountAmount.toLocaleString("vi-VN")}₫
                </p>
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center border-bottom py-4">
              <h4 className="total">Tổng hóa đơn</h4>
              <h5 className="total-price">
                {totalAmount
                  ? Math.max(
                      totalAmount +
                        (totalAmount >= 1000000 ? 0 : shippingCost) -
                        discountAmount,
                      0
                    ).toLocaleString("vi-VN")
                  : "0"}
                ₫
              </h5>
            </div>
            <div className="border-bottom py-4">
              <div className="mt-2">
                <a
                  className="choose-discount-code-link"
                  onClick={() => setShowModalCode(true)}
                >
                  Chọn mã giảm giá
                </a>
              </div>
              <div className="d-flex flex-column flex-md-row align-items-center gap-3">
                <input
                  type="text"
                  placeholder="Nhập mã giảm giá"
                  className="form-control w-100 w-md-75"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                />
                <button
                  className="button apply-discount-btn w-100 w-md-auto"
                  onClick={handleDiscountCode}
                  style={{
      
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                   
                  }}
                >
                  Áp dụng mã giảm giá
                </button>
              </div>
            </div>
          </div>
        </div>
      </Container>
      <DiscountCodeModal
        data={stateReceiptDefaultCoupon}
        show={showModalCode}
        handleClose={() => setShowModalCode(false)}
        handleSelectCode={handleSelectCode}
      />
      <AddressCodeModal
        data={addressUserState}
        show={showModalAddress}
        setStateReceiptDefaultAddress={setStateReceiptDefaultAddress}
        handleClose={() => setShowModalAddress(false)}
      />
    </>
  );
};

export default Checkout;
