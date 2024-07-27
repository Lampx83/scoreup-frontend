import * as request from '~/utils/request.js';
import cookies from "~/utils/cookies.js";

export const getUser = async () => {
  const res = await request.get(`/user/info`);
  cookies.set("user", JSON.stringify(res.metadata), { path: "/" });
  return res.metadata;
}