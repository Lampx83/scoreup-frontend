import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import useRecommendModal from "~/hooks/useModalRecommend.jsx";
import Box from "@mui/material/Box";
import {Icon, Rating, Typography} from "@mui/material";
import detectiveCat from "~/assets/images/detectiveCat.png";
import {parseQuestion} from "~/helpers/parseNotionResponseToObject.js";
import QuestionCard from "~/components/Question/QuestionCard/index.jsx";
import {IoCloseCircleOutline} from "react-icons/io5";
import {useEffect, useRef, useState} from "react";
import {getRecommendQuestions, saveRatingRecommend} from "~/services/question.service.js";
import {useCookies} from "react-cookie";
import pushToast from "~/helpers/sonnerToast.js";
import {Star} from "@mui/icons-material";


export default function RecommendModal() {
  const {open, handleClose, handleOpen} = useRecommendModal();
  const [questions, setQuestions] = useState([]);
  const [cookie, setCookie, removeCookie] = useCookies(['recommended', 'state']);
  const count = useRef(0);
  const [message, setMessage] = useState(null);
  const [clusters, setClusters] = useState([]);
  const [doneCount, setDoneCount] = useState(0);

  const handleStop = () => {
    handleClose();
    setDoneCount(0);
    setMessage(null);
    setClusters([]);
  }

  const handleIncreaseDoneCount = () => {
    setDoneCount(prev => prev + 1);
  }

  const fetchQuestions = async () => {
    try {
      count.current++;
      const res = await getRecommendQuestions();
      const questions = res?.recommendations?.exercise_ids?.map(item => parseQuestion(item)) || [];
      setQuestions(questions);
      setMessage(res?.recommendations?.message || "Bạn hãy thử sức với câu hỏi gợi ý dưới đây!");
      setClusters(res?.recommendations?.clusters || []);

      setCookie('recommended', true, {
        path: '/',
        maxAge: 60 * 60 * 24 // 1 day
      });
    } catch (error) {
      pushToast("Có lỗi xảy ra, hãy chắc rằng bạn đã luyện tập trước khi yêu cầu gợi ý!", 'error');
      handleClose();
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
                  {doneCount === questions.length ? (
                    <>
                      <Typography variant="h6" width={"100%"} color="success">
                        Gợi ý vừa rồi phù hợp với bạn như thế nào?
                      </Typography>
                      <RatingComponent clusters={clusters}/>
                    </>
                  ): (
                    <Typography variant="h6" width={"100%"}>
                      {message}
                    </Typography>
                  )}
                </Box>
              </Box>
              <Box
                sx={{
                  backgroundColor: "#F2F7FDFF",
                  padding: 2,
                  borderRadius: "0px 59px 59px 59px",
                  marginTop: 2,
                  width: "100%",
                  overflow: "auto",
                }}
              >
                {questions.length > 0 && questions.map((question, index) => (
                  <QuestionCard {...question} indexRcm={index + 1} showAnswer={true} isRecommended={true} key={question.id} handleIncreaseDoneCount={handleIncreaseDoneCount}/>
                ))}
              </Box>
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
  clusters = []
}) {
  const [ratingValue, setRatingValue] = useState(0);
  const onChange = async (event, newValue) => {
    setRatingValue(newValue);
  }
  const onSubmit = async () => {
    try {
      const res = await saveRatingRecommend({
        clusters,
        rating: ratingValue
      });
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