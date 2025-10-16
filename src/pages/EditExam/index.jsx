import {
  Box,
  Select,
  MenuItem,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { getExamById, updateExam, getSubjects } from "~/services/exam.service";
import { useState, useEffect } from "react";
import ContentExam from "../../components/ContentExam";
import Loading from "~/components/Loading";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { useMemo } from "react";
import { validateCreateExam } from "~/helpers/validateCreateExam";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import IosShareIcon from "@mui/icons-material/IosShare";
import StickyNote2OutlinedIcon from "@mui/icons-material/StickyNote2Outlined";

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
  const [studentList, setStudentList] = useState([]);

  const [fileName, setFileName] = useState("");
  const [examData, setExamData] = useState(null);
  const [open, setOpen] = useState(false);

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
        setFileName(exam.file_name || "");
        setExistingStudentFile(exam.file_name || null); // lưu file cũ

        setExamId(exam.exam_id);
        setExamName(exam.exam_name);
        setStudentList(exam.student_list || []);
        setExamData(exam);

        const sub = subjectsData.find(
          (s) => s.subject_name === exam.subject_name
        );
        setSelectedSubject(sub || null);

        const formatDateTimeLocal = (dateStr) => {
          if (!dateStr) return "";
          const date = new Date(dateStr);
          const pad = (n) => (n < 10 ? "0" + n : n);
          return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
            date.getDate()
          )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
        };

        setStartTime(formatDateTimeLocal(exam.start_date));
        setEndTime(formatDateTimeLocal(exam.end_date));
        setExamTime(exam.exam_time);
        setNotes(exam.notes);

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
      const errors = validateCreateExam({
        examName,
        selectedSubject,
        startTime,
        endTime,
        examTime,
        file,
        checkedChapters: chapters,
        isEditing: true,
      });
      console.log("Validate errors:", errors);
      const status = errors.length > 0 ? "draft" : "ready";

      if (errors.length > 0) {
        alert(
          "Một số trường còn thiếu, ca thi sẽ được lưu ở trạng thái soạn thảo (draft).\n\nThiếu: " +
            errors.join(", ")
        );
      }
      const formData = new FormData();
      if (file) {
        formData.append("student_list", file);
        formData.append("file_name", file.name);
      } else if (fileName) {
        formData.append("file_name", fileName);
      }
      formData.append("exam_name", examName);
      formData.append("subject_name", selectedSubject?.subject_name);
      formData.append(
        "notion_database_id",
        selectedSubject?.notion_database_id
      );
      if (startTime) {
        formData.append("start_date", new Date(startTime).toISOString());
      } else if (examData?.start_date) {
        formData.append("start_date", examData.start_date);
      }

      if (endTime) {
        formData.append("end_date", new Date(endTime).toISOString());
      } else if (examData?.end_date) {
        formData.append("end_date", examData.end_date);
      }
      formData.append("exam_time", Number(examTime));
      formData.append("notes", notes);
      formData.append("status", status);

      const formattedQuestions =
        chapters.length > 0
          ? chapters.map((ch) => ({
              chapters: [{ chapter: ch.chapter, numbers: ch.numbers }],
            }))
          : [];

      formData.append("questions", JSON.stringify(formattedQuestions));

      await updateExam(examId, formData);

      alert("Cập nhật ca thi thành công!");
      navigate("/exam");
    } catch (err) {
      console.error("Lỗi update:", err);
      alert("Cập nhật thất bại, vui lòng thử lại!");
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  const handleRemove = () => {
    setFile(null);
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
                    value={startTime ?? ""}
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
                    value={endTime ?? ""}
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
                  value={examTime ?? ""}
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
                  value={examName ?? ""}
                  onChange={(e) => setExamName(e.target.value)}
                  style={{
                    width: "100%",
                    height: "40px",
                    padding: "5px 20px",
                    fontSize: "16px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                  }}
                  placeholder="VD: Thi giữa kì CSLT lớp 03,..."
                />
              </Box>
              <Box>
                <Typography fontWeight={600} mb={1}>
                  Danh sách sinh viên
                </Typography>
                <Box
                  component="span"
                  onClick={() => setOpen(true)}
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
                    ? file.name
                    : fileName ||
                      "Tải danh sách sinh viên tham gia ca thi (.xlsx, .csv)"}
                </Box>
              </Box>
              <Dialog
                open={open}
                onClose={() => setOpen(false)}
                maxWidth="sm"
                fullWidth
              >
                <DialogTitle>
                  Tải lên danh sách sinh viên tham gia thi
                </DialogTitle>
                <DialogContent>
                  <a
                    href={`${import.meta.env.BASE_URL}DanhSachLop_TTTT1138125.xlsx`}
                    style={{ textDecoration: "none" }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        color: "#123663FF",
                        cursor: "pointer",
                        "&:hover": { textDecoration: "underline" },
                      }}
                    >
                      <ArrowDownwardIcon fontSize="small" />
                      <Typography fontSize={14}>
                        Tải xuống mẫu danh sách sinh viên
                      </Typography>
                    </Box>
                  </a>

                  <Box
                    sx={{
                      border: "2px dashed #ccc",
                      borderRadius: "8px",
                      mt: 2,
                      p: 4,
                      textAlign: "center",
                      color: "#666",
                    }}
                  >
                    <input
                      accept=".xlsx,.csv"
                      type="file"
                      id="file-upload"
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />
                    <label htmlFor="file-upload">
                      <Box sx={{ cursor: "pointer" }}>
                        <IosShareIcon fontSize="large"></IosShareIcon>
                        <Typography>
                          Thả tệp tại đây hoặc bấm nút chọn tệp
                        </Typography>
                        <Typography fontSize={13}>
                          Định dạng hỗ trợ: .xlsx, .csv
                        </Typography>
                      </Box>

                      <Button
                        variant="contained"
                        sx={{ mt: 2, background: "#123663FF" }}
                        component="span"
                        htmlFor="file-upload"
                      >
                        Tải lên
                      </Button>
                    </label>
                  </Box>
                  <Typography fontWeight={700} mt={1}>
                    Danh sách đã tải lên
                  </Typography>
                  {file && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mt: 2,
                        p: 1.5,
                        border: "1px solid #ccc",
                        borderRadius: "6px",
                      }}
                    >
                      <StickyNote2OutlinedIcon fontSize="medium" />
                      <Typography sx={{ flex: 1 }}>{file.name}</Typography>
                      <IconButton
                        size="small"
                        sx={{
                          border: "1px solid #ccc",
                          borderRadius: "8px",
                          width: 30,
                          height: 25,
                        }}
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton size="small" onClick={handleRemove}>
                        <DeleteIcon
                          sx={{
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                            width: 30,
                            height: 25,
                          }}
                          color="error"
                        />
                      </IconButton>
                    </Box>
                  )}
                </DialogContent>
              </Dialog>
              <Box>
                <Typography fontWeight={600} mb={1}>
                  Ghi chú
                </Typography>
                <input
                  type="text"
                  value={notes ?? ""}
                  onChange={(e) => setNotes(e.target.value)}
                  style={{
                    width: "100%",
                    height: "40px",
                    padding: "5px 20px",
                    fontSize: "16px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                  }}
                  placeholder="Lớp CSLT02,..."
                />
              </Box>
            </Box>
          </Box>

          <ContentExam
            subject={selectedSubject}
            initialChapters={chapters}
            onChangeChecked={(data) => setChapters(data)}
          />

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
