import axiosClient from "./axiosClient";

const postApi = {
  // trong 1 dự án không nhất thiết phải đầy đủ tất cả các
  // phương thức dưới.
  getAll(params) {
    const url = "/posts";
    return axiosClient.get(url, { params });
  },

  getById(id) {
    const url = `/posts/${id}`;
    return axiosClient.get(url);
  },
  add(data) {
    const url = "/posts";
    return axiosClient.post(url, data);
  },
  update(data) {
    const url = `/posts/${data.id}`;
    return patch(url, data);
  },
  remore(id) {
    const url = `/posts/${id}`;
    return axiosClient.delete(url);
  },
};

export default postApi;
