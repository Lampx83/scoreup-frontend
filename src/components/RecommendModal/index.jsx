import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import useRecommendModal from "~/hooks/useModalRecommend.jsx";
import Box from "@mui/material/Box";
import {Chip, Icon, Rating, Typography} from "@mui/material";
import detectiveCat from "~/assets/images/detectiveCat.png";
import {parseQuestion} from "~/helpers/parseNotionResponseToObject.js";
import QuestionCard from "~/components/Question/QuestionCard/index.jsx";
import {IoCloseCircleOutline} from "react-icons/io5";
import {useEffect, useRef, useState} from "react";
import {getRecommendQuestions, postLogQuestion, saveRatingRecommend} from "~/services/question.service.js";
import {useCookies} from "react-cookie";
import pushToast from "~/helpers/sonnerToast.js";
import {Star} from "@mui/icons-material";
import {Link} from "react-router-dom";
import {IoIosArrowBack, IoIosArrowForward} from "react-icons/io";


export default function RecommendModal() {
  const {open, handleClose, handleOpen} = useRecommendModal();
  const [questions, setQuestions] = useState([]);
  const [cookie, setCookie, removeCookie] = useCookies(['recommended', 'state']);
  const count = useRef(0);
  const [message, setMessage] = useState(null);
  const [clusters, setClusters] = useState([]);
  const [doneCount, setDoneCount] = useState(0);
  const [showingQuestion, setShowingQuestion] = useState(0);
  const [answeredList, setAnsweredList] = useState([]);
  let startTime = new Date();

  const handleStop = () => {
    handleClose();
    setDoneCount(0);
    setMessage(null);
    setClusters([]);
  }

  const handleIncreaseDoneCount = (id) => {
    setDoneCount(prev => prev + 1);
    setAnsweredList(prev => [...prev, id]);
  }

  const fetchQuestions = async () => {
    try {
      count.current++;
      const res = await getRecommendQuestions();
      const questions = res?.recommendations?.exercise_ids?.map(item => parseQuestion(item)) || [];
      setQuestions(questions);
      setMessage(res?.recommendations?.message || "Bạn hãy thử sức với câu hỏi gợi ý dưới đây!");
      setClusters(res?.recommendations?.clusters || []);

      setShowingQuestion(0);

      setCookie('recommended', true, {
        path: '/',
        maxAge: 60 * 60 * 24 // 1 day
      });
    } catch (error) {
      pushToast("Có lỗi xảy ra, hãy chắc rằng bạn đã luyện tập trước khi yêu cầu gợi ý!", 'error');
      handleClose();
    }
  }

  const navigateQuestion = async (index) => {
    if (index >= 0 && index < questions.length) {
      if (!answeredList.includes(questions[showingQuestion].id)) {
        await postLogQuestion({
          exercise_id: questions[showingQuestion].id,
          score: 0,
          time_cost: new Date().getTime() - startTime.getTime(),
          user_ans: "",
          correct_ans: [questions[showingQuestion].correct],
          isRecommended: true,
          answered: false,
          indexRcm: showingQuestion + 1
        });
      }

      setShowingQuestion(index);
    }
  }

  useEffect(() => {
    if (open) {
      fetchQuestions();
    }
  }, [open]);

  useEffect(() => {
    if (!cookie.recommended) {
      handleOpen();
    }
  }, []);

  return (
    <>
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
            <Box
              sx={{
                position: "relative",
                right: "-50px",
                zIndex: 1,
              }}
            >
              <img
                src={detectiveCat}
                style={{
                  height: 400
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
                <Box sx={{
                  width: "100%",
                }}>
                  {(doneCount === questions.length && doneCount !== 0) ? (
                    <>
                      <Typography variant="h6" width={"100%"} color="success">
                        Gợi ý vừa rồi phù hợp với bạn như thế nào?
                      </Typography>
                      <RatingComponent clusters={clusters} handleStop={handleStop}/>
                    </>
                  ): (
                    <>
                      <Typography variant="h6" width={"100%"}>
                        {message}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          justifyContent: "center",
                          marginTop: 2,
                          alignItems: "center"
                        }}
                      >
                        <Button
                          size={"small"}
                          sx={{
                            backgroundColor: '#1A4E8DFF',
                            borderRadius: 5,
                            color: 'white',
                            paddingX: 1,
                            ':hover': {
                              backgroundColor: 'rgba(26,78,141,0.8)',
                              boxShadow: '0 0 10px 0 rgba(26,78,141,0.5)'
                            }
                          }}
                          startIcon={<Icon as={IoIosArrowBack}/>}
                          onClick={() => navigateQuestion(showingQuestion - 1)}
                        >
                          Quay lại
                        </Button>
                        <Chip
                          label={`${showingQuestion + 1}/${questions.length}`}
                          color="info"
                          size={"small"}
                        />
                        <Button
                          size={"small"}
                          sx={{
                            backgroundColor: '#1A4E8DFF',
                            borderRadius: 5,
                            color: 'white',
                            paddingX: 1,
                            ':hover': {
                              backgroundColor: 'rgba(26,78,141,0.8)',
                              boxShadow: '0 0 10px 0 rgba(26,78,141,0.5)'
                            }
                          }}
                          endIcon={<Icon as={IoIosArrowForward}/>}
                          onClick={() => navigateQuestion(showingQuestion + 1)}
                        >
                          Tiếp theo
                        </Button>
                      </Box>
                    </>
                  )}
                </Box>
              </Box>
              {questions.length > 0 && <Box
                sx={{
                  backgroundColor: "#F2F7FDFF",
                  padding: 2,
                  borderRadius: "0px 59px 59px 59px",
                  marginTop: 2,
                  width: "100%",
                  overflow: "auto",
                }}
              >
                {questions.map((question, index) => (
                  <Box key={question.id}
                       sx={{
                         display: index === showingQuestion ? "block" : "none",
                       }}
                  >
                    <QuestionCard {...question} indexRcm={index + 1} showAnswer={true} isRecommended={true}
                                  handleIncreaseDoneCount={handleIncreaseDoneCount}
                                  startTime={startTime}
                    />
                  </Box>
                ))}
              </Box>}
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}

const ratingLabels = {
  1: "Hoàn toàn không phù hợp",
  2: "Phù hợp một chút",
  3: "Khá phù hợp",
  4: "Rất phù hợp",
  5: "Hoàn toàn phù hợp"
}

function RatingComponent({
  clusters = [],
  handleStop = () => {}
}) {
  const [ratingValue, setRatingValue] = useState(5);
  const onChange = async (event, newValue) => {
    setRatingValue(newValue);
  }
  const onSubmit = async () => {
    try {
      const res = await saveRatingRecommend({
        clusters,
        rating: ratingValue
      });
      pushToast("Cảm ơn bạn đã đánh giá!", 'success');
      handleStop();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", marginTop: 1}}>
      <Box sx={{display: "flex", gap: 1, flexDirection: "column", alignItems: "center"}}>
        <Typography variant="body2" color="textSecondary">{ratingLabels[ratingValue]}</Typography>
        <Rating
          size={"large"}
          name={"rating"}
          value={ratingValue}
          precision={1}
          onChange={onChange}
          emptyIcon={<Star style={{ opacity: 0.55 }} fontSize="inherit" />}
        />
        <Button variant="contained" color="info"
                sx={{
                  backgroundColor: "#2774D3FF",
                  borderRadius: 5,
                  color: "white",
                  fontSize: "12px",
                  ':hover': {
                    backgroundColor: "rgba(26,78,141,0.8)",
                    boxShadow: "0 0 10px 0 rgba(26,78,141,0.5)"
                  }
                }}
                onClick={onSubmit}
                size={"small"}>Gửi đánh giá</Button>
      </Box>
    </Box>
  )
}