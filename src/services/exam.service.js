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
  student_list,
  class_id,
  subjects_id,
  subjects_name,
  notion_database_id,
  questions,
  start_date,
  end_date,
  exam_time,
  file,
}) => {
  const formData = new FormData();

  // Thêm file
  if (file) {
    formData.append("student_list", file);
  } else if (student_list) {
    formData.append("student_list", JSON.stringify(student_list));
  }

  formData.append("class_id", class_id);
  formData.append("subjects_id", subjects_id);
  formData.append("subjects_name", subjects_name); // thêm tên môn
  formData.append("notion_database_id", notion_database_id || "");
  formData.append("questions", JSON.stringify(questions));
  formData.append("start_date", start_date);
  formData.append("end_date", end_date);
  formData.append("exam_time", exam_time);

  // ===== Console.log body =====
  console.log("POST body:");
  for (let [key, value] of formData.entries()) {
    console.log(key, value);
  }

  const res = await axios.post("/exams/create-exam", formData);

  return res.data;
};
