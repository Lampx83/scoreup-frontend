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
const renderStatusLabel = (exam) => {
  if (!exam) return null;

  if (exam.status === "draft") {
    return <span style={{ color: "#000000ff" }}>Đang soạn</span>;
  }

  if (exam.status === "DONE") {
    return <span style={{ color: "#000000ff" }}>Đã kết thúc</span>;
  }

  if (exam.status === "ready") {
    const now = new Date();
    const start = new Date(exam.start_date);
    const end = new Date(exam.end_date);

    if (end < now) {
      return <span style={{ color: "#000000ff" }}>Đã kết thúc</span>;
    }
    // return <span style={{ color: "#999" }}>Không rõ</span>;
  }
};

const getCardColor = (exam) => {
  const now = new Date();
  const end = new Date(exam.end_date);

  if (exam.status === "draft") return "#DEE1E6FF";
  if (exam.status === "DONE" || end < now) return "#F3F4F6FF";
  return "#F2F7FDFF";
};

export default function ListPostExamPage() {
  const theme = useTheme();
  const [exams, setExams] = useState([]);
  const location = useLocation();
  const { role: roleFromState, student_id } = location.state || {};
  const sid = student_id || localStorage.getItem("student_id");
  const [openClear, setOpenClear] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

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
    // fetch exams
    const fetchTest = async () => {
      const res = await getExams();
      const exams = res?.data;
      console.log(exams);
      setExams(exams);
    };
    fetchTest();
  }, []);

  // lọc theo role
  const examsByRole = React.useMemo(() => {
    if (!exams) return [];
    if (role) {
      return exams;
    } else {
      return exams.filter(
        (exam) =>
          exam.status !== "draft" &&
          Array.isArray(exam.student_list) &&
          exam.student_list.some(
            (stu) => String(stu.student_id) === String(sid)
          )
      );
    }
  }, [exams, role, sid]);

  // 2. Lọc theo search / môn học / trạng thái
  const filteredExams = React.useMemo(() => {
    const now = new Date();

    return examsByRole
      .filter((exam) => {
        const matchSearch = exam.exam_name
          ?.toLowerCase()
          .includes(searchText.toLowerCase());

        const matchSubject =
          subjectFilter === "all" ||
          (exam.subject_name &&
            exam.subject_name
              .toLowerCase()
              .includes(subjectFilter.toLowerCase()));

        const start = new Date(exam.start_date);
        const end = new Date(exam.end_date);

        let matchStatus = true;
        if (statusFilter === "draft") matchStatus = exam.status === "draft";
        if (statusFilter === "ready")
          matchStatus = exam.status === "ready" && end >= now;
        if (statusFilter === "DONE")
          matchStatus = exam.status === "DONE" || end < now;

        return matchSearch && matchSubject && matchStatus;
      })
      .sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
  }, [examsByRole, searchText, subjectFilter, statusFilter]);

  //xóa
  const handleClear = (exam) => {
    setSelectedExam(exam);
    setOpenClear(true);
  };

  const handleConfirmClear = async () => {
    if (selectedExam) {
      try {
        await deleteExam(selectedExam.exam_id);

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

  const hasStudentSubmitted = (exam, sid) => {
    const entry = Array.isArray(exam?.student_list)
      ? exam.student_list.find((s) => String(s.student_id) === String(sid))
      : null;
    const v = entry?.isSubmit;
    return v === true || v === "true";
  };

  const handleShare = (exam) => {
    const examLink = exam.exam_link;
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
          <Typography variant="h4" fontWeight={600}>
            Danh sách ca thi
          </Typography>

          <ExamFilter
            searchText={searchText}
            setSearchText={setSearchText}
            subjectFilter={subjectFilter}
            setSubjectFilter={setSubjectFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            role={role}
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
                backgroundColor: getCardColor(exam),
                borderRadius: 3,
                height: "200%",
                minWidth: "30%",
                maxWidth: "60%",
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
                      : ""}
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
                        : ""}
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
                // Giáo viên
                <CardActions
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  {/* trái */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="body2">
                      {renderStatusLabel(exam)}
                    </Typography>

                    {exam.status === "ready" &&
                      new Date(exam.end_date) > new Date() && (
                        <Button
                          variant="contained"
                          size="small"
                          sx={{
                            backgroundColor: "#1A4E8DFF",
                            borderRadius: 25,
                            color: "white",
                            height: 30,
                            fontWeight: 600,
                            ":hover": { backgroundColor: "#123663FF" },
                          }}
                          onClick={() => handleShare(exam)}
                        >
                          Chia sẻ
                        </Button>
                      )}
                  </Box>
                  {/* phải */}
                  <Box sx={{ display: "flex", gap: 1 }}>
                    {exam.status === "draft" ? (
                      <>
                        <Button
                          variant="contained"
                          size="small"
                          sx={{
                            backgroundColor: "#DE3B40FF",
                            borderRadius: 25,
                            color: "white",
                            height: 30,
                            fontWeight: 600,
                            ":hover": { backgroundColor: "#C12126FF" },
                          }}
                          onClick={() => handleClear(exam)}
                        >
                          Xóa
                        </Button>
                        <Button
                          size="small"
                          sx={{
                            backgroundColor: "#1A4E8DFF",
                            borderRadius: 25,
                            color: "white",
                            height: 30,
                            paddingX: 2,
                            fontWeight: 600,
                            ":hover": { backgroundColor: "#123663FF" },
                          }}
                          component={Link}
                          to={`/edit-exam/${exam.exam_id}`}
                        >
                          Chỉnh sửa
                        </Button>
                      </>
                    ) : exam.status === "ready" &&
                      new Date(exam.end_date) > new Date() ? (
                      <>
                        <Button
                          variant="contained"
                          size="small"
                          sx={{
                            backgroundColor: "#DE3B40FF",
                            borderRadius: 25,
                            color: "white",
                            height: 30,
                            fontWeight: 600,
                            ":hover": { backgroundColor: "#C12126FF" },
                          }}
                          onClick={() => handleClear(exam)}
                        >
                          Xóa
                        </Button>
                        <Button
                          size="small"
                          sx={{
                            backgroundColor: "#1A4E8DFF",
                            borderRadius: 25,
                            color: "white",
                            height: 30,
                            paddingX: 2,
                            fontWeight: 600,
                            ":hover": { backgroundColor: "#123663FF" },
                          }}
                          component={Link}
                          to={`/edit-exam/${exam.exam_id}`}
                        >
                          Chỉnh sửa
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="contained"
                          size="small"
                          sx={{
                            backgroundColor: "#DE3B40FF",
                            borderRadius: 25,
                            color: "white",
                            height: 30,
                            fontWeight: 600,
                            ":hover": { backgroundColor: "#C12126FF" },
                          }}
                          onClick={() => handleClear(exam)}
                        >
                          Xóa
                        </Button>

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
                          to={`/admin/history/${exam.exam_id}`}
                        >
                          Xem chi tiết
                        </Button>
                      </>
                    )}
                  </Box>
                </CardActions>
              ) : (
                // Học sinh
                <CardActions
                  sx={{ display: "flex", justifyContent: "flex-end" }}
                >
                  {hasStudentSubmitted(exam, sid) ? (
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
                      to={`/user/history/${exam.exam_id}`}
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
                          <Button size="small" disabled>
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
                            student_id: sid,
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
