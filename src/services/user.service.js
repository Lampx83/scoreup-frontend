import * as request from '~/utils/request.js';
import cookies from "~/utils/cookies.js";

export const getUser = async () => {
  const res = await request.get(`/user/info`);
  cookies.set("user", JSON.stringify(res.metadata), { path: "/" });
  return res.metadata;
}

export const updateUser = async ({
  avatar = undefined,
  birth = undefined,
  className = undefined,
  email = undefined,
  fullName = undefined,
  gender = undefined,
  major = undefined,
  school = undefined,
  oldPassword = undefined,
  newPassword = undefined
}) => {
  const res = await request.patch(`/user/edit`, {
    avatar,
    birth,
    className,
    email,
    fullName,
    gender,
    major,
    school,
    oldPassword,
    newPassword
  }, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

  await getUser();
  return res.metadata;
}