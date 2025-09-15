import Box from "@mui/material/Box";
import {
  Card,
  CardActions,
  CardContent,
  Container,
  Typography,
} from "@mui/material";
import headerImg from "~/assets/images/Container 136.png";
import * as React from "react";
import { useTheme } from "@mui/material/styles";
import cookies from "~/utils/cookies.js";
import { useEffect, useState } from "react";
import { getCertificates } from "~/services/app.service.js";
import { FaHistory, FaRegClock } from "react-icons/fa";
import { FaListCheck } from "react-icons/fa6";
import Button from "@mui/material/Button";
import { getResult } from "~/services/question.service.js";
import { Link, useLocation } from "react-router-dom";
import moment from "moment";
import plusExamImg from "~/assets/images/PlusExam.png";
import { getExams } from "~/services/exam.service";

export default function ListPostExamPage() {
  const theme = useTheme();
  const user = cookies.get("user");
  const [exams, setExams] = useState([]);
  const location = useLocation();
  const { role } = location.state || {};
  console.log("Role từ router state:", role);

  useEffect(() => {
    // fetch exams
    const fetchTest = async () => {
      const res = await getExams();
      const exams = res?.data;

      setExams(exams);
    };
    fetchTest();
  }, []);

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
        {role ? (
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
        ) : (
          <h2>Danh sách ca thi</h2>
        )}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 3,
            flexWrap: "wrap",
          }}
        >
          {exams?.map((exam, index) => (
            <Card
              key={index}
              variant={"elevation"}
              sx={{
                backgroundColor: "#F2F7FDFF",
                borderRadius: 3,
                height: "240px",
                width: "260px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <CardContent>
                <Typography
                  gutterBottom
                  fontSize={"20px"}
                  fontWeight={700}
                  color={"#1A4E8DFF"}
                >
                  {exam?.subject_name || ""}
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
                  <FaRegClock />
                  Thời gian: {exam?.exam_time}
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
                  <FaListCheck />
                  Số câu hỏi: 50
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
                    <FaHistory />
                    Làm vào:{" "}
                    {moment(exam?.start_date).format("HH:mm, DD/MM/YYYY")}
                  </Typography>
                )}
              </CardContent>
              {role ? (
                <CardActions
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  {exam.result !== "false" ? (
                    <>
                      <Button
                        size={"small"}
                        sx={{
                          backgroundColor: "#DE3B40FF",
                          borderRadius: 25,
                          color: "white",
                          height: 35,
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
                          height: 35,
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
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  {exam.result !== "false" ? (
                    <Button
                      size={"small"}
                      sx={{
                        backgroundColor: "#1A4E8DFF",
                        borderRadius: 25,
                        color: "white",
                        paddingX: 2,
                        height: 35,
                        ":hover": {
                          backgroundColor: "white",
                          boxShadow: "0 0 10px 0 rgba(26,78,141,0.5)",
                        },
                      }}
                      component={Link}
                      to={`/exam/${exam.exam_id}`}
                    >
                      Làm bài
                    </Button>
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
                      to={`/user/history/${exam.exam_id}/`}
                    >
                      Xem chi tiết
                    </Button>
                  )}
                </CardActions>
              )}
            </Card>
          ))}
        </Box>
      </Box>
    </Container>
  );
}
