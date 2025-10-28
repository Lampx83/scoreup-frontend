import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import {
  FaRegCalendarAlt,
  FaBullseye,
  FaCheckCircle,
  FaUsers,
  FaQuestionCircle,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSubmitExam } from "~/services/exam.service";
import { getExamById } from "~/services/exam.service";
import moment from "moment";
import Loading from "~/components/Loading";

export default function ResultAdminExamPage() {
  const [ranking, setRanking] = useState([]);
  const { exam_id } = useParams();
  const [exam, setExam] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        setLoading(true);
        const res = await getSubmitExam(exam_id);
        if (res.status === "OK") {
          const sorted = res.data.sort((a, b) => b.score - a.score);
          setRanking(sorted);
        }
      } catch (err) {
        console.error("Lỗi tải dữ liệu:", err);
      }
      setLoading(false);
    };
    fetchRanking();
  }, [exam_id]);

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

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <Box sx={{ p: 3 }}>
          {/* Header */}
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <ChevronLeftIcon
              sx={{ cursor: "pointer" }}
              onClick={() => navigate(-1)}
            />
            <Typography sx={{ fontWeight: "bold", fontSize: "25px" }}>
              {exam?.exam_name || "Tên ca thi"}
            </Typography>

            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "#f5f6f7",
                padding: "6px 12px",
                borderRadius: "20px",
                fontWeight: 500,
                color: "#2d2f31",
                ml: "auto",
              }}
            >
              <FaRegCalendarAlt style={{ fontSize: "18px" }} />
              <Typography fontSize="14px">
                {moment().format("HH:mm DD/MM/YYYY")}
              </Typography>
            </Box>
          </Box>

          {/* Tổng quan */}
          <Box
            sx={{
              backgroundColor: "#F2F7FD",
              padding: "20px 30px",
              borderRadius: "8px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              mb: 4,
            }}
          >
            <Typography
              sx={{ fontWeight: "bold", color: "#1A4E8D", fontSize: "20px" }}
            >
              Tổng quan
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "16px",
              }}
            >
              {/* Box template */}
              {[
                { icon: <FaBullseye />, title: "Độ chính xác", value: "63%" },
                {
                  icon: <FaCheckCircle />,
                  title: "Tỉ lệ hoàn thành",
                  value: "99.3%",
                },
                {
                  icon: <FaUsers />,
                  title: "Số người làm bài",
                  value: ranking.length,
                },
                {
                  icon: <FaQuestionCircle />,
                  title: "Số câu hỏi",
                  value: totalQuestions,
                },
              ].map((item, i) => (
                <Box
                  key={i}
                  sx={{
                    backgroundColor: "#fff",
                    border: "1.5px solid #CED0F8",
                    borderRadius: "8px",
                    padding: "16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <Box
                    sx={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "6px",
                      backgroundColor: "#D6E6FA",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#1A4E8D",
                      fontSize: "18px",
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: "14px", color: "#2d2f31" }}>
                      {item.title}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "20px",
                        fontWeight: "bold",
                        color: "#0d47a1",
                      }}
                    >
                      {item.value}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Bảng xếp hạng */}
          <Box>
            <Typography sx={{ fontWeight: "bold", fontSize: "20px", mb: 2 }}>
              Bảng xếp hạng
            </Typography>

            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#F5F6FA" }}>
                  <TableCell sx={{ fontWeight: "bold" }}>Hạng</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Tên sinh viên
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Điểm số</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Độ chính xác
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {ranking.map((s, index) => (
                  <TableRow
                    key={s.student_id}
                    sx={{
                      backgroundColor:
                        index === 0
                          ? "#FFF6C2"
                          : index === 1
                            ? "#E8E8E8"
                            : index === 2
                              ? "#FCE0C2"
                              : "white",
                    }}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{s.student_id || "Chưa có tên"}</TableCell>
                    <TableCell>{s.score}</TableCell>
                    <TableCell>{s.accuracy}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Box>
      )}
    </>
  );
}
