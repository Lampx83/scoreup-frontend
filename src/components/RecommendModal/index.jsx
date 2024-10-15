import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import useRecommendModal from "~/hooks/useModalRecommend.jsx";
import Box from "@mui/material/Box";
import {Icon, Typography} from "@mui/material";
import fullCat from "~/assets/images/fullbody.svg";
import sadCat from "~/assets/images/sad.svg";
import happyCat from "~/assets/images/excellent.svg";
import {parseQuestion} from "~/helpers/parseNotionResponseToObject.js";
import QuestionCard from "~/components/Question/QuestionCard/index.jsx";
import {IoCloseCircleOutline} from "react-icons/io5";
import {useEffect, useRef, useState} from "react";
import {getRecommendQuestions, postLogQuestion, trainModel} from "~/services/question.service.js";
import {useCookies} from "react-cookie";
import cookies from "~/utils/cookies.js";
import config from "~/config.js";
import {isEmpty} from "lodash";
import pushToast from "~/helpers/sonnerToast.js";

const LIMIT = 10;


export default function RecommendModal() {
  const {open, handleClose, handleOpen} = useRecommendModal();
  const [isTrue, setIsTrue] = useState("not-selected");
  const [question, setQuestion] = useState(null);
  const [cookie, setCookie, removeCookie] = useCookies(['recommended', 'state']);
  const count = useRef(0);

  const handleContinue = () => {
    setIsTrue("not-selected");
    fetchQuestion();
  }

  const handleStop = () => {
    setIsTrue("not-selected");
    handleClose();

    const state = cookies.get("state", { path: "/" });
    if (state && !isEmpty(state) && !state.answered) {
      postLogQuestion({
        exercise_id: state.id,
        score: 0,
        time_cost: new Date().getTime() - state.startTime,
        user_ans: [],
        correct_ans: state.correct_ans,
        isRecommended: true,
        answered: false
      })
    }
    removeCookie('state', {});

    const trainInput = JSON.parse(localStorage.getItem("trainInput"));
    if (trainInput) {
      let lastIndex = trainInput.transitions.length - 1;
      if (lastIndex >= 1 && !trainInput?.transitions[lastIndex]?.next_state) {
        trainInput.transitions.pop();
        lastIndex = trainInput.transitions.length - 1;
      }

      if (lastIndex >= 1) {
        trainInput.transitions[lastIndex].done = 1;
        trainModel(trainInput);
      }
    }
  }

  const fetchQuestion = async () => {
    try {
      count.current++;
      const body = {};
      if (cookie['state']) {
        body.difficulty = cookie['state'].difficulty;
        body.score = cookie['state'].score;
        body.bookmarked = cookie['state'].bookmarked;
        body.knowledge_concept = cookie['state'].knowledge_concept;
      }
      const res = await getRecommendQuestions(body);
      const parsed = parseQuestion(res?.exercise);
      setQuestion({
        ...parsed,
        index: `${count.current}/${LIMIT}`
      });

      const trainInput = JSON.parse(localStorage.getItem("trainInput"));
      if (trainInput && cookie?.state) {
        const state = cookie.state;
        trainInput.transitions.push({
          state: [
            state.id,
            state.difficulty,
            state.score,
            state.bookmarked,
            state.knowledge_concept
          ],
          action: parsed.id,
          done: 0
        });
        localStorage.setItem("trainInput", JSON.stringify(trainInput));
      }


      setCookie('recommended', true, {
        path: '/',
        maxAge: 60 * 60 // 1 hour
      });
    } catch (error) {
      pushToast("Có lỗi xảy ra, hãy chắc rằng bạn đã luyện tập trước khi yêu cầu gợi ý!", 'error');
      handleClose();
    }
  }

  useEffect(() => {
    if (open) {
      const trainInput = {
        chapter: config.CURRENT_CHAPTER,
        user_id: cookies.get("user", { path: "/" })._id,
        transitions: []
      }
      localStorage.setItem("trainInput", JSON.stringify(trainInput));

      fetchQuestion();
    } else {
      localStorage.removeItem("trainInput");
      setQuestion(null);
      count.current = 0;
    }
  }, [open]);

  useEffect(() => {
    if (!cookie.recommended) {
      handleOpen();
      removeCookie("state", {});
    }
  }, []);

  const handleAnswer = (isCorrect) => {
    const state = cookies.get("state", { path: "/" });
    if (state && !isEmpty(state)) {
      state.score = Number(isCorrect);
      state.answered = true;
      cookies.set("state", state, { path: "/" });
    }

    const trainInput = JSON.parse(localStorage.getItem("trainInput"));
    if (state && !isEmpty(state) && trainInput) {
      const lastIndex = trainInput.transitions.length - 1;

      if (lastIndex >= 0) {
        trainInput.transitions[lastIndex].next_state = [
          state.id,
          state.difficulty,
          state.score,
          state.bookmarked,
          state.knowledge_concept
        ];
        localStorage.setItem("trainInput", JSON.stringify(trainInput));
      }
    }

    if (isCorrect) {
      setIsTrue(true);
    } else {
      setIsTrue(false);
    }
  }

  return (
    <>
      {/*<Button*/}
      {/*  variant={"contained"}*/}
      {/*  color={"error"}*/}
      {/*  onClick={handleRemoveCookie}*/}
      {/*>clear cookie</Button>*/}
      {/*<Button*/}
      {/*  variant={"contained"}*/}
      {/*  color={"info"}*/}
      {/*  onClick={handleOpen}*/}
      {/*>Open</Button>*/}
      <Dialog
        open={open}
        onClose={handleStop}
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
        // aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
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
              display: "flex"
            }}
          >
            <Box>
              <img
                src={isTrue === 'not-selected' ? fullCat : isTrue === false ? sadCat : happyCat}
                style={{
                  height: 400
                }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{
                  backgroundColor: "#ADCBF0FF",
                  padding: 4,
                  borderRadius: "59px 59px 59px 0px",
                  position: "relative",
                }}
              >
                <Button
                  sx={{
                    padding: 0,
                    minWidth: 0,
                    position: "absolute",
                    right: 0,
                    top: 0,
                    backgroundColor: "#ADCBF0FF",
                    "&:hover": {
                      backgroundColor: "#ADCBF0FF",
                    }
                  }}
                >
                  <Icon as={IoCloseCircleOutline} onClick={handleStop}/>
                </Button>
                {isTrue === "not-selected" && <Box>
                  <Typography variant="h6">
                    {"Bạn hãy thử sức với câu hỏi gợi ý dưới đây!"}
                  </Typography>
                </Box>}
                {isTrue !== "not-selected" && count.current < LIMIT &&
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 1
                    }}
                  >
                    <Typography variant="h6" textAlign={"center"}>
                      {isTrue === false ? "Sai mất rồi! Bạn có muốn thử lại không?" : "Giỏi quá! Bạn có có muốn tiếp tục không?"}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        justifyContent: "center"
                      }}
                    >
                      <Button
                        size={"small"}
                        sx={{
                          backgroundColor: '#1A4E8DFF',
                          borderRadius: 1,
                          color: 'white',
                          fontWeight: 700,
                          paddingX: 1,
                          ':hover': {
                            backgroundColor: 'rgba(26,78,141,0.8)',
                            boxShadow: '0 0 10px 0 rgba(26,78,141,0.5)'
                          }
                        }}
                        onClick={handleContinue}
                      >
                        Làm tiếp
                      </Button>
                      <Button
                        size={"small"}
                        sx={{
                          backgroundColor: '#FF8D6BFF',
                          borderRadius: 1,
                          color: 'white',
                          fontWeight: 700,
                          paddingX: 1,
                          ':hover': {
                            backgroundColor: 'rgba(255,141,107,0.8)',
                            boxShadow: '0 0 10px 0 rgba(255,141,107,0.5)'
                          }
                        }}
                        onClick={handleStop}
                      >
                        Dừng lại
                      </Button>
                    </Box>
                  </Box>
                }
                {isTrue !== "not-selected" && count.current >= LIMIT &&
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 1
                    }}
                  >
                    <Typography variant="h6" textAlign={"center"}>
                      {"Bạn đã hoàn thành hết các bài tập gợi ý lần này!"}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        justifyContent: "center"
                      }}
                    >
                      <Button
                        size={"small"}
                        sx={{
                          backgroundColor: '#FF8D6BFF',
                          borderRadius: 1,
                          color: 'white',
                          fontWeight: 700,
                          paddingX: 1,
                          ':hover': {
                            backgroundColor: 'rgba(255,141,107,0.8)',
                            boxShadow: '0 0 10px 0 rgba(255,141,107,0.5)'
                          }
                        }}
                        onClick={handleStop}
                      >
                        Đóng
                      </Button>
                    </Box>
                  </Box>
                }
              </Box>
              <Box
                sx={{
                  backgroundColor: "#F2F7FDFF",
                  padding: 2,
                  borderRadius: "0px 59px 59px 59px",
                  marginTop: 2
                }}
              >
                <QuestionCard {...question} indexRcm={count.current} showAnswer={true} setIsTrue={handleAnswer} isRecommended={true}/>
              </Box>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}