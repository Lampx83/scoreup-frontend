import {post} from "~/utils/request.js";

const login = async (data) => {
  return post('/auth/login', data);
}

export default {
  login
}