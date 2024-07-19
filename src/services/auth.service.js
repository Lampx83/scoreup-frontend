import {post} from "~/utils/request.js";

const login = async (data) => {
  return post('/auth/login', data);
}

const register = async (data) => {
  return post('/auth/register', data);
}

export default {
  login,
  register
}