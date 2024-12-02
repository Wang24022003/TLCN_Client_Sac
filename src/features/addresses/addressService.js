import instance from "../../utils/axios-customize";

const getProvinces = async () => {
  const response = await instance.get(`address/province`);
  if (response) {
    return response;
  }
};
const getDistricts = async (provinceId) => {
  const response = await instance.get(
    `address/district?idProvince=${provinceId}`
  );
  if (response) {
    return response;
  }
};
const getWards = async (provinceId, districtId) => {
  const response = await instance.get(
    `address/ward?provinceId=${provinceId}&districtId=${districtId}`
  );
  if (response) {
    return response;
  }
};

export const addressService = {
  getProvinces,
  getDistricts,
  getWards,
};
