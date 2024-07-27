import {post} from "~/utils/request.js";
import {toast} from "sonner";
import cookies from "~/utils/cookies.js";
import {getUser} from "~/services/user.service.js";

const login = async (data) => {
  const res = await post('/auth/login', data);

  if (res.status === 'ERROR') {
    toast.error(res.message);
    return false;
  }

  if (res.statusCode === 200) {
    toast.success("Đăng nhập thành công!");
    cookies.set("token", res.metadata.token, {path: "/"});
    cookies.set("user", JSON.stringify(await getUser()));
    return true;
  }
  return false;
}

const register = async (data) => {
  const res = await post('/auth/register', data);

  if (res.status === 'ERROR') {
    toast.error(res.message);
    return false;
  }

  if (res.statusCode === 201) {
    toast.success("Đăng ký thành công!");
    cookies.set("token", res.metadata.token, {path: "/"});
    cookies.set("user", JSON.stringify(await getUser()));
    return true;
  }
  return false;
}

export default {
  login,
  register
}