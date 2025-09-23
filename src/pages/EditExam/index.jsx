import { Box, Select, MenuItem, Typography, Button } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { getExamById, updateExam, getSubjects } from "~/services/exam.service";
import { useState, useEffect } from "react";
import ContentExam from "../../components/ContentExam";
import Loading from "~/components/Loading";
import AttachFileIcon from "@mui/icons-material/AttachFile";

export default function EditExam() {
  const { exam_id } = useParams();
  console.log("exam_id param:", exam_id);
  const navigate = useNavigate();

  // State
  const [examId, setExamId] = useState("");
  const [examName, setExamName] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [examTime, setExamTime] = useState("");
  const [notes, setNotes] = useState("");
  const [chapters, setChapters] = useState([]);
  const [file, setFile] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [originalQuestions, setOriginalQuestions] = useState([]);
  const [existingStudentFile, setExistingStudentFile] = useState(null);

  const [fileName, setFileName] = useState("");

  // Fetch exam info
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Lấy danh sách môn học trước
        const subjectsData = await getSubjects();
        setSubjects(subjectsData);

        // 2. Lấy thông tin exam
        const res = await getExamById(exam_id);
        const exam = res.data;
        setFileName(exam.file?.name || exam.file_name || "");
        setExistingStudentFile(exam.file || null); // lưu file cũ

        setExamId(exam.exam_id);
        setExamName(exam.exam_name);
        setStudents(exam.student_list || []);

        // 3. Gán đúng môn thi (match theo tên hoặc ID tuỳ API trả về)
        const sub = subjectsData.find(
          (s) => s.subject_name === exam.subject_name
        );
        setSelectedSubject(sub || null);

        setStartTime(new Date(exam.start_date).toISOString().slice(0, 16));
        setEndTime(new Date(exam.end_date).toISOString().slice(0, 16));
        setExamTime(exam.exam_time);
        setNotes(exam.notes);

        const formattedQuestions = chapters.map((ch) => ({
          chapters: [{ chapter: ch.chapter, numbers: ch.numbers }],
        }));

        // 4. Gán nội dung thi + số câu
        const loadedChapters =
          exam.questions?.flatMap((q) =>
            q.chapters.map((ch) => ({
              chapter: ch.chapter,
              numbers: ch.numbers,
            }))
          ) || [];
        setChapters(loadedChapters);

        // Lưu dữ liệu questions gốc
        setOriginalQuestions(exam.questions || []);
      } catch (err) {
        console.error("Lỗi load exam:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [exam_id]);

  // Update exam
  const handleConfirmUpdateExam = async () => {
    try {
      // 1. Dữ liệu questions: nếu user không chỉnh, dùng dữ liệu gốc
      const validChapters = chapters.filter(
        (ch) => ch.chapter?.trim() && ch.numbers != null
      );
      const formattedQuestions =
        validChapters.length > 0
          ? validChapters.map((ch) => ({
              chapters: [{ chapter: ch.chapter, numbers: Number(ch.numbers) }],
            }))
          : originalQuestions;

      // 2. File sinh viên: nếu user không upload file mớ

      await updateExam(examId, {
        exam_name: examName,
        subject_name: selectedSubject?.subject_name,
        notion_database_id: selectedSubject?.notion_database_id,
        questions: formattedQuestions,
        start_date: new Date(startTime).toISOString(),
        end_date: new Date(endTime).toISOString(),
        exam_time: examTime,
        notes,
        file: file || null,
      });
      alert("Cập nhật ca thi thành công!");
      navigate("/exam");
    } catch (err) {
      console.error("Lỗi update:", err);
      alert("Cập nhật thất bại, vui lòng thử lại!");
    }
  };

  return (
    <Box sx={{ padding: "20px" }}>
      {loading ? (
        <Loading />
      ) : (
        <>
          <Typography variant="h4" fontWeight={600} mb={2}>
            Chỉnh sửa ca thi
          </Typography>

          <Box sx={{ display: "flex", gap: "40px", flexWrap: "wrap" }}>
            {/* Left Column */}
            <Box
              sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}
            >
              <Box>
                <Typography fontWeight={600} mb={1}>
                  Môn thi
                </Typography>
                {subjects.length > 0 ? (
                  <Select
                    value={selectedSubject?._id || ""}
                    onChange={(e) => {
                      const sub = subjects.find(
                        (s) => String(s._id) === String(e.target.value)
                      );
                      setSelectedSubject(sub || null);
                    }}
                    fullWidth
                    sx={{ height: 40 }}
                  >
                    {subjects.map((s) => (
                      <MenuItem key={s._id} value={s._id}>
                        {s.subject_name}
                      </MenuItem>
                    ))}
                  </Select>
                ) : (
                  <Typography color="text.secondary">
                    Đang tải môn thi...
                  </Typography>
                )}
              </Box>

              <Box sx={{ display: "flex", gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography fontWeight={600} mb={1}>
                    Thời gian bắt đầu
                  </Typography>
                  <input
                    type="datetime-local"
                    style={{
                      width: "100%",
                      height: "40px",
                      padding: "5px 15px",
                      fontSize: "14px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                    }}
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography fontWeight={600} mb={1}>
                    Thời gian kết thúc
                  </Typography>
                  <input
                    type="datetime-local"
                    style={{
                      width: "100%",
                      height: "40px",
                      padding: "5px 15px",
                      fontSize: "14px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                    }}
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </Box>
              </Box>

              <Box>
                <Typography fontWeight={600} mb={1}>
                  Thời gian thi (phút)
                </Typography>
                <input
                  type="text"
                  value={examTime}
                  onChange={(e) => setExamTime(e.target.value)}
                  style={{
                    width: "100%",
                    height: "40px",
                    padding: "5px 20px",
                    fontSize: "16px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    backgroundColor: "#ffffffff",
                  }}
                  placeholder="VD: 60"
                />
              </Box>
            </Box>

            {/* Right Column */}
            <Box
              sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}
            >
              <Box>
                <Typography fontWeight={600} mb={1}>
                  Tên ca thi
                </Typography>
                <input
                  type="text"
                  value={examName}
                  onChange={(e) => setExamName(e.target.value)}
                  style={{
                    width: "100%",
                    height: "40px",
                    padding: "5px 20px",
                    fontSize: "16px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                  }}
                />
              </Box>
              <Box>
                <Typography fontWeight={600} mb={1}>
                  Danh sách sinh viên
                </Typography>

                <label htmlFor="upload-student-list">
                  <Box
                    component="span"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      width: "100%",
                      height: 40,
                      paddingX: 1.5,
                      fontSize: "14px",
                      color: "#666",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                      cursor: "pointer",
                      backgroundColor: "#fff",
                      "&:hover": { borderColor: "#999" },
                    }}
                  >
                    <AttachFileIcon fontSize="small" />
                    {file
                      ? file.name // file mới upload
                      : fileName || // file cũ từ API
                        "Tải danh sách sinh viên tham gia ca thi (.xlsx, .csv)"}
                  </Box>
                </label>

                <input
                  accept=".xlsx,.csv"
                  id="upload-student-list"
                  type="file"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const f = e.target.files[0];
                    if (f) {
                      setFile(f); // set file mới
                      setFileName(""); // xóa tên file cũ
                    }
                  }}
                />
              </Box>
              <Box>
                <Typography fontWeight={600} mb={1}>
                  Ghi chú
                </Typography>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  style={{
                    width: "100%",
                    height: "40px",
                    padding: "5px 20px",
                    fontSize: "16px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                  }}
                />
              </Box>
            </Box>
          </Box>

          {/* Questions */}
          <ContentExam
            subject={selectedSubject}
            initialChapters={chapters}
            onChangeChecked={(data) => setChapters(data)}
          />

          {/* Buttons */}
          <Box
            sx={{ display: "flex", gap: 2, mt: 3, justifyContent: "flex-end" }}
          >
            <Button variant="outlined" onClick={() => navigate("/exam")}>
              Hủy
            </Button>
            <Button variant="contained" onClick={handleConfirmUpdateExam}>
              Lưu thay đổi
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}
