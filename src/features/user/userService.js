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
  const response = await instance.get(`like-products/user`);
  if (response) {
    return response;
  }
};

const getUserHistory = async () => {
  const response = await instance.get(`products/product/purchased`);
  if (response) {
    return response;
  }
};

const addToCart = async (cartData) => {
  const response = await instance.post(`carts/add`, cartData);
  if (response) {
    return response;
  }
};

const getCart = async () => {
  const response = await instance.get(`carts/user`);
  if (response) {
    return response;
  }
};

const getCoupounUser = async (idUser) => {
  const response = await instance.get(`users/coupon/${idUser}`);
  if (response) {
    return response;
  }
};

const getCouponById  = async (id) => {
  const response = await instance.get(`coupons/${id}`);
  if (response) {
    return response;
  }
};


const removeProductFromCart = async (data) => {
  const response = await instance.delete(
    `carts/${data}`,

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
  const response = await instance.post(`carts/update`, cartDetail);
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
  const response = await instance.get(`receipts/user`);

  if (response) {
    return response;
  }
};

const updateUser = async (data) => {
  const response = await instance.patch(`auth/update-profile`, data);

  if (response) {
    return response;
  }
};
const getNewInfoUser = async () => {
  const response = await instance.get(`auth/refresh`);

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

const emptyCart = async () => {
  const response = await instance.post(`carts/remove-all`);

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

const getAddressUser = async (query = "") => {
  const response = await instance.get(`/address-user?${query}`);
  if (response) {
    return response;
  }
};
const deleteAddressUser = async (id) => {
  const response = await instance.delete(`/address-user/user/remove/${id}`);
  if (response) {
    return response;
  }
};
const setDefaultAddressUser = async (id) => {
  const response = await instance.patch(`/address-user/user/default/${id}`);
  if (response) {
    return response;
  }
};
const createAddressUser = async (data) => {
  const response = await instance.post(`/address-user`, data);
  if (response) {
    return response;
  }
};
const updateAddressUser = async (data) => {
  const response = await instance.patch(`/address-user/user`, data);
  if (response) {
    return response;
  }
};
const getAddressUserDetail = async (id) => {
  const response = await instance.get(`address-user/user/${id}`);
  if (response) {
    return response;
  }
};
const getProductUserRecentView = async () => {
  const response = await instance.get(`products/product/recent`);
  if (response) {
    return response;
  }
};

const chatbot = async (chatbotData) => {
  const response = await instance.post(`chat-ai`, chatbotData);
  return response;
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
  getAddressUser,
  deleteAddressUser,
  setDefaultAddressUser,
  createAddressUser,
  updateAddressUser,
  getAddressUserDetail,
  paymentVerification,
  getProductUserRecentView,
  getNewInfoUser,
  chatbot,
  getCoupounUser,
  getCouponById, 
};
