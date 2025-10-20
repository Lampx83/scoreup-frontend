import axios from "~/config/axios";
import Cookies from "js-cookie";

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
    return res.data.metadata; // dữ liệu trả về từ BE
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return [];
  }
};

export const updateCreateExam = async ({
  student_list,
  exam_name,
  subject_name,
  notion_database_id,
  questions,
  start_date,
  end_date,
  exam_time,
  file,
  notes,
  status,
}) => {
  const formData = new FormData();
  const rawUser = Cookies.get("user");
  let author = "Unknown";
  if (rawUser) {
    try {
      const user = JSON.parse(rawUser);
      author = user.fullName || "Unknown";
    } catch (e) {
      console.error("Không parse được cookie user:", e);
    }
  }

  if (file) {
    formData.append("student_list", file);
    formData.append("file_name", file.name);
  } else if (student_list) {
    formData.append("student_list", JSON.stringify(student_list));
  }

  formData.append("subject_name", subject_name); // tên môn thi
  formData.append("exam_name", exam_name); //Tên kì thi
  formData.append("notion_database_id", notion_database_id);
  formData.append("start_date", start_date);
  formData.append("end_date", end_date);
  formData.append("exam_time", exam_time);
  formData.append("notes", notes);
  formData.append("author", author);
  formData.append("status", status);
  const formattedQuestions = Array.isArray(questions)
    ? questions.map((q) => ({
        chapters: [
          {
            chapter: q.chapter,
            numbers: q.numbers,
          },
        ],
      }))
    : [];

  formData.append("questions", JSON.stringify(formattedQuestions));
  console.log(" FormData gửi đi:", [...formData.entries()]);

  try {
    const res = await axios.post("/exams/create-exam", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    console.log("Trạng thái tạo và message:", res.data);
    return res.data;
  } catch (err) {
    console.error(" Tạo ca thi thất bại:", err.response?.data || err.message);
    throw err; // ném lại lỗi cho FE xử lý (ví dụ hiển thị alert)
  }
};

export const deleteExam = (exam_id) => {
  console.log("Đang gọi API delete với id:", exam_id);
  return axios.delete(`/exams/${exam_id}`);
};

export const updateExamStatus = async (exam_id, status) => {
  return axios.patch(`/exams/${exam_id}/status`, { status });
};

// Lấy chi tiết exam theo ID
export const getExamById = async (exam_id) => {
  try {
    const token = localStorage.getItem("accessToken");

    const res = await axios.get(`/exams`, {
      params: { exam_id },
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log(" Kết quả API getExamById:", res.data);
    return res.data;
  } catch (error) {
    console.error(" Lỗi lấy chi tiết exam:", error);
    throw error;
  }
};
export const updateExam = async (examId, data) => {
  try {
    const res = await axios.put(`/exams/update-exam/${examId}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (error) {
    console.error(" API update exam error:", error);
    throw error;
  }
};
