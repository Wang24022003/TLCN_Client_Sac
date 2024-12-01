import instance from "../../utils/axios-customize";

const getBlogs = async () => {
  const response = await instance.get(`blog`);
  if (response) {
    return response;
  }
};

const getBlog = async (id) => {
  const response = await instance.get(`blog/${id}`);
  if (response) {
    return response;
  }
};

export const blogService = {
  getBlogs,
  getBlog,
};
