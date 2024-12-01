import axios from "axios";
import { base_url, config } from "../../utils/axiosConfig";
import instance from "../../utils/axios-customize";
const register = async (userData) => {
  const response = await instance.post(`auth/register`, userData);
  if (response) {
    return response;
  }
};

const active_account = async (userData) => {
  const response = await instance.post(`auth/retry-active`, userData);
  if (response) {
    return response;
  }
};

const check_active_account = async (userData) => {
  const response = await instance.post(`auth/check-code`, userData);
  if (response) {
    return response;
  }
};

const login = async (userData) => {
  const response = await instance.post(`auth/login`, userData);
  return response;
};
const logoutApi = async () => {
  const response = await instance.post(`auth/logout`);
  return response;
};

const getUserWislist = async () => {
  const response = await instance.get(`user/wishlist`, config);
  if (response) {
    return response;
  }
};

const getUserHistory = async (Data) => {
  const response = await instance.post(`product/purchased`, Data);
  if (response) {
    return response;
  }
};

const addToCart = async (cartData) => {
  const response = await instance.post(`user/cart`, cartData, config);
  if (response) {
    return response;
  }
};

const getCart = async (data) => {
  const response = await instance.get(`user/cart`, data);
  if (response) {
    return response;
  }
};

const removeProductFromCart = async (data) => {
  const response = await instance.delete(
    `user/delete-product-cart/${data.id}`,

    data.config2,
    {
      headers: {
        "ngrok-skip-browser-warning": "69420",
      },
    }
  );
  if (response) {
    return response;
  }
};

const updateProductFromCart = async (cartDetail) => {
  const response = await instance.delete(
    `user/update-product-cart/${cartDetail.cartItemId}/${cartDetail.quantity}`,
    config
  );
  if (response) {
    return response;
  }
};

const createOrder = async (orderDetail) => {
  const response = await instance.post(
    `user/cart/create-order/`,
    orderDetail,
    config
  );
  if (response) {
    return response;
  }
};

const getUserOrders = async () => {
  const response = await instance.get(`user/getmyorders`, config);

  if (response) {
    return response;
  }
};

const updateUser = async (data) => {
  const response = await instance.put(
    `user/edit-user`,
    data,
    data.config2,
    config
  );

  if (response) {
    return response;
  }
};

const forgotPasswordToken = async (data) => {
  const response = await instance.post(`user/forgot-password-token`, data, {
    headers: {
      "ngrok-skip-browser-warning": "69420",
    },
  });

  if (response) {
    return response;
  }
};

const resetPass = async (data) => {
  const response = await instance.put(`user/reset-password/${data.token}`, {
    password: data?.password,
  });

  if (response) {
    return response;
  }
};

const emptyCart = async (data) => {
  const response = await instance.delete(`user/empty-cart`, data);

  if (response) {
    return response;
  }
};

const paymentVerification = async (params) => {
  const response = await instance.post(
    `user/order/paymentVerification`,
    {},
    {
      ...config,
      params,
    }
  );

  if (response) {
    return response;
  }
};

export const authService = {
  register,
  active_account,
  check_active_account,
  login,
  logoutApi,
  getUserWislist,
  getUserHistory,
  addToCart,
  getCart,
  removeProductFromCart,
  updateProductFromCart,
  createOrder,
  getUserOrders,
  updateUser,
  forgotPasswordToken,
  resetPass,
  emptyCart,
  paymentVerification,
};