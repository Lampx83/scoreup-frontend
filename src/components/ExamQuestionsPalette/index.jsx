import Box from "@mui/material/Box";
import { Alert, Chip, Icon, Typography, useTheme } from "@mui/material";
import * as React from "react";
import Button from "@mui/material/Button";
import { FaCaretUp, FaCaretDown } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { Checklist } from "@mui/icons-material";
import { IoChevronDownSharp } from "react-icons/io5";
import { IoChevronUpSharp } from "react-icons/io5";
let interval = null;

function ExamQuestionsPalette({
  questions = [],
  setShowAnswer,
  setIsSubmitted,
  showAnswer = false,
  isSubmitted = false,
  result = null,
  countFrom = null,
  isTest = false,
}) {
  let count = 0;
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

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

  const questionFlat = questions.map((element) => {
    const newElement = { ...element, questions: [...element.questions] };

    if (newElement.multi) {
      newElement.questions = newElement.questions.flatMap((item) => item);
    }

    return newElement;
  });

  const handleSelectQuestion = (id) => {
    const element = document.getElementById(id);
    element.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
    handleToggleQuestionPalette();
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    if (isTest) {
      clearInterval(interval);
    }
  };

  const handleToggleQuestionPalette = (e) => {
    const element = document.getElementById("question-palette");
    if (element.style.top === "0px" || !element.style.top) {
      element.style.top = `calc(${-element.offsetHeight}px)`;
    } else {
      element.style.top = "0";
    }
    setOpen(!open);
  };

  useEffect(() => {
    // drag questions palette
    const sliders = document.querySelectorAll(".question-palette__list");
    sliders?.forEach((slider) => {
      let mouseDown = false;
      let startX, scrollLeft;

      if (slider) {
        const startDragging = (e) => {
          mouseDown = true;
          startX = e.pageX - slider.offsetLeft;
          scrollLeft = slider.scrollLeft;
        };

        const stopDragging = (e) => {
          mouseDown = false;
        };

        const move = (e) => {
          e.preventDefault();
          if (!mouseDown) {
            return;
          }
          const x = e.pageX - slider.offsetLeft;
          const scroll = x - startX;
          slider.scrollLeft = scrollLeft - scroll;
        };
        // drag questions palette

        // Add the event listeners
        slider.addEventListener("mousemove", move, false);
        slider.addEventListener("mousedown", startDragging, false);
        slider.addEventListener("mouseup", stopDragging, false);
        slider.addEventListener("mouseleave", stopDragging, false);
      }
      // end drag questions palette
    });
  }, []);
  const [scrollIndex, setScrollIndex] = useState(0);
  const questionsPerPage = 30;
  const handleScrollUp = () => {
    setScrollIndex((prev) => Math.max(prev - questionsPerPage, 0));
  };
  const handleScrollDown = () => {
    setScrollIndex((prev) =>
      Math.min(prev + questionsPerPage, questions.length - questionsPerPage)
    );
  };
  const visibleQuestions = questions.slice(
    scrollIndex,
    scrollIndex + questionsPerPage
  );
  return (
    <>
      <Box
        sx={{
          minHeight: 48,
          display: "flex",
          alignItems: "center",
          px: 2.5,
        }}
      >
        <Typography variant="subtitle1" fontWeight={700}>
          Tiến độ làm bài
        </Typography>
      </Box>
      <Box
        id={"exam-question-palette"}
        sx={{
          top: 0,
          margin: 0,
          padding: "0!important",
          zIndex: 1,
          border: `1px solid ${theme.palette.divider}`,
          backgroundColor: "#F2F7FDFF !important",
          transition: "all 0.5s",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          flexWrap: "wrap",
          justifyContent: "flex-start",
          "& .question-palette__item--not-sure": {
            backgroundColor: "#FFDE4D !important",
          },
          "& .question-palette__item--mastered": {
            backgroundColor: "#03DAC6FF !important",
          },
        }}
      >
        <Button
          onClick={handleScrollUp}
          disabled={scrollIndex === 0}
          sx={{ minWidth: 0, fontSize: "30px", justifySelf: "center" }}
        >
          <IoChevronUpSharp />
        </Button>

        {questionFlat.map((element, index) => {
          return (
            <Box
              key={index}
              sx={{
                color: theme.palette.text.primary,
                borderRadius: 0,
                paddingX: 2,
                paddingY: 1,
                width: "100%",
                // flexBasis: "30%"
              }}
            >
              <Box
                sx={{
                  display: "grid",
                  // flexDirection: "column",
                  flexWrap: "wrap",
                  gap: 1,
                  // height: "100px",
                  overflow: "auto",
                  // justifyContent: "flex-start",
                  // alignItems: "flex-start",
                  width: "100%",
                  "::-webkit-scrollbar-thumb": {
                    background: "white",
                  },
                  gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
                  justifyItems: "center",
                  alignItems: "center",
                }}
              >
                {element.questions.map((_, index) => {
                  return (
                    <Button
                      key={index}
                      sx={{
                        // padding: 1,
                        minWidth: 0,
                        width: 32,
                        height: 32,
                        backgroundColor: "white",
                        borderColor: "#BCC1CAFF",
                        borderWidth: 1,
                        borderStyle: "solid",
                        borderRadius: "50%",
                        placeSelf: "center",
                      }}
                      id={`question-palette-${_.id}`}
                      onClick={() => handleSelectQuestion(_.id)}
                    >
                      <Typography variant={"caption"}>
                        {count < 10 ? `0${++count}` : ++count}
                      </Typography>
                    </Button>
                  );
                })}
              </Box>
            </Box>
          );
        })}
        <Button
          onClick={handleScrollDown}
          disabled={scrollIndex + questionsPerPage >= questions.length}
          sx={{ minWidth: 0, fontSize: "30px", justifySelf: "center" }}
        >
          <IoChevronDownSharp />
        </Button>
      </Box>
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
          onClick={handleSubmit}
        >
          {isTest ? "Nộp bài" : "Xem kết quả"}
        </Button>
      </Box>
    </>
  );
}

export default ExamQuestionsPalette;
