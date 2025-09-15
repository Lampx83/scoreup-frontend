import axios from "~/config/axios";

// ✅ Lấy danh sách exams
export const getExams = async () => {
  try {
    const res = await axios.get(`/exams`);
    return res?.data;
  } catch (error) {
    console.error(error);
  }
};
