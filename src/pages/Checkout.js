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
  getUserCart,
  resetState,
} from "../features/user/userSlice";
import DiscountCodeModal from "../components/DiscountCodeModal"; // Corrected path
import AddressCodeModal from "../components/AddressCodeModal";
import "bootstrap/dist/css/bootstrap.min.css";
import "./../Css/CssCheckout.css";
import Address from './Address';

let shippingSchema = yup.object({
  firstname: yup.string().required("First Name is Required"),
  lastname: yup.string().required("Last Name is Required"),
  address: yup.string().required("Address Details are Required"),
  state: yup.string().required("State is Required"),
  city: yup.string().required("District is Required"),
  country: yup.string().required("Country is Required"),
  pincode: yup.number("Phone No is Required").required().positive().integer(),
});

const Checkout = () => {
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.auth.user);

  const cartState = useSelector((state) => state?.auth?.cartProducts?.items);
  console.log("🚀 ~ Checkout ~ cartState:", cartState);
  const authState = useSelector((state) => state?.auth);
  const [totalAmount, setTotalAmount] = useState(null);
  const [shippingInfo, setShippingInfo] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("VNPay");
  const [discountCode, setDiscountCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [shippingCost, setShippingCost] = useState(0); // State to track shipping cost
  const [selectedShippingMethod, setSelectedShippingMethod] = useState(""); // State to track selected shipping method
  const navigate = useNavigate();

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

  const formik = useFormik({
    initialValues: {
      name: userState.name,
      address: "",
      state: "",
      city: "",
      pincode: "",
      other: "",
    },
    validationSchema: shippingSchema,
    onSubmit: (values) => {
      setShippingInfo(values);
      setTimeout(() => {
        checkOutHandler(values);
      }, 300);
    },
  });

  const checkOutHandler = async (shippingInfo) => {
    try {
      const result = await axios.post(
        "http://localhost:5000/api/user/order/checkout",
        {
          amount: totalAmount + shippingCost - discountAmount,
          orderInfo: "Order from A2K",
          paymentMethod,
          shippingInfo,
          orderItems: cartState.map((item) => ({
            product: item.productId, // Ensure productId is sent
            color: item.color,
            quantity: item.quantity,
            price: item.price,
          })),
          totalPrice: totalAmount,
          totalPriceAfterDiscount: totalAmount + shippingCost - discountAmount,
        }
      );

      if (paymentMethod === "COD") {
        alert("Order placed successfully with Cash on Delivery");
        dispatch(deleteUserCart()); // Xóa giỏ hàng ngay lập tức
        dispatch(resetState()); // Reset trạng thái giỏ hàng
        navigate("/my-orders");
      } else {
        if (!result.data || !result.data.vnpUrl) {
          throw new Error("Invalid response from server");
        }

        const { vnpUrl } = result.data;
        window.location.href = vnpUrl;
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      alert(
        "Something Went Wrong: " +
          (error.response?.data?.message || error.message)
      );
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
      setDiscountAmount(discountCodes[discountCode]);
      alert("Discount code applied successfully!");
    } else {
      alert("Invalid discount code.");
    }
  };

  const handleSelectCode = (discount) => {
    setDiscountCode(discount.code);
    setDiscountAmount(discount.amount);
    setShowModal(false);
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
              <div className="mt-2">
                <a
                  className="choose-discount-code-link"
                  onClick={() => setShowModal(true)}
                >
                  Chọn địa chỉ
                </a>
              </div>
              <form
                onSubmit={formik.handleSubmit}
                className="d-flex gap-15 flex-wrap justify-content-between"
              >
                <div className="flex-grow-1">
                  <input
                    type="text"
                    placeholder="Tên"
                    className="form-control"
                    name="lastname"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <div className="error ms-2 my-1">
                    {formik.touched.lastname && formik.errors.lastname}
                  </div>
                </div>
                <div className="w-100">
                  <input
                    type="text"
                    placeholder="Số điện thoại"
                    className="form-control"
                    name="pincode"
                    value={formik.values.pincode}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <div className="error ms-2 my-1">
                    {formik.touched.pincode && formik.errors.pincode}
                  </div>
                </div>
                <div className="flex-grow-1">
                  <input
                    type="text"
                    placeholder="Xã"
                    className="form-control"
                    name="address"
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <div className="error ms-2 my-1">
                    {formik.touched.city && formik.errors.city}
                  </div>
                </div>
                <div className="flex-grow-1">
                  <input
                    type="text"
                    placeholder="Quận / Huyện"
                    className="form-control"
                    name="city"
                    value={formik.values.city}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <div className="error ms-2 my-1">
                    {formik.touched.address && formik.errors.address}
                  </div>
                </div>
                <div className="flex-grow-1">
                  <input
                    type="text"
                    placeholder="Tỉnh / Thành phố"
                    className="form-control"
                    name="city"
                    value={formik.values.city}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <div className="error ms-2 my-1">
                    {formik.touched.address && formik.errors.address}
                  </div>
                  <div className="error ms-2 my-1">
                    {formik.touched.state && formik.errors.state}
                  </div>
                </div>

                <div className="w-100">
                  <input
                    type="text"
                    placeholder="Địa chỉ cụ thể"
                    className="form-control"
                    name="other"
                    value={formik.values.other}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>

                <div className="w-100">
                  <h4 className="mb-3">Phương thức thanh toán</h4>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="paymentMethod"
                      id="vnpay"
                      value="VNPay"
                      checked={paymentMethod === "VNPay"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="vnpay">
                      VNPay
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="paymentMethod"
                      id="cod"
                      value="COD"
                      checked={paymentMethod === "COD"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="cod">
                      Thanh toán khi nhận hàng
                    </label>
                  </div>
                </div>
                <div className="w-100">
                  <div className="d-flex justify-content-between align-items-center">
                    <Link to="/cart" className="text-dark">
                      <BiArrowBack className="me-2" />
                      Quay lại giỏ hàng
                    </Link>
                    <Link to="/product" className="button">
                      Tiếp tục mua sắm
                    </Link>
                    <button className="button" type="submit">
                      Đặt hàng
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="col-5">
            <div className="border-bottom py-4">
              {cartState &&
                cartState?.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className="d-flex gap-10 mb-2 align-align-items-center"
                    >
                      <div className="w-75 d-flex gap-10">
                        <div className="w-25 position-relative">
                          <span
                            style={{ top: "-10px", right: "2px" }}
                            className="badge bg-secondary text-white rounded-circle p-2 position-absolute"
                          >
                            {item?.quantity}
                          </span>
                          <img
                            src={item?.product?.images[0]}
                            width={100}
                            height={100}
                            alt="product"
                          />
                        </div>
                        <div>
                          <h5 className="total-price">{item?.product?.name}</h5>
                          <p className="total-price">{item?.color?.color}</p>
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <h5 className="total">
                          {(item?.price * item?.quantity).toLocaleString(
                            "vi-VN"
                          )}
                          ₫
                        </h5>
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
                  ? (
                      totalAmount +
                      (totalAmount >= 1000000 ? 0 : shippingCost) -
                      discountAmount
                    ).toLocaleString("vi-VN")
                  : "0"}
                ₫
              </h5>
            </div>
            <div className="border-bottom py-4">
              <div className="mt-2">
                <a
                  className="choose-discount-code-link"
                  onClick={() => setShowModal(true)}
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
                >
                  Áp dụng mã giảm giá
                </button>
              </div>
            </div>
          </div>
        </div>
      </Container>
      <DiscountCodeModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        handleSelectCode={handleSelectCode}
      />
      <AddressCodeModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        handleSelectCode={handleSelectCode}
      />
    </>
  );
};

export default Checkout;
