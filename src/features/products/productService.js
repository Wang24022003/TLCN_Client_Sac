import axios from "axios";
import { base_url, config } from "../../utils/axiosConfig";
import instance from "../../utils/axios-customize";
const getProducts = async (query = "") => {
  query += '&populate=category'
  const response = await instance.get(`products?${query}`);
  return response;
};

const getSingleProduct = async (id) => {
  const response = await instance.get(`products/${id}`);
  if (response) {
    return response;
  }
};
const getSingleProductForUser = async (id) => {
  const response = await instance.get(`products/user/${id}`);
  if (response) {
    return response;
  }
};

const addToWishlist = async (prodId) => {
  const response = await instance.post(`like-products/add`, prodId);
  if (response) {
    return response;
  }
};
const removeToWishlist = async (prodId) => {
  const response = await instance.delete(`like-products/${prodId}`);
  if (response) {
    return response;
  }
};

const rateProduct = async (data) => {
  const response = await instance.post(`reviews`, data);
  if (response) {
    return response;
  }
};

const updateOrder = async (data) => {
  const response = await instance.put(
    `${base_url}user/updateOrder/${data.id}`,
    { status: data.status },
    config
  );

  return response;
};

export const productSevice = {
  getProducts,
  addToWishlist,
  getSingleProduct,
  rateProduct,
  updateOrder,
  removeToWishlist,
  getSingleProductForUser,
};
