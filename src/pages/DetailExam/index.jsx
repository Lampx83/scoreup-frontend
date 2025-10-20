import { Box, Typography, Button, Card, CardContent } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getExamById } from "~/services/exam.service";
import moment from "moment";
import { Link, useLocation } from "react-router-dom";

export default function DetailExam() {
  const { exam_id } = useParams();
  console.log("Exam ID:", exam_id);
  const navigate = useNavigate();
  const location = useLocation();
  const [exam, setExam] = useState(null);
  const { role: roleFromState, student_id } = location.state || {};
  const [role, setRole] = useState(
    roleFromState || localStorage.getItem("role")
  );
  console.log("role", role);
  console.log("student_id", student_id);

  useEffect(() => {
    if (student_id) {
      localStorage.setItem("student_id", student_id);
    }
  }, [student_id]);

  useEffect(() => {
    if (roleFromState) {
      localStorage.setItem("role", roleFromState);
      setRole(roleFromState);
    }
  }, [roleFromState]);

  useEffect(() => {
    const savedRole = localStorage.getItem("role");
    if (!role && savedRole) {
      setRole(savedRole);
    }
  }, [role]);

  const fetchExam = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      console.log(" exam_id param:", exam_id);
      const data = await getExamById(exam_id);
      console.log(" Dữ liệu exam trả về:", data);
      setExam(data?.data || data);
    } catch (error) {
      console.error(" Lỗi khi fetch exam:", error);
    }
  };

  useEffect(() => {
    if (exam_id) fetchExam();
  }, [exam_id]);

  const totalQuestions =
    exam?.questions?.reduce(
      (sum, q) =>
        sum + (q.chapters?.reduce((s, c) => s + (c.numbers || 0), 0) || 0),
      0
    ) || 0;

  return (
    <Box
      sx={{
        p: 4,
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#fffdf7",
      }}
    >
      {/* Header */}
      <Box display="flex" alignItems="center" gap={1} mb={3}>
        <ChevronLeftIcon
          sx={{ cursor: "pointer", fontSize: 30 }}
          onClick={() => navigate(-1)}
        />
        <Typography variant="h5" fontWeight="600">
          {exam?.exam_name || "Tên ca thi"}
        </Typography>

        <Box sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 1 }}>
          <AccessTimeIcon sx={{ color: "#666" }} />
          <Typography color="text.secondary">
            {moment().format("HH:mm DD/MM/YYYY")}
          </Typography>
        </Box>
      </Box>

      {/* Card */}
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexGrow={1}
      >
        <Card
          sx={{
            width: 400,
            borderRadius: 3,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <CardContent sx={{ py: 4, px: 5 }}>
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ mb: 2, color: "#000" }}
            >
              Thông tin ca thi
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.8 }}>
              <Typography>
                <strong>Môn thi:</strong>{" "}
                {exam?.subject_name || "Cơ sở lập trình"}
              </Typography>
              <Typography>
                <strong>Thời gian làm bài:</strong> {exam?.exam_time || 60} phút
              </Typography>
              <Typography>
                <strong>Số câu:</strong> {totalQuestions || 30} câu
              </Typography>
              <Typography>
                <strong>Thời gian bắt đầu:</strong>{" "}
                {exam?.start_date
                  ? moment(exam.start_date).format("HH:mm DD/MM/YYYY")
                  : ""}
              </Typography>
              <Typography>
                <strong>Thời gian kết thúc:</strong>{" "}
                {exam?.end_date
                  ? moment(exam.end_date).format("HH:mm DD/MM/YYYY")
                  : ""}
              </Typography>
              <Typography>
                <strong>Tổng số lượt làm bài:</strong> {exam?.result || 0}
              </Typography>
            </Box>

            <Box textAlign="center">
              {role ? (
                <Button
                  variant="contained"
                  sx={{
                    mt: 4,
                    backgroundColor: "#C14E4E",
                    color: "#fff",
                    borderRadius: "25px",
                    textTransform: "none",
                    px: 6,
                    py: 1.2,
                    fontWeight: "600",
                    ":hover": {
                      backgroundColor: "#a53f3f",
                      boxShadow: "0 0 8px rgba(193,78,78,0.5)",
                    },
                  }}
                >
                  Giám sát
                </Button>
              ) : (
                <Button
                  variant="contained"
                  sx={{
                    mt: 4,
                    backgroundColor: "#a53f3f",
                    color: "#fff",
                    borderRadius: "25px",
                    textTransform: "none",
                    px: 6,
                    py: 1.2,
                    fontWeight: "600",
                    ":hover": {
                      backgroundColor: "#a53f3f",
                      boxShadow: "0 0 8px rgba(193,78,78,0.5)",
                    },
                  }}
                  component={Link}
                  to={`/exam/${exam?.exam_id}`}
                >
                  Làm bài
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
