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
