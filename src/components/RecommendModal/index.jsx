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
import {useEffect, useState} from "react";
import {getRecommendQuestions} from "~/services/question.service.js";
import cookies from "~/utils/cookies.js";
import config from "~/config.js";
import pushToast from "~/helpers/sonnerToast.js";


export default function RecommendModal() {
  const {open, handleClose, handleOpen} = useRecommendModal();
  const [isTrue, setIsTrue] = useState("not-selected");
  const [question, setQuestion] = useState(null);

  const handleContinue = () => {
    setIsTrue("not-selected");
  }

  const handleStop = () => {
    setIsTrue("not-selected");
    handleClose();
  }

  const fetchQuestion = async () => {
    try {
      const res = await getRecommendQuestions({});
    } catch (error) {
      pushToast(error?.response?.data?.message || error.message, 'error');
    }
  }
  useEffect(() => {
    if (open) {
      fetchQuestion();
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
            minWidth: 1000
          },
        }}
        // aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent
          sx={{
            minWidth: 800
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
                {isTrue !== "not-selected" &&
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
              </Box>
              <Box
                sx={{
                  backgroundColor: "#F2F7FDFF",
                  padding: 2,
                  borderRadius: "0px 59px 59px 59px",
                  marginTop: 2
                }}
              >
                <QuestionCard {...question} showAnswer={true} setIsTrue={setIsTrue} />
              </Box>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}