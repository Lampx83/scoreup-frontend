import cookies from "~/utils/cookies.js";

export function checkRole() {
  const user = cookies.get("user");
  if (!user) return null;

  const email = user.email?.trim(); // dùng trực tiếp
  if (email?.endsWith("@st.neu.edu.vn")) {
    return { role: "user", checkAdmin: false };
  } else {
    return { role: "admin", checkAdmin: true };
  }
}
