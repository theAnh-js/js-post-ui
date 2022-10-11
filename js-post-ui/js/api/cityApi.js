import axiosClient from "./axiosClient";

const cityApi = {
  // trong 1 dự án không nhất thiết phải đầy đủ tất cả các
  // phương thức dưới.
  getAll(params) {
    const url = "/cities";
    return axiosClient.get(url, { params });
  },

  getById(id) {
    const url = `/cities/${id}`;
    return axiosClient.get(url);
  },
  add(data) {
    const url = "/cities";
    return axiosClient.post(url, data);
  },
  update(data) {
    const url = `/cities/${data.id}`;
    return patch(url, data);
  },
  remore(id) {
    const url = `/cities/${id}`;
    return axiosClient.delete(url);
  },
};

export default cityApi;
