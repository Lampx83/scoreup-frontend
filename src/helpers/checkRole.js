import cookies from "~/utils/cookies.js";

export function checkRole() {
  const user = cookies.get("user");
  if (!user) return null;

  const email = user.email?.trim(); // dùng trực tiếp
  if (email?.endsWith("@st.neu.edu.vn")) {
    return {
      role: "user",
      checkAdmin: false,
      student_id: email.substring(0, 8), // 👈 lấy 8 ký tự đầu
    };
  } else {
    return {
      role: "admin",
      checkAdmin: true,
      student_id: null, // admin thì không cần student_id
    };
  }
}
