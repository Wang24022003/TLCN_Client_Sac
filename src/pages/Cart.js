import React, { useEffect, useState } from "react";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import watch from "../images/watch.jpg";
import { AiFillDelete } from "react-icons/ai";
import { Link } from "react-router-dom";
import Container from "../components/Container";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteCartProduct,
  getUserCart,
  updateCartProduct,
  deleteUserCart,
} from "../features/user/userSlice";
import "./../Css/CssCart.css";
import { FaArrowLeft, FaMinus, FaPlus, FaShippingFast } from "react-icons/fa";
import { useLocation } from "react-router-dom";


const Cart = () => {
  const dispatch = useDispatch();
  const [productupdateDetail, setProductupdateDetail] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const userCartState = useSelector(
    (state) => state?.auth?.cartProducts?.items
  );

  const location = useLocation();

  useEffect(() => {
    dispatch(getUserCart());
  }, [location.pathname]);

  useEffect(() => {
    if (productupdateDetail !== null) {
      dispatch(updateCartProduct(productupdateDetail));
      setTimeout(() => {
        dispatch(getUserCart());
      }, 200);
    }
  }, [productupdateDetail]);

  const deleteACartProduct = (id) => {
    dispatch(deleteCartProduct(id));
    setTimeout(() => {
      dispatch(getUserCart());
    }, 200);
  };

  useEffect(() => {
    let sum = 0;
    for (let index = 0; index < userCartState?.length; index++) {
      sum += userCartState[index].quantity * userCartState[index].price;
      setTotalAmount(sum);
    }
  }, [userCartState]);

  const deleteAllCartProduct = () => {
    dispatch(deleteUserCart());

    setTimeout(() => {
      dispatch(getUserCart());
    }, 200);
  };

  const discountTarget = 1000000; // Mức chi tiêu để được miễn phí ship


  return (
    <>
      <Meta title={"Cart"} />
      <BreadCrumb title="Cart" />
      <Container class1="cart-wrapper home-wrapper-2 py-5">
        <div className="row">
          {/* Bảng sản phẩm - Bên trái */}
          <div className="col-md-8">
            {/* Header bảng */}
            <div className="cart-header py-3 px-4 flex justify-between items-center border bg-gray-100 rounded-md shadow-sm">
              <h4 className="w-2/5 text-center font-semibold">Sản phẩm</h4>
              <h4 className="w-1/5 hidden md:block text-center font-semibold">Giá</h4>
              <h4 className="w-1/5 text-center font-semibold">Số lượng</h4>
              <h4 className="w-[100px] text-center font-semibold">Tổng</h4>
              <h4 className="w-[50px] text-center font-semibold"></h4>
            </div>

            {userCartState?.map((item, index) => (
              <div
                key={index}
               className="flex flex-wrap md:flex-nowrap justify-between items-center border rounded-md shadow-sm py-4 px-4 bg-white"
              >
              {/* Cột 1: Sản phẩm */}
              <div className="w-full md:w-2/5 flex gap-4 items-start mb-4 md:mb-0">
                <img
                  src={item?.product?.images?.[0]}
                  alt="product"
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex flex-col">
                  <p className="text-sm font-medium">{item?.product?.name}</p>
                  <div className="flex gap-3 text-xs text-gray-600 mt-1">
                    {item.color && (
                      <div className="flex items-center gap-1">
                        <span>Màu:</span>
                        <span
                          className="w-4 h-4 rounded-full border"
                          style={{ backgroundColor: item.color }}
                        ></span>
                      </div>
                    )}
                    {item.size && (
                      <div>
                        <span>Kích thước: {item.size.toUpperCase()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Cột 2: Giá */}
              <div className="w-1/5 text-sm font-medium text-gray-700 hidden md:block text-center">
                {item?.price?.toLocaleString("vi-VN")}₫
              </div>

              {/* Cột 3: Số lượng với nút +/- */}
              <div className="w-full md:w-1/5 flex items-center gap-2 justify-center mb-4 md:mb-0">
                <button
                  className="px-2 py-1 border rounded hover:bg-gray-100"
                  onClick={() => {
                    if (item.quantity > 1) {
                      setProductupdateDetail({
                        product: {
                          _id: item.product._id,
                          price: item.price,
                          quantity: item.quantity - 1,
                          ...(item.color && { color: item.color }),
                          ...(item.size && { size: item.size }),
                        },
                      });
                    }
                  }}
                >
                  <FaMinus />
                </button>

                <input
                  type="number"
                  value={item.quantity}
                  min={1}
                  max={99}
                  className="w-14 text-center border border-gray-300 rounded"
                  onChange={(e) => {
                    const val = +e.target.value;
                    if (val >= 1) {
                      setProductupdateDetail({
                        product: {
                          _id: item.product._id,
                          price: item.price,
                          quantity: val,
                          ...(item.color && { color: item.color }),
                          ...(item.size && { size: item.size }),
                        },
                      });
                    }
                  }}
                />

                <button
                  className="px-2 py-1 border rounded hover:bg-gray-100"
                  onClick={() => {
                    setProductupdateDetail({
                      product: {
                        _id: item.product._id,
                        price: item.price,
                        quantity: item.quantity + 1,
                        ...(item.color && { color: item.color }),
                        ...(item.size && { size: item.size }),
                      },
                    });
                  }}
                >
                  <FaPlus />
                </button>
              </div>

              {/* Cột 4: Tổng tiền */}
              <div className="w-1/2 md:w-[100px] text-center font-semibold text-gray-800 text-sm">
                {(item.quantity * item.price).toLocaleString("vi-VN")}₫
              </div>

              {/* Cột 5: Xoá */}
              <div className="w-1/2 md:w-[50px] flex justify-center items-center">
                <button
                  onClick={() => deleteACartProduct(item?._id)}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  <AiFillDelete className="text-xl" />
                </button>
              </div>
            </div>
            ))}
            {/* Nút tiếp tục mua sắm & hủy đơn hàng */}
            <div className="d-flex justify-content-between align-items-center mt-4">
              <Link to="/product" className="shopping-btn">
                <FaArrowLeft className="icon-left" />
                <span className="btn-text">Tiếp tục mua sắm</span>
              </Link>

              <div className="text-center mt-3">
                <button onClick={deleteAllCartProduct} className="gold-toggle-btn1">
                  <div className="btn-inner d-flex align-items-center justify-content-center position-relative">
                    <img
                      src="/images/icon-left.png"
                      alt="left"
                      className="btn-icon icon-left"
                    />
                    <span className="btn-text">Xóa giỏ hàng</span>
                    <img
                      src="/images/icon-right.png"
                      alt="right"
                      className="btn-icon icon-right"
                    />
                  </div>
                </button>
              </div>

            </div>
          </div>

          {/* Tổng hóa đơn - Bên phải */}
          <div className="col-md-4 mt-4 mt-md-0">
            <div className="border p-5 rounded-xl shadow-md bg-white sticky top-[90px]">

              {/* Thanh tiến trình miễn phí vận chuyển */}
              <div className="relative mb-5 bg-gray-300 h-[6px] ">
                <div
                  style={{
                    width:
                      (totalAmount / discountTarget) * 100 >= 100
                        ? "100%"
                        : (totalAmount / discountTarget) * 100 + "%",
                  }}
                  className="h-[6px] bg-red-500 rounded-md transition-all"
                ></div>
                <span className="absolute right-0 -top-[10px] flex items-center justify-center z-20 w-7 h-7 bg-red-500 rounded-full text-white text-sm">
                  <FaShippingFast />
                </span>

              </div>

              {/* Thông báo miễn phí vận chuyển */}
              <p className="mt-5 text-[12px]">
                {discountTarget - totalAmount <= 0 ? (
                  <>Chúc mừng! Bạn đã được</>
                ) : (
                  <>
                    Tiêu thêm {(discountTarget - totalAmount).toLocaleString("vi-VN")}₫ để nhận được
                  </>
                )}
                <span className="text-red-600"> Miễn phí vận chuyển!</span>
              </p>


              {/* Chi tiết tổng hóa đơn */}
              <h4 className="mb-3 font-semibold text-lg">Tổng hóa đơn</h4>
              <hr className="mb-3" />
              <div className="flex justify-between mb-2 text-sm">
                <span>Tạm tính:</span>
                <span>{totalAmount.toLocaleString("vi-VN")}₫</span>
              </div>
              <div className="flex justify-between mb-2 text-sm">
                <span>Phí vận chuyển:</span>
                <span>Miễn phí</span>
              </div>
              <div className="flex justify-between font-bold text-base mb-5">
                <span>Thành tiền:</span>
                <span>{totalAmount.toLocaleString("vi-VN")}₫</span>
              </div>

              {/* Nút thanh toán */}
              <Link to="/checkout" className="checkout-fancy-btn">
                <div className="btn-inner d-flex align-items-center justify-content-center position-relative">
                  <img
                    src="/images/icon-left.png"
                    alt="left"
                    className="btn-icon icon-left"
                  />
                  <span className="btn-text">Thanh toán</span>
                  <img
                    src="/images/icon-right.png"
                    alt="right"
                    className="btn-icon icon-right"
                  />
                </div>
              </Link>

            </div>
          </div>

        </div>


      </Container>
    </>
  );
};

export default Cart;
