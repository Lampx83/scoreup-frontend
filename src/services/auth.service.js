import { post } from "~/utils/request.js";
import { toast } from "sonner";
import cookies from "~/utils/cookies.js";
import { getUser } from "~/services/user.service.js";
import pushToast from "~/helpers/sonnerToast.js";

const login = async (data) => {
  const res = await post("/auth/login", data);

  if (res.status === "ERROR") {
    cookies.remove("token", { path: "/" });
    cookies.remove("user");
    toast.error(res.message);
    return false;
  }

  if (res.statusCode === 200) {
    toast.success("Đăng nhập thành công!");
    cookies.set("token", res.metadata.token, { path: "/" });
    cookies.set("user", JSON.stringify(await getUser()), { path: "/" });
    return true;
  }
  return false;
};

const register = async (data) => {
  const res = await post("/auth/register", data);

  if (res.status === "ERROR") {
    toast.error(res.message);
    return false;
  }

  if (res.statusCode === 201) {
    toast.success("Đăng ký thành công!");
    cookies.set("token", res.metadata.token, { path: "/" });
    cookies.set("user", JSON.stringify(await getUser()));
    return true;
  }
  return false;
};

const forgotPassword = async ({ email }) => {
  const res = await post("/auth/forgot-password", { email });

  if (res.status === "ERROR") {
    toast.error(res.message);
    return false;
  }

  if (res.statusCode === 200) {
    toast.success("Gửi mã OTP thành công, Vui lòng kiểm tra email của bạn!");
    return res;
  }

  return false;
};

const verifyOtpForgotPassword = async ({ email, otp }) => {
  const res = await post("/auth/forgot-password/verify", {
    email,
    otp,
  });

  if (res.status === "ERROR") {
    toast.error(res.message);
    return false;
  }

  if (res.statusCode === 200) {
    toast.success("Xác thực OTP thành công!");
    return res;
  }

  return false;
};

const resetPassword = async ({ email, password, token }) => {
  const res = await post("/auth/forgot-password/reset", {
    email,
    password,
    token,
  });

  if (res.status === "ERROR") {
    toast.error(res.message);
    return false;
  }

  if (res.statusCode === 200) {
    toast.success("Đổi mật khẩu thành công!");
    return res;
  }

  return false;
};

const loginWithMicrosoft = async (data) => {
  // Support both access token and authorization code approaches
  const endpoint = "/auth/microsoft/code";
  const res = await post(endpoint, data);

  if (res.status === "ERROR") {
    cookies.remove("token", { path: "/" });
    cookies.remove("user");
    toast.error(res.message);
    return false;
  }

  if (res.statusCode === 200) {
    toast.success("Đăng nhập Microsoft thành công!");
    cookies.set("token", res.metadata.token, { path: "/" });
    cookies.set("user", JSON.stringify(await getUser()), { path: "/" });
    return true;
  }
  return false;
};

export default {
  login,
  register,
  forgotPassword,
  verifyOtpForgotPassword,
  resetPassword,
  loginWithMicrosoft,
};
