import * as React from "react";
import Box from "@mui/material/Box";
import headerImg from "~/assets/images/Container 136.png";
import { Chip, Container, Icon, Typography, useTheme } from "@mui/material";
import SingleQuestion from "~/components/Question/SingleQuestion/index.jsx";
import SetQuestion from "~/components/Question/SetQuestion/index.jsx";
import { useEffect, useRef, useState } from "react";
import { getExamQuestions, submitExam } from "~/services/question.service.js";
import { parseQuestion } from "~/helpers/parseNotionResponseToObject.js";
import QuestionsPalette from "~/components/QuestionsPalette/index.jsx";
import cookies from "~/utils/cookies.js";
import useActiveTab from "~/hooks/useActiveTab.jsx";
import Loading from "~/components/Loading/index.jsx";
import { Link, useNavigate, useParams } from "react-router-dom";
import happyCat from "~/assets/images/happy.png";
import sadCat from "~/assets/images/sad.svg";
import likeCat from "~/assets/images/like.png";
import studyCat from "~/assets/images/studycat.png";
import excellentSvg from "~/assets/images/excellent.svg";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import { useLocation } from "react-router-dom";
import { RiCalendarLine } from "react-icons/ri";
import { LuAlarmClock } from "react-icons/lu";
import { useSetExamPalette } from "~/contexts/ExamPaletteContext";
import { BiPrinter } from "react-icons/bi";
import { LiaArrowLeftSolid } from "react-icons/lia";
import { updateExamStudentSubmit } from "~/services/question.service.js";

const normalizeChapterName = (name) => {
  const text = String(name || "")
    .trim()
    .toLowerCase();
  const m = text.match(/\d+/);

  if (m) {
    if (text.startsWith("đề") || text.startsWith("de")) {
      return `de_${m[0]}`;
    } else if (text.startsWith("chương") || text.startsWith("chuong")) {
      return `chuong_${m[0]}`;
    }
  }
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_");
};

