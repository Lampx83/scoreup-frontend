import axios from "~/config/axios.js";
import statusCodes from "~/utils/statusCodes.js";
import cookies from "~/utils/cookies.js";
import pushToast from "~/helpers/sonnerToast.js";

const get = async (url, config = {}) => {
  return axios.get(url, config)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      const statusCode = error?.response?.status;
      if (statusCode === statusCodes.UNAUTHORIZED) {
        cookies.remove("token", { path: "/" });
        pushToast(error?.response?.data?.message || "Bạn cần đăng nhập trước!", "error");
      }

      if (statusCode === statusCodes.NOT_FOUND) {
        // pushToast("Lỗi không xác định, vui lòng thử lại sau!", "error");
        pushToast(error?.response?.data?.message || "Lỗi không xác định, vui lòng thử lại sau!", "error");
      }
    });
}

const post = async (url, body = {}, config = {}) => {
  return axios.post(url, body, config)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      const statusCode = error?.response?.status;
      if (statusCode === statusCodes.UNAUTHORIZED) {
        cookies.remove("token", { path: "/" });
        pushToast("Bạn cần đăng nhập trước!", "error");
      }

      if (statusCode === statusCodes.NOT_FOUND) {
        pushToast("Lỗi không xác định, vui lòng thử lại sau!", "error");
      }
    });
}

const getPage = (id) => {
  return get(`/pages/${id}`);
}

export {
  get,
  post,
  getPage
}