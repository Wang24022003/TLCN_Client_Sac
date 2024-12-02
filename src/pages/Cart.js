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

const Cart = () => {
  const dispatch = useDispatch();
  const [productupdateDetail, setProductupdateDetail] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const userCartState = useSelector(
    (state) => state?.auth?.cartProducts?.items
  );

  useEffect(() => {
    dispatch(getUserCart());
  }, []);

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

  return (
    <>
      <Meta title={"Cart"} />
      <BreadCrumb title="Cart" />
      <Container class1="cart-wrapper home-wrapper-2 py-5">
        <div className="row">
          <div className="col-12">
            <div className="cart-header py-3 d-flex justify-content-between align-items-center">
              <h4 className="cart-col-1">Sản phẩm</h4>
              <h4 className="cart-col-2">Giá</h4>
              <h4 className="cart-col-3">Số lượng</h4>
              <h4 className="cart-col-4">Tổng</h4>
            </div>
            {userCartState &&
              userCartState.map((item, index) => {
                console.log("🚀 ~ userCartState.map ~ item:", item);
                return (
                  <div
                    key={index}
                    className="cart-data py-3 mb-2 d-flex justify-content-between align-items-center"
                    style={{
                      borderBottom: "1px solid #e0e0e0",
                      paddingBottom: "20px",
                    }}
                  >
                    <div className="cart-col-1 gap-15 d-flex align-items-center">
                      <div className="w-25">
                        <img
                          src={
                            item?.product?.images?.[0] || "default-image-url"
                          }
                          className="img-fluid"
                          alt="product image"
                          style={{
                            borderRadius: "8px",
                            transition: "transform 0.3s ease",
                          }}
                        />
                      </div>
                      <div className="w-75">
                        <p>{item?.productId?.title}</p>
                        <p className="d-flex gap-3">
                          Color:
                          <ul className="colors ps-0">
                            <li
                              style={{ backgroundColor: item?.color?.color }}
                            ></li>
                          </ul>
                        </p>
                      </div>
                    </div>
                    <div className="cart-col-2">
                      <h5 className="price">
                        {item?.price ? item.price.toLocaleString("vi-VN") : 0}₫
                      </h5>
                    </div>
                    <div className="cart-col-3 d-flex align-items-center gap-15">
                      <div>
                        <input
                          className="form-control"
                          type="number"
                          name={"quantity" + item?._id}
                          min={1}
                          max={10}
                          id={"card" + item?._id}
                          value={item?.quantity}
                          onChange={(e) => {
                            setProductupdateDetail({
                              product: {
                                _id: item.product._id,
                                price: item.product.price,
                                quantity: +e.target.value,
                                color: item.color._id,
                              },
                            });
                          }}
                        />
                      </div>
                      <div>
                        <AiFillDelete
                          onClick={() => deleteACartProduct(item?._id)}
                          className="text-danger cursor-pointer"
                          style={{
                            fontSize: "20px",
                            transition: "color 0.3s",
                          }}
                        />
                      </div>
                    </div>
                    <div className="cart-col-4">
                      <h5 className="price">
                        {item?.quantity && item?.price
                          ? (item.quantity * item.price).toLocaleString("vi-VN")
                          : 0}
                        ₫
                      </h5>
                    </div>
                  </div>
                );
              })}
          </div>

          <div className="col-12 py-2 mt-4">
            <div className="d-flex justify-content-between align-items-baseline">
              <Link to="/product" className="button">
                Tiếp tục mua sắm
              </Link>
              <button className="button danger" onClick={deleteAllCartProduct}>
                Hủy đơn hàng
              </button>
              {totalAmount !== null && totalAmount !== 0 && (
                <div className="d-flex flex-column align-items-end">
                  <h4>
                    Tổng hóa đơn:
                    {!userCartState?.length
                      ? 0
                      : totalAmount
                      ? totalAmount.toLocaleString("vi-VN")
                      : 0}
                    ₫
                  </h4>
                  <p>Thuế và phí vận chuyển sẽ được tính khi thanh toán</p>
                  <Link to="/checkout" className="button">
                    Thanh toán
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Cart;