export default function PostExamPage() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();
  const { updateActiveTab } = useActiveTab();
  const user = cookies.get("user");
  const [showAnswer, setShowAnswer] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const setIsSubmittedWithConfirm = (val) => {
    if (val && !isSubmitted) {
      setConfirmOpen(true);
      setPendingSubmit(true);
    } else {
      setIsSubmitted(val);
    }
  };
  const result = useRef({
    questions: [],
    total: 0,
    correct: 0,
    start: new Date(),
    end: null,
  });
  const { notionDatabaseId } = useParams();
  // new Date() + 30 mins
  const [countFrom, setCountFrom] = useState(null);
  const [open, setOpen] = useState(false);
  const [resultId, setResultId] = useState(null);
  const setPalette = useSetExamPalette();
  const addResult = ({ question, user_ans, correct_ans, score }) => {
    if (score) {
      result.current.correct++;
    }
    for (const item of result.current.questions) {
      for (const q of item.questions) {
        if (q.question === question) {
          q.user_ans = user_ans;
          q.correct_ans = correct_ans;
          q.score = score;
          break;
        }
      }
    }
  };

  const [questions, setQuestions] = useState([]);
  const [leftSec, setLeftSec] = useState(0);
  const autoSubmittedRef = useRef(false);
  const location = useLocation();
  const params = useParams();
  const examId = params.exam_id || location.state?.exam_id;
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (questions.length > 0) {
      setPalette({
        questions,
        setShowAnswer,
        setIsSubmitted: setIsSubmittedWithConfirm,
        showAnswer,
        isSubmitted,
        result,
        countFrom,
        isTest: true,
      });
    }
    return () => setPalette(null);
  }, [questions, showAnswer, isSubmitted, countFrom]);
  const {
    subject_name: initialSubjectName,
    exam_time: initialExamTime,
    start_date: initialStartDate,
    student_id: initialStudentId,
    notion_database_id: initialNotionDbId,
  } = location.state || {};

  const [subjectName, setSubjectName] = useState(initialSubjectName);
  const [examTime, setExamTime] = useState(initialExamTime);
  const [startDate, setStartDate] = useState(initialStartDate);
  const [studentId] = useState(initialStudentId);
  const [notionDbId] = useState(initialNotionDbId);
  useEffect(() => {
    const minutes = parseInt(String(examTime || "").replace(/\D/g, ""), 10);
    if (!minutes || countFrom) return;

    const deadline = Date.now() + minutes * 60 * 1000;
    setCountFrom(deadline);
  }, [examTime, countFrom]);
  const fmt = (sec) => {
    if (sec <= 0) return "00:00:00";
    const h = String(Math.floor(sec / 3600)).padStart(2, "0");
    const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  useEffect(() => {
    if (!countFrom || isSubmitted) return;

    const tick = () => {
      const left = Math.floor((countFrom - Date.now()) / 1000);
      if (left <= 0) {
        setLeftSec(0);
        if (!autoSubmittedRef.current) {
          autoSubmittedRef.current = true;
          setIsSubmitted(true);
        }
        return;
      }
      setLeftSec(left);
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [countFrom, isSubmitted, setShowAnswer, setIsSubmitted]);

  let count = 0;

  useEffect(() => {
    setQuestions([]);
    setShowAnswer(false);
    setIsSubmitted(false);
    result.current = {
      questions: [],
      total: 0,
      correct: 0,
      start: new Date(),
      end: null,
    };
    const getData = async () => {
      let sections = [];
      let qs = [];

      const requestedFromState = [];
      (location.state?.questions || []).forEach((group) => {
        (group.chapters || []).forEach((c) => {
          requestedFromState.push({
            chapter: normalizeChapterName(c.chapter),
            numbers: Number(c.numbers || 0),
          });
        });
      });

      const totalRequested = requestedFromState.reduce(
        (s, c) => s + (c.numbers || 0),
        0
      );
      if (totalRequested <= 0) return;

      const requestedChapters = requestedFromState.map((c) => ({
        chapter: c.chapter,
        number: c.numbers,
      }));

      try {
        const res = await getExamQuestions(examId, {
          notion_database_id: notionDbId || location.state?.notion_database_id,
          student_id: location.state?.student_id || user?.id || " ",
          number_questions: String(totalRequested),
          questions: requestedChapters,
        });

        const qContainer = res?.data?.questions || {};
        const rawQuestions = Object.values(qContainer).flat();
        const parsedList = rawQuestions.map((raw) => parseQuestion(raw));

        qs = parsedList.map((p) => ({
          id: p.id,
          question: p.question,
          options: p.options,
          correct: p.correct,
          chapter: p.chapter,
          image: p.image,
          audio: p.audio,
          code: p.code,
          hint: p.hint,
          knowledge_concept: p.knowledge_concept,
          difficulty: p.difficulty,
          context: p.context,
        }));

        if (!qs.length) {
          return;
        }

        sections.push({
          section: "",
          multi: false,
          questions: qs,
        });

        let localIdx = 0;
        result.current.questions.push({
          section: "Bài thi thật",
          multi: false,
          questions: qs.map((question) => ({
            question: question.id,
            question_text: question.question,
            chapter: question.chapter,
            user_ans: [],
            correct_ans: [question.correct],
            score: 0,
            index: localIdx++,
          })),
        });

        setQuestions(sections);
        result.current.total = sections.reduce(
          (acc, cur) => acc + cur.questions.length,
          0
        );
      } catch (err) {
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Unknown error";
      }
    };

    getData();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    updateActiveTab("exam");
  }, []);

  const calculateCorrect = () => {
    let correct = 0;
    for (const item of result.current.questions) {
      for (const q of item.questions) {
        if (q.score === 1) {
          correct++;
        }
      }
    }
    return correct;
  };

  useEffect(() => {
    const sendResult = async () => {
      if (!isSubmitted) return;

      const flatQuestions = result.current.questions.flatMap((sec) =>
        sec.questions.map((q) => {
          const chosen = Array.isArray(q.user_ans) ? q.user_ans[0] : q.user_ans;
          const correct = Array.isArray(q.correct_ans)
            ? q.correct_ans[0]
            : q.correct_ans;
          return {
            chapter: q.chapter,
            question_id: q.question,
            question_text: q.question_text,
            chosen_answer: chosen ?? null,
            correct_answer: correct ?? null,
            isCorrect: q.score === 1,
          };
        })
      );

      const payload = {
        student_id: location.state?.student_id || user?.id || " ",
        notion_database_id: notionDbId || location.state?.notion_database_id,
        number_questions: String(result.current.total),
        isSubmit: true,
        questions: flatQuestions,
      };

      try {
        const res = await submitExam(examId, payload);
        await updateExamStudentSubmit(examId, payload.student_id);
        setResultId(res?.data?.metadata?._id ?? null);
        setOpen(true);
      } catch (e) {
        const msg =
          e?.response?.data?.message ||
          e?.response?.data?.error ||
          e?.message ||
          "Unknown error";
      }
    };
    sendResult();
  }, [isSubmitted]);

  const handleSubmit = () => {
    setIsSubmittedWithConfirm(true);
  };

  return (
    <>
      {showResult ? (
        //result page
        <Container
          maxWidth={false}
          sx={{
            margin: "auto",
            width: "100%",
            position: "relative",
            background: "#B2EDFFFF",
          }}
        >
          <Box
            sx={{
              height: "100vh",
              py: 8,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-end",
                gap: 4,
                position: "relative",
              }}
            >
              <img
                src={studyCat}
                alt="cat"
                style={{
                  height: 400,
                  marginLeft: 12,
                  position: "absolute",
                  left: "-230px",
                  bottom: "-100px",
                  zIndex: 10,
                }}
              />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    background: "#fff",
                    borderRadius: 4,
                    p: 6,
                    minWidth: 420,
                    textAlign: "center",
                    boxShadow: 2,
                    maxWidth: 650,
                  }}
                >
                  <Typography variant="h4" mb={2}>
                    Bạn đã hoàn thành bài thi môn {subjectName || "—"}!
                  </Typography>
                  <Typography variant="h4" fontWeight={900} mb={2}>
                    <b>
                      Điểm số:{" "}
                      {(
                        (calculateCorrect() / result.current.total) *
                        10
                      ).toFixed(2)}
                    </b>
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 3,
                      mb: 2,
                    }}
                  >
                    <Typography
                      sx={{
                        display: "flex",
                        color: "#1CC8AE",

                        width: 160,
                        justifyContent: "space-between",
                        alignItems: "flex-end",
                        fontSize: 20,
                      }}
                    >
                      <span>Số câu đúng</span>
                      <span>
                        {calculateCorrect().toString().padStart(2, "0")}
                      </span>
                    </Typography>
                    <Typography
                      sx={{
                        display: "flex",
                        color: "#F44336",
                        width: 160,
                        justifyContent: "space-between",
                        fontSize: 20,
                      }}
                    >
                      <span>Số câu sai</span>
                      <span>
                        {(result.current.total - calculateCorrect())
                          .toString()
                          .padStart(2, "0")}
                      </span>
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      gap: 2,
                      mt: 2,
                    }}
                  >
                    <Button
                      variant="contained"
                      color="info"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        minWidth: 120,
                      }}
                      onClick={() => window.print()}
                    >
                      <BiPrinter size={24} />
                      <span>Tải kết quả thi</span>
                    </Button>
                    <Button
                      variant="contained"
                      color="info"
                      sx={{
                        backgroundColor: "#1A4E8DFF",
                        ":hover": {
                          backgroundColor: "rgba(26,78,141,0.8)",
                          boxShadow: "0 0 10px 0 rgba(26,78,141,0.5)",
                        },
                        minWidth: 120,
                      }}
                      onClick={() => {
                        /* TODO: handle xem chi tiet */
                      }}
                    >
                      Xem chi tiết
                    </Button>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Button
                    component={Link}
                    to="/exam"
                    sx={{ marginTop: 2, gap: 1 }}
                  >
                    <LiaArrowLeftSolid size={25} style={{ strokeWidth: 2 }} />
                    <span style={{ fontSize: 20, fontWeight: 600 }}>
                      Quay về trang chủ
                    </span>
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Container>
      ) : (
        //exam page
        <>
          {questions.length === 0 ? (
            <Loading />
          ) : (
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
                  paddingY: 5,
                  marginY: 1,
                  maxWidth: "100%",
                  width: "100%",
                  position: "relative",
                }}
              >
                {/* HEADER */}
                <Box
                  sx={{
                    display: "flex",
                    gap: 10,
                    alignItems: "flex-end",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    <Typography variant="h4" fontWeight={700} mb={1}>
                      {subjectName || "Môn thi"}
                    </Typography>
                    {startDate && (
                      <Box
                        sx={{
                          width: "fit-content",
                          display: "inline-flex",
                          alignItems: "center",
                          px: 1.5,
                          py: 0.75,
                          borderRadius: 10,
                          backgroundColor: "#f3f4f6",
                          fontSize: 14,
                          mb: 2,
                        }}
                      >
                        <RiCalendarLine style={{ marginRight: 6 }} />
                        {new Date(startDate).toLocaleString()}
                      </Box>
                    )}

                    <Box
                      sx={{
                        width: "fit-content",
                        display: "flex",
                        alignItems: "center",
                        px: 2,
                        py: 2,
                        borderRadius: 2,
                        backgroundColor: "#EFB034FF",
                        fontSize: 18,
                      }}
                    >
                      <LuAlarmClock style={{ marginRight: 8, fontSize: 28 }} />
                      Thời gian còn lại:&nbsp;
                      <span>{fmt(leftSec)}</span>
                    </Box>
                  </Box>

                  <Box sx={{ fontSize: 18, width: "45%" }}>
                    <Typography variant="h6" fontWeight={700} mb={1}>
                      Thông tin sinh viên
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.5,
                      }}
                    >
                      <Typography variant="inherit">
                        Họ và tên: {user?.fullName || user?.name || "—"}
                      </Typography>
                      <Typography variant="inherit">
                        Mã sinh viên: {user?.email.slice(0, 8) || "—"}
                      </Typography>
                      <Typography variant="inherit">
                        Ngày sinh:{" "}
                        {user?.birth
                          ? new Date(user.birth).toLocaleDateString("vi-VN")
                          : "—"}
                      </Typography>
                      {/*<Typography variant="inherit">
                        Lớp chuyên ngành: {user?.className || "—"}
                      </Typography>*/}
                    </Box>
                  </Box>
                </Box>

                {/*<QuestionsPalette
                    questions={questions}
                    showAnswer={showAnswer}
                    setShowAnswer={setShowAnswer}
                    setIsSubmitted={setIsSubmitted}
                    result={result}
                    isSubmitted={isSubmitted}
                    countFrom={countFrom}
                    isTest={true}
                  />*/}

                {questions.map((element, index) => {
                  return (
                    <Box key={index} sx={{ marginTop: 5 }}>
                      <Typography
                        variant={"h5"}
                        fontWeight={700}
                        color={theme.palette.text.secondary}
                      >
                        {element.section}
                      </Typography>
                      {element.questions.map((question, index) => {
                        if (element.multi) {
                          count = count + question.length;
                          return (
                            <SetQuestion
                              key={index}
                              questions={question}
                              context={question[0]?.context}
                              count={count - question.length}
                              showAnswer={showAnswer}
                              isSubmitted={isSubmitted}
                              addResult={addResult}
                              showActions={false}
                            />
                          );
                        } else {
                          return (
                            <SingleQuestion
                              key={index}
                              {...question}
                              index={++count}
                              showAnswer={showAnswer}
                              isSubmitted={isSubmitted}
                              addResult={addResult}
                              showActions={false}
                            />
                          );
                        }
                      })}
                    </Box>
                  );
                })}
                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}
                >
                  <Button
                    variant="contained"
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontSize: 18,
                      borderRadius: 3,
                      backgroundColor: "#1A4E8DFF",
                      ":hover": {
                        backgroundColor: "rgba(26,78,141,0.8)",
                        boxShadow: "0 0 10px 0 rgba(26,78,141,0.5)",
                      },
                    }}
                    onClick={handleSubmit}
                  >
                    Nộp bài
                  </Button>
                </Box>
              </Box>
            </Container>
          )}

          {/* Dialog xác nhận nộp bài */}
          <Dialog
            open={confirmOpen}
            onClose={() => {
              setConfirmOpen(false);
              setPendingSubmit(false);
            }}
          >
            <DialogContent>
              <Typography variant="h6" mb={2}>
                Bạn có chắc chắn muốn nộp bài?
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                <Button
                  onClick={() => {
                    setConfirmOpen(false);
                    setPendingSubmit(false);
                  }}
                  color="secondary"
                >
                  Hủy
                </Button>
                <Button
                  onClick={() => {
                    setConfirmOpen(false);
                    setIsSubmitted(true);
                    setPendingSubmit(false);
                  }}
                  color="primary"
                  variant="contained"
                >
                  Nộp bài
                </Button>
              </Box>
            </DialogContent>
          </Dialog>

          <Dialog
            open={open}
            onClose={() => null}
            PaperProps={{
              sx: {
                borderRadius: 2,
                padding: 2,
                backgroundColor: "transparent",
                boxShadow: "none",
                minWidth: "100vw",
                display: "flex",
                justifyContent: "center",
              },
            }}
          >
            <DialogContent
              sx={{
                minWidth: 800,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    // right: "-50px",
                    zIndex: 1,
                  }}
                >
                  <img
                    src={excellentSvg}
                    style={{
                      height: 400,
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    maxWidth: 800,
                    position: "relative",
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: "#FFFFFFFF",
                      paddingX: 12,
                      paddingY: 6,
                      borderRadius: 4,
                      position: "relative",
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                      textAlign: "center",
                    }}
                  >
                    <Typography variant="h6">
                      Bạn đã nộp bài thành công!
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        width: "100%",
                        marginTop: 2,
                        flexBasis: "100%",
                        paddingX: 2,
                        gap: 2,
                      }}
                    >
                      <Button
                        variant={"contained"}
                        sx={{
                          backgroundColor: "#1A4E8DFF",
                          paddingX: 3,
                          paddingY: 1,
                          borderRadius: 3,
                          color: "white",
                          ":hover": {
                            backgroundColor: "rgba(26,78,141,0.8)",
                            boxShadow: "0 0 10px 0 rgba(26,78,141,0.5)",
                          },
                        }}
                        onClick={() => {
                          setShowResult(true);
                          setPalette(null);
                          navigate(location.pathname, {
                            state: { noPadding: true },
                          });
                        }}
                      >
                        Xem điểm
                      </Button>
                    </Box>
                    {/*<Typography variant="h6" fontWeight={700} color={"#FF8D6BFF"}>
                  Điểm: {calculateCorrect()}/{result.current.total}
                </Typography>*/}
                  </Box>
                </Box>
              </Box>
            </DialogContent>
          </Dialog>
        </>
      )}
    </>
  );
}
