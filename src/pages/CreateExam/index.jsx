import {
  Box,
  Select,
  MenuItem,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { useState, useEffect } from "react";
import ContentExam from "../../components/ContentExam";
import SadIcon from "../../assets/images/sad.svg";
import DetectiveIcon from "../../assets/images/detectiveCat.png";
import ExcellentIcon from "../../assets/images/excellent.svg";
import { Link } from "react-router-dom";
import { checkRole } from "~/helpers/checkRole";

import { getSubjects, updateCreateExam } from "~/services/exam.service.js";
import { validateCreateExam } from "~/helpers/validateCreateExam.js";

export default function CreateExam() {
  const [file, setFile] = useState(null);
  const [examTime, setExamTime] = useState("");
  const [openCancel, setOpenCancel] = useState(false);
  const [openCreateExam, setOpenCreateExam] = useState(false);
  const [openSucess, setOpenSuccess] = useState(false);
  const role = checkRole()?.checkAdmin;

  const [subjects, setSubjects] = useState([]);

  const [chapters, setChapters] = useState([]);
  const [classId, setClassId] = useState(""); // mã học phần
  const [classSectionId, setClassSectionId] = useState(""); // mã học phần

  const [subjectId, setSubjectId] = useState("");
  const [startTime, setStartTime] = useState(""); //time bắt đầu
  const [endTime, setEndTime] = useState(""); //time kết thúc

  useEffect(() => {
    const fetchSubjects = async () => {
      const res = await getSubjects();
      setSubjects(res || []);
    };
    fetchSubjects();
  }, [subjectId]);

  //Hủy
  const handleCancel = () => {
    setOpenCancel(true);
  };
  const handleConfirmCancel = () => {
    setOpenCancel(false);
    console.log("Đã hủy tạo ca thi");
  };

  //Tạo ca thi
  const handleCreateExam = () => {
    setOpenCreateExam(true);
    console.l;
  };

  const handleConfirmCreateExam = async () => {
    const errors = validateCreateExam({
      classId,
      classSectionId,
      subjectId,
      startTime,
      endTime,
      examTime,
      file,
      checkedChapters: chapters,
    });

    if (errors.length > 0) {
      alert(`Vui lòng điền đầy đủ các trường sau:\n- ${errors.join("\n- ")}`);
      return;
    }
    setOpenCreateExam(false);

    try {
      // Tạo FormData giống như updateCreateExam
      const formData = new FormData();
      if (file) {
        formData.append("student_list", file);
      }
      formData.append("class_id", classId);
      formData.append("subjects_id", subjectId);
      formData.append("notion_database_id", "");
      formData.append("questions", JSON.stringify(chapters));
      formData.append("start_date", startTime);
      formData.append("end_date", endTime);
      formData.append("exam_time", examTime);

      // ==== LOG BODY =====
      console.log("POST body:");
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(key, value.name, value.size, value.type);
        } else {
          console.log(key, value);
        }
      }

      const res = await updateCreateExam({
        file,
        class_id: classId,
        subjects_id: subjectId,
        notion_database_id: "",
        questions: chapters,
        start_date: startTime,
        end_date: endTime,
        exam_time: examTime,
      });

      console.log("Đã tạo ca thi thành công", res);
      setOpenSuccess(true);
      localStorage.setItem("lastExamId", res?.exam_id || "mock_exam_123");
    } catch (err) {
      console.error("Tạo ca thi thất bại", err);
    }
  };

  //Hoàn tất

  const handleConfirmSuccess = () => {
    setOpenSuccess(false);
    alert("Đã sao chép đường liên kết");

    // copy link vào clipboard
    navigator.clipboard.writeText(window.location.origin + "/exam");
  };
  return (
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h4" fontWeight={600} mb={2}>
        Tạo ca thi
      </Typography>
      <Box
        sx={{
          display: "flex",
          gap: "40px",
          flexDirection: "row",
          flexWrap: "wrap",
          width: "100%",
        }}
      >
        {/* Left Column */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            flex: 1,
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              gap: 3, // dùng số (theme spacing) thay vì %
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography fontWeight={600} mb={1}>
                Mã học phần
              </Typography>
              <input
                type="text"
                style={{
                  width: "100%",
                  height: "40px",
                  padding: "5px 20px",
                  fontSize: "16px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
                placeholder="Nhập mã học phần (VD: CNTT1117(125)"
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography fontWeight={600} mb={1}>
                Mã số lớp học phần
              </Typography>
              <input
                type="text"
                style={{
                  width: "100%",
                  height: "40px",
                  padding: "5px 20px",
                  fontSize: "16px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
                value={classSectionId}
                onChange={(e) => setClassSectionId(e.target.value)}
                placeholder="Nhập mã số lớp học phần (VD: 03)"
              />
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              gap: 3, // dùng số (theme spacing) thay vì %
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography fontWeight={600} mb={1}>
                Thời gian bắt đầu
              </Typography>
              <input
                type="datetime-local"
                style={{
                  width: "100%", // full parent width
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
        </Box>

        {/* Right Column */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            flex: 1,
          }}
        >
          <Box>
            <Typography fontWeight={600} mb={1}>
              Môn thi
            </Typography>
            {subjects.length > 0 ? (
              <Select
                value={String(subjectId) || ""}
                onChange={(e) => setSubjectId(e.target.value)}
                displayEmpty
                fullWidth
                sx={{
                  height: 40,
                  borderRadius: "6px",
                  backgroundColor: "#f9f9f9",
                  "& fieldset": {
                    borderColor: "#ccc !important",
                  },
                  "&:hover fieldset": {
                    borderColor: "#888 !important",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "rgba(102,51,255,0.6) !important", // viền tím như ảnh
                  },
                }}
                renderValue={(selected) => {
                  if (!selected)
                    return <span style={{ color: "#999" }}>Chọn môn thi</span>;
                  const subject = subjects.find(
                    (s) => String(s._id) === selected
                  );
                  return subject?.subject_name || selected;
                }}
              >
                <MenuItem key="placeholder" value="" disabled>
                  Chọn môn thi
                </MenuItem>
                {subjects.map((s) => (
                  <MenuItem key={s._id} value={String(s._id)}>
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
          <Box>
            <Typography fontWeight={600} mb={1}>
              Danh sách sinh viên
            </Typography>

            <input
              accept=".xlsx,.csv"
              id="upload-student-list"
              type="file"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])}
            />
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
                  backgroundColor: "#f9f9f9",
                  "&:hover": { borderColor: "#999" },
                }}
              >
                <AttachFileIcon fontSize="small" />
                {file
                  ? file.name
                  : "Tải danh sách sinh viên tham gia ca thi (.xlsx, .csv)"}
              </Box>
            </label>
          </Box>
          <Box>
            <Typography fontWeight={600} mb={1}>
              Thời gian thi
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
                backgroundColor: "#f9f9f9",
              }}
              placeholder="Nhập thời gian thi (phút)"
            />
          </Box>
        </Box>
      </Box>
      <ContentExam
        subjectId={subjectId}
        onChangeChecked={(data) => setChapters(data)}
      />
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 5,
          justifyContent: "flex-end",
        }}
      >
        <Button
          variant="contained"
          onClick={handleCancel}
          sx={{
            backgroundColor: "#DE3B40FF",
            borderRadius: 25,
            color: "white",
            width: 125,
            height: 40,
            fontWeight: 600,
            ":hover": {
              backgroundColor: "#C12126FF",
            },
          }}
        >
          Hủy
        </Button>

        <Dialog
          open={openCancel}
          onClose={() => setOpenCancel(false)}
          PaperProps={{
            sx: {
              borderRadius: "16px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
              padding: 3,
              minWidth: "30%",
              maxWidth: "50%",
              position: "relative",
              overflow: "visible",
              margin: "auto",
            },
          }}
        >
          <img
            src={SadIcon}
            alt=""
            style={{
              width: "40%",
              position: "absolute",
              left: "-30%",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          />
          <Box>
            <DialogTitle sx={{ color: "red", textAlign: "center" }}>
              Bạn có chắc muốn hủy tạo ca thi?
            </DialogTitle>
            <DialogContent
              sx={{
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              Các dữ liệu đã tạo sẽ bị mất.
            </DialogContent>
            <DialogActions
              sx={{
                justifyContent: "center",
                gap: 2,
              }}
            >
              <Button
                onClick={() => setOpenCancel(false)}
                sx={{
                  color: "black",
                  background: "#cececeff",
                  borderRadius: "12px",
                  width: "150px",
                }}
              >
                Quay lại
              </Button>
              <Button
                onClick={handleConfirmCancel}
                sx={{
                  color: "white",
                  background: "#123663FF",
                  borderRadius: "12px",
                  width: "150px",
                }}
                component={Link}
                to="/exam"
                state={{ role }}
              >
                Xác nhận
              </Button>
            </DialogActions>
          </Box>
        </Dialog>
        <Button
          variant="contained"
          onClick={handleCreateExam}
          sx={{
            backgroundColor: "#1A4E8DFF",
            borderRadius: 25,
            color: "white",
            width: 125,
            height: 40,
            paddingX: 2,
            fontWeight: 600,
            ":hover": {
              backgroundColor: "#123663FF",
            },
          }}
        >
          Tạo ca thi
        </Button>
      </Box>
      {/* Khi nhấn tạo ca thi */}
      <Dialog
        open={openCreateExam}
        onClose={() => setOpenCreateExam(false)}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
            padding: 3,
            minWidth: "30%",
            maxWidth: "60%",
            position: "relative",
            overflow: "visible",
            margin: "auto",
          },
        }}
      >
        <img
          src={DetectiveIcon}
          alt=""
          style={{
            width: "30%",
            position: "absolute",
            left: "-20%",
            top: "50%",
            transform: "translateY(-50%)",
          }}
        />
        <DialogTitle sx={{ color: "red", textAlign: "center" }}>
          Bạn đã hoàn tất tạo ca thi?
        </DialogTitle>
        <DialogContent
          sx={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          Nếu chưa hoàn tất, bạn vẫn có thể chỉnh sửa tiếp sau đó.
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: "center",
            gap: 2,
          }}
        >
          <Button
            onClick={() => setOpenCreateExam(false)}
            sx={{
              color: "black",
              background: "#cececeff",
              borderRadius: "12px",
            }}
          >
            Chưa hoàn tất
          </Button>
          {/* Khi nhấn chưa hoàn tất hiển thị về trang thi và hiện lớp đang soạn */}
          <Button
            onClick={handleConfirmCreateExam}
            sx={{
              color: "white",
              background: "#123663FF",
              borderRadius: "12px",
              width: "150px",
            }}
          >
            Hoàn tất
          </Button>
        </DialogActions>
      </Dialog>

      {/* Khi nhấn hoàn tất  */}
      <Dialog
        open={openSucess}
        onClose={() => setOpenSuccess(false)}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
            padding: 1,
            minWidth: "25%",
            maxWidth: "55%",
            position: "relative",
            overflow: "visible",
          },
        }}
      >
        <img
          src={ExcellentIcon}
          alt=""
          style={{
            width: "50%",
            position: "absolute",
            left: "-40%",
            top: "50%",
            transform: "translateY(-50%)",
          }}
        />
        <DialogTitle sx={{ color: "red", textAlign: "center" }}>
          Bạn đã hoàn thành tạo ca thi!
        </DialogTitle>
        <DialogContent
          sx={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          Ca thi đã được hiển thị trên danh sách các ca thi.
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: "center",
          }}
        >
          <Button
            autoFocus
            onClick={handleConfirmSuccess}
            sx={{
              color: "white",
              background: "#123663FF",
              borderRadius: "12px",
              width: "150px",
            }}
          >
            Chia sẻ
          </Button>
        </DialogActions>
      </Dialog>
      {/* //khi ấn nút chia sẻ hiển thị ra đã sao chép liên kết rồi quay về trang thi */}
    </Box>
  );
}
