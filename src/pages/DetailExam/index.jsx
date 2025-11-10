import { Box, Typography, Button, Card, CardContent } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getExamById } from "~/services/exam.service";
import moment from "moment";
import { Link, useLocation } from "react-router-dom";
import Loading from "~/components/Loading";

export default function DetailExam() {
  const { exam_id } = useParams();
  console.log("Exam ID:", exam_id);
  const navigate = useNavigate();
  const location = useLocation();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(false);

  const { role: roleFromState, student_id: studentIdFromState } =
    location.state || {};
  const student_id = studentIdFromState ?? localStorage.getItem("student_id");

  const [role, setRole] = useState(
    roleFromState || localStorage.getItem("role")
  );

  console.log("role:", role);
  console.log("student_id:", student_id);

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
      setLoading(true);
      console.log(" exam_id param:", exam_id);
      const data = await getExamById(exam_id);
      console.log(" Dữ liệu exam trả về:", data);
      setExam(data?.data || data);
      console.log("Exam data:", data);
    } catch (error) {
      console.error(" Lỗi khi fetch exam:", error);
    } finally {
      setLoading(false);
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
  const sid = student_id || localStorage.getItem("student_id") || null;

  const hasStudentSubmitted = (exam, sid) => {
    const entry = Array.isArray(exam?.student_list)
      ? exam.student_list.find((s) => String(s.student_id) === String(sid))
      : null;
    const v = entry?.isSubmit;
    return v === true || v === "true";
  };
  const renderButtons = () => {
    const now = new Date();
    const start = exam?.start_date ? new Date(exam.start_date) : null;
    const end = exam?.end_date ? new Date(exam.end_date) : null;

    let isOngoing = false;
    if (start && end) isOngoing = start <= now && now <= end;
    else if (!start && !end) isOngoing = true;
    else if (start && !end) isOngoing = now >= start;
    else if (!start && end) isOngoing = now <= end;

    // Chưa đến giờ
    if (start && now < start) {
      return (
        <Button size="small" disabled sx={{ mt: 4 }}>
          Chưa đến thời gian làm bài
        </Button>
      );
    }

    // Ca thi kết thúc
    if (end && now > end) {
      return (
        <Button
          size="small"
          sx={{
            mt: 4,
            backgroundColor: "#9095A0FF",
            borderRadius: 5,
            color: "white",
            ":hover": { backgroundColor: "rgba(144,149,160,0.8)" },
          }}
          component={Link}
          to={
            role
              ? `/result-exam/${exam?.exam_id}`
              : `/user/history/${exam?.exam_id}`
          }
        >
          Xem chi tiết
        </Button>
      );
    }

    // Nếu là giảng viên đang ongoing
    if (role) {
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2, // khoảng cách giữa các nút
            mt: 4,
          }}
        >
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#C14E4E",
              color: "#fff",
              borderRadius: 25,
              px: 4,
              py: 1.2,
              fontWeight: 600,
              whiteSpace: "nowrap",
              ":hover": { backgroundColor: "#a53f3f" },
            }}
          >
            Giám sát
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#C14E4E",
              color: "#fff",
              borderRadius: 25,
              px: 4,
              py: 1.2,
              fontWeight: 600,
              whiteSpace: "nowrap",
              ":hover": { backgroundColor: "#a53f3f" },
            }}
            component={Link}
            to={`/do-exam/exam/${exam?.exam_id}`}
            state={{
              student_id: sid,
              exam_id: exam?.exam_id,
              notion_database_id: exam?.notion_database_id ?? exam?.database_id,
              subject_name: exam?.subject_name,
              exam_time: exam?.exam_time,
              start_date: exam?.start_date,
              end_date: exam?.end_date,
              questions: exam?.questions,
            }}
          >
            Vào thi
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#9095A0FF",
              color: "#fff",
              borderRadius: 25,
              px: 4,
              py: 1.2,
              fontWeight: 600,
              whiteSpace: "nowrap",
              ":hover": { backgroundColor: "rgba(144,149,160,0.8)" },
            }}
            component={Link}
            to={`/result-exam/${exam?.exam_id}`}
          >
            Xem chi tiết
          </Button>
        </Box>
      );
    }

    // Sinh viên đang diễn ra và chưa nộp
    if (isOngoing) {
      return (
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#C14E4E",
            color: "#fff",
            borderRadius: 25,
            px: 4,
            py: 1.2,
            ":hover": { backgroundColor: "#a53f3f" },
          }}
          component={Link}
          to={`/do-exam/exam/${exam?.exam_id}`}
          state={{
            student_id: sid,
            exam_id: exam?.exam_id,
            notion_database_id: exam?.notion_database_id ?? exam?.database_id,
            subject_name: exam?.subject_name,
            exam_time: exam?.exam_time,
            start_date: exam?.start_date,
            end_date: exam?.end_date,
            questions: exam?.questions,
          }}
        >
          Vào thi
        </Button>
      );
    }

    // Sinh viên đã nộp trước giờ kết thúc
    if (hasStudentSubmitted(exam, sid)) {
      return (
        <Button
          size="small"
          sx={{
            mt: 4,
            backgroundColor: "#9095A0FF",
            borderRadius: 5,
            color: "white",
            ":hover": { backgroundColor: "rgba(144,149,160,0.8)" },
          }}
          component={Link}
          to={`/user/history/${exam?.exam_id}`}
        >
          Xem chi tiết
        </Button>
      );
    }

    return null;
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
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

            <Box
              sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 1 }}
            >
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
                  sx={{ mb: 2, color: "#000", textAlign: "center" }}
                >
                  Thông tin ca thi
                </Typography>

                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 0.8 }}
                >
                  <Typography>
                    <strong>Môn thi:</strong>{" "}
                    {exam?.subject_name || "Cơ sở lập trình"}
                  </Typography>
                  <Typography>
                    <strong>Thời gian làm bài:</strong> {exam?.exam_time || 60}{" "}
                    phút
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
                    <strong>Tổng số lượt làm bài:</strong>{" "}
                    {Array.isArray(exam?.student_list)
                      ? exam.student_list.filter(
                          (s) =>
                            s.isSubmit &&
                            String(s.isSubmit).toLowerCase() === "true"
                        ).length
                      : 0}
                  </Typography>
                </Box>

                <Box textAlign="center">{renderButtons()}</Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      )}
    </>
  );
}
