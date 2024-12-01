import axios from "axios";
import { base_url, config } from "../../utils/axiosConfig";
import instance from "../../utils/axios-customize";
const getProducts = async (query = "") => {
  const response = await instance.get(`products?${query}`);
  return response;
};

const getSingleProduct = async (id) => {
  const response = await instance.get(`products/${id}`);
  if (response) {
    return response;
  }
};

const addToWishlist = async (prodId) => {
  const response = await instance.put(
    `${base_url}product/Wishlist`,
    { prodId },
    config
  );
  if (response) {
    return response;
  }
};

const rateProduct = async (data) => {
  const response = await instance.put(
    `${base_url}product/rating`,
    data,
    config
  );
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
};
