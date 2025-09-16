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

// Hàm gọi API lấy danh sách môn học
export const getSubjects = async () => {
  try {
    const res = await axios.get("/app/subjects");
    // BE endpoint: GET /subjects
    return res.data.metadata; // dữ liệu trả về từ BE
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return [];
  }
};

export const updateCreateExam = async ({
  file,
  class_id,
  subjects_id,
  notion_database_id,
  questions,
  start_date,
  end_date,
  exam_time,
}) => {
  const formData = new FormData();

  // Thêm file
  if (file) {
    formData.append("student_list", file); // tên field theo BE yêu cầu
  }

  // Thêm các trường khác
  formData.append("class_id", class_id);
  formData.append("subjects_id", subjects_id);
  formData.append("notion_database_id", notion_database_id || "");
  formData.append("questions", JSON.stringify(questions)); // nếu BE nhận array dạng string
  formData.append("start_date", start_date);
  formData.append("end_date", end_date);
  formData.append("exam_time", exam_time);

  const res = await axios.post("/exams/create-exam", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data; // trả về dữ liệu từ BE
};
