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
  notion_database_id,
  questions,
  start_date,
  end_date,
  exam_time,
}) => {
  const res = await axios.post(
    "/exams/create-exam",
    {
      student_list,
      class_id,
      subjects_id,
      notion_database_id,
      questions,
      start_date,
      end_date,
      exam_time,
    },
    { headers: { "Content-Type": "multipart/form-data" } }
  );
};

