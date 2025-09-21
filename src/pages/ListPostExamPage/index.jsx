import Box from "@mui/material/Box";
import {
  Card,
  CardActions,
  CardContent,
  Container,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import headerImg from "~/assets/images/Container 136.png";
import * as React from "react";
import { useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { FaRegClock, FaHistory, FaUserEdit } from "react-icons/fa";
import { IoAlarm } from "react-icons/io5";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Tooltip from "@mui/material/Tooltip";
import { Link, useLocation } from "react-router-dom";
import moment from "moment";
import plusExamImg from "~/assets/images/PlusExam.png";
import { getExams, deleteExam } from "~/services/exam.service";
import SadIcon from "../../assets/images/sad.svg";
import ExamFilter from "~/components/ExamFilter";

export default function ListPostExamPage() {
  const theme = useTheme();
  const [exams, setExams] = useState([]);
  const location = useLocation();
  const { role: roleFromState, student_id } = location.state || {};
  const [openClear, setOpenClear] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Lấy role từ localStorage hoặc từ state
  const [role, setRole] = useState(
    roleFromState || localStorage.getItem("role")
  );
  console.log("role", role);
  console.log("student_id", student_id);
  // Nếu có role mới từ state => lưu lại vào localStorage + update state
  useEffect(() => {
    if (roleFromState) {
      localStorage.setItem("role", roleFromState);
      setRole(roleFromState);
    }
  }, [roleFromState]);

  useEffect(() => {
    // fetch exams
    const fetchTest = async () => {
      const res = await getExams();
      const exams = res?.data;
      console.log(exams);
      setExams(exams);
    };
    fetchTest();
  }, []);

  // 1. Lọc theo role
  const examsByRole = React.useMemo(() => {
    if (!exams) return [];

    if (role) {
      // Giáo viên => thấy hết
      return exams;
    } else {
      // Học sinh => chỉ thấy ca thi của mình
      return exams.filter((exam) =>
        exam.student_list.some((stu) => stu.student_id === student_id)
      );
    }
  }, [exams, role, student_id]);

  // 2. Lọc theo search / môn học / trạng thái
  const filteredExams = React.useMemo(() => {
    return examsByRole.filter((exam) => {
      const matchSearch = exam.exam_name
        ?.toLowerCase()
        .includes(searchText.toLowerCase());

      const matchSubject =
        subjectFilter === "all" ||
        String(exam.subject_id) === String(subjectFilter);

      const now = new Date();
      const start = new Date(exam.start_date);
      const end = new Date(exam.end_date);

      let matchStatus = true;
      if (statusFilter === "upcoming") matchStatus = start > now;
      if (statusFilter === "ongoing") matchStatus = start <= now && end >= now;
      if (statusFilter === "ended") matchStatus = end < now;

      return matchSearch && matchSubject && matchStatus;
    });
  }, [examsByRole, searchText, subjectFilter, statusFilter]);

  //xóa
  const handleClear = (exam) => {
    setSelectedExam(exam);
    setOpenClear(true);
  };

  const handleConfirmClear = async () => {
    if (selectedExam) {
      try {
        // Gọi API xóa
        await deleteExam(selectedExam.exam_id);

        // Cập nhật lại state exams để UI refresh
        setExams((prev) =>
          prev.filter((e) => e.exam_id !== selectedExam.exam_id)
        );

        console.log("Đã xóa ca thi:", selectedExam.exam_id);
      } catch (error) {
        console.error("Lỗi khi xóa ca thi:", error);
      }
    }

    setOpenClear(false);
    setSelectedExam(null);
  };

  //lọc trạng thái
  // const getExamStatus = (exam) => {
  //   const now = new Date();
  //   const start = new Date(exam.start_date);
  //   const end = new Date(exam.end_date);

  //   if (start > now) return "ready";
  //   if (start <= now && end >= now) return "ongoing";
  //   if (end < now) return "ended";
  //   return "all";
  // };
  const hasStudentSubmitted = (exam, sid) => {
    const entry = Array.isArray(exam?.student_list)
      ? exam.student_list.find((s) => String(s.student_id) === String(sid))
      : null;
    const v = entry?.isSubmit;
    return v === true || v === "true";
  };

  const handleShare = (exam) => {
    const examLink = `${window.location.origin}/exam/${exam.exam_id}`;
    navigator.clipboard.writeText(examLink);
    alert("Đã sao chép link ca thi: " + exam.exam_link);
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        margin: "auto",
        width: "100%",
        position: "relative",
        maxWidth: theme.breakpoints.values.lg,
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "238px",
          position: "relative",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            marginLeft: 10,
            maxWidth: "50%",
            whiteSpace: "wrap",
            color: "white",
          }}
        >
          <Typography variant="h4" fontWeight={700} sx={{}}>
            Kì thi
          </Typography>
          <Typography variant="p" fontWeight={500} sx={{}}>
            {role
              ? `Tạo ca thi, theo dõi kết quả.`
              : `Tham gia thi, xem kết quả tức thì.`}
          </Typography>
        </Box>
        <img
          src={headerImg}
          alt="header"
          style={{
            width: "100%",
            height: "238px",
            borderRadius: 15,
            objectFit: "cover",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: -1,
          }}
        />
      </Box>

      <Box
        sx={{
          paddingY: 5,
          marginY: 1,
          maxWidth: "100%",
          width: "100%",
          position: "relative",
          display: "flex",
          gap: 2,
          flexDirection: "column",
        }}
      >
        {/* Nút Tạo ca thi chỉ dành cho giáo viên */}
        {role && (
          <Button
            style={{
              display: "flex",
              flexDirection: "row",
              width: "150px",
              height: "50px",
              fontSize: "12px",
              borderRadius: "5px",
              backgroundColor: "#EFB034FF",
              color: "#323842FF",
              textDecoration: "none",
              padding: "10px 10px",
              gap: "10px",
            }}
            component={Link}
            to="/create-exam"
          >
            <img
              src={plusExamImg}
              alt="PlusExam"
              style={{
                width: "25px",
                height: "25px",
              }}
            />
            <h2>Tạo ca thi</h2>
          </Button>
        )}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 3,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          {/* Bên trái: tiêu đề */}
          <Typography variant="h4" fontWeight={600}>
            Danh sách ca thi
          </Typography>

          {/* Bên phải: bộ lọc */}
          <ExamFilter
            searchText={searchText}
            setSearchText={setSearchText}
            subjectFilter={subjectFilter}
            setSubjectFilter={setSubjectFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 4,
            flexWrap: "wrap",
          }}
        >
          {filteredExams?.map((exam, index) => (
            <Card
              key={index}
              variant={"elevation"}
              sx={{
                backgroundColor: "#F2F7FDFF",
                borderRadius: 3,
                height: "40%",
                minWidth: "30%",
                maxwidth: "50%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    gutterBottom
                    fontSize={"20px"}
                    fontWeight={700}
                    color={"#1A4E8DFF"}
                  >
                    {exam?.exam_name || ""}
                  </Typography>
                  <Tooltip
                    title={
                      <div>
                        <div>
                          Tạo vào:{" "}
                          {exam?.createdAt
                            ? moment(exam?.createdAt).format(
                                "HH:mm:ss DD/MM/YYYY"
                              )
                            : "Không rõ"}
                        </div>
                        <div>Ghi chú: {exam?.notes || "Không có"}</div>
                      </div>
                    }
                    arrow
                    placement="top"
                  >
                    <InfoOutlinedIcon
                      sx={{
                        fontSize: 20,
                        color: "#1A4E8DFF",
                        cursor: "pointer",
                      }}
                    />
                  </Tooltip>
                </Box>
                <Box>
                  <Typography
                    variant={"body2"}
                    gutterBottom
                    sx={{
                      display: "flex",
                      gap: 1,
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <FaRegClock />
                    Thời gian làm bài: {exam?.exam_time} phút
                  </Typography>
                  <Typography
                    variant={"body2"}
                    gutterBottom
                    sx={{
                      display: "flex",
                      gap: 1,
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <FaHistory />
                    Thời gian bắt đầu:{" "}
                    {exam?.start_date
                      ? moment(exam?.start_date).format("HH:mm DD/MM/YYYY")
                      : "Không rõ"}
                  </Typography>
                  {exam.exam_id && (
                    <Typography
                      variant={"body2"}
                      gutterBottom
                      sx={{
                        display: "flex",
                        gap: 1,
                        justifyContent: "flex-start",
                        alignItems: "center",
                      }}
                    >
                      <IoAlarm />
                      Thời gian kết thúc:{" "}
                      {exam?.end_date
                        ? moment(exam?.end_date).format("HH:mm DD/MM/YYYY")
                        : "Không rõ"}
                    </Typography>
                  )}
                  <Typography
                    variant={"body2"}
                    gutterBottom
                    sx={{
                      display: "flex",
                      gap: 1,
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <FaUserEdit />
                    Người tạo: {exam?.author || "Ẩn danh"}
                  </Typography>
                </Box>
              </CardContent>

              {role ? (
                <CardActions
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  {exam.student_list.submitted !== "false" ? (
                    <>
                      <Button
                        variant="contained"
                        size={"small"}
                        sx={{
                          backgroundColor: "#1A4E8DFF",
                          borderRadius: 25,
                          color: "white",
                          height: 30,
                          fontWeight: 600,
                          mr: 7,
                          ":hover": {
                            backgroundColor: "#123663FF",
                          },
                        }}
                        onClick={() => handleShare(exam)}
                      >
                        Chia sẻ
                      </Button>

                      <Button
                        variant="contained"
                        onClick={() => handleClear(exam)}
                        size={"small"}
                        sx={{
                          backgroundColor: "#DE3B40FF",
                          borderRadius: 25,
                          color: "white",
                          height: 30,
                          fontWeight: 600,
                          ":hover": {
                            backgroundColor: "#C12126FF",
                          },
                        }}
                      >
                        Xóa
                      </Button>

                      <Button
                        size={"small"}
                        sx={{
                          backgroundColor: "#1A4E8DFF",
                          borderRadius: 25,
                          color: "white",
                          height: 30,
                          paddingX: 2,
                          fontWeight: 600,
                          ":hover": {
                            backgroundColor: "#123663FF",
                          },
                        }}
                        component={Link}
                        to="/edit-exam"
                      >
                        Chỉnh sửa
                      </Button>
                    </>
                  ) : (
                    <Button
                      size={"small"}
                      sx={{
                        backgroundColor: "#9095A0FF",
                        borderRadius: 5,
                        color: "white",
                        paddingX: 1,
                        ":hover": {
                          backgroundColor: "rgba(144,149,160,0.8)",
                          boxShadow: "0 0 10px 0 rgba(144,149,160,0.5)",
                        },
                      }}
                      component={Link}
                      to={`/admin/history/${exam.exam_id}/`}
                    >
                      Xem chi tiết
                    </Button>
                  )}
                </CardActions>
              ) : (
                <CardActions
                  sx={{ display: "flex", justifyContent: "flex-end" }}
                >
                  {hasStudentSubmitted(exam, student_id) ? (
                    <Button
                      size="small"
                      sx={{
                        backgroundColor: "#9095A0FF",
                        borderRadius: 5,
                        color: "white",
                        paddingX: 1,
                        ":hover": {
                          backgroundColor: "rgba(144,149,160,0.8)",
                          boxShadow: "0 0 10px 0 rgba(144,149,160,0.5)",
                        },
                      }}
                      component={Link}
                      to={`/user/history/${exam.exam_id}/`}
                    >
                      Xem chi tiết
                    </Button>
                  ) : (
                    (() => {
                      const now = new Date();
                      const start = new Date(exam.start_date);
                      const end = new Date(exam.end_date);
                      const isOngoing = start <= now && now <= end;

                      if (!isOngoing) {
                        return (
                          <Button
                            size="small"
                            disabled
                            sx={{
                              color: "#1A4E8DFF !important",
                              "&.Mui-disabled": {
                                color: "#1A4E8DFF", // chữ
                                borderRadius: 25,
                              },
                            }}
                          >
                            Chưa đến thời gian làm bài
                          </Button>
                        );
                      }
                      return (
                        <Button
                          size="small"
                          sx={{
                            backgroundColor: "#1A4E8DFF",
                            borderRadius: 25,
                            color: "white",
                            paddingX: 2,
                            height: 35,
                            ":hover": {
                              backgroundColor: "#3669a7ff",
                              boxShadow: "0 0 10px 0 rgba(46, 97, 160, 0.5)",
                            },
                          }}
                          component={Link}
                          to={`/exam/${exam.exam_id}`}
                          state={{
                            student_id,
                            exam_id: exam.exam_id,
                            notion_database_id:
                              exam?.notion_database_id ?? exam?.database_id,
                            subject_name: exam.subject_name,
                            exam_time: exam.exam_time,
                            start_date: exam.start_date,
                            end_date: exam.end_date,
                            questions: exam.questions,
                          }}
                        >
                          Làm bài
                        </Button>
                      );
                    })()
                  )}
                </CardActions>
              )}
            </Card>
          ))}
        </Box>
        <Dialog
          open={openClear}
          onClose={() => setOpenClear(false)}
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
              Bạn có chắc muốn xóa ca thi?
            </DialogTitle>
            <DialogContent
              sx={{
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              Các dữ liệu của ca thi sẽ bị xóa vĩnh viễn.
            </DialogContent>
            <DialogActions
              sx={{
                justifyContent: "center",
                gap: 2,
              }}
            >
              <Button
                onClick={() => setOpenClear(false)}
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
                onClick={handleConfirmClear}
                sx={{
                  color: "white",
                  background: "#123663FF",
                  borderRadius: "12px",
                  width: "150px",
                }}
              >
                Xác nhận
              </Button>
            </DialogActions>
          </Box>
        </Dialog>
      </Box>
    </Container>
  );
}
