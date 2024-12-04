import instance from "./axios-customize";

export const getAddressDefaultUser = () => {
  return instance.get("address-user/user/default-address");
};
export const getCoupounUserAccept = (idUser) => {
  return instance.get(`users/coupon/${idUser}`);
};
export const createReceitpUser = (data) => {
  return instance.post(`receipts`, data);
};
export const getRatingsUser = (id) => {
  return instance.get(`reviews?productId=${id}`);
};
export const uploadImg = async (data) => {
  const formData = new FormData();
  formData.append("files", data);
  const response = await instance.patch(`files/files`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};
