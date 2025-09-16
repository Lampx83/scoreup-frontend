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

  formData.append("student_list", student_list); // file
  formData.append("class_id", class_id);
  formData.append("subjects_id", subjects_id);
  formData.append("notion_database_id", notion_database_id);
  formData.append("questions", JSON.stringify(questions)); // array thì stringify
  formData.append("start_date", start_date);
  formData.append("end_date", end_date);
  formData.append("exam_time", exam_time);

  console.log("📦 FormData gửi đi:", [...formData.entries()]);

  try {
    const res = await axios.post("/exams/create-exam", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    console.log("Trạng thái tạo và message:", res.data);
    return res.data;
  } catch (err) {
    console.error("❌ Tạo ca thi thất bại:", err.response?.data || err.message);
    throw err; // ném lại lỗi cho FE xử lý (ví dụ hiển thị alert)
  }
};
