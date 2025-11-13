import Box from "@mui/material/Box";
import { Alert, Chip, Icon, Typography, useTheme } from "@mui/material";
import * as React from "react";
import Button from "@mui/material/Button";
import { FaCaretUp, FaCaretDown } from "react-icons/fa6";
import { useEffect, useState, useRef } from "react";
import { Checklist } from "@mui/icons-material";
import { IoChevronDownSharp, IoChevronUpSharp } from "react-icons/io5";
import { LuAlarmClock } from "react-icons/lu";
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
  open,
}) {
  let count = 0;
  const theme = useTheme();
  const listRef = useRef(null);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);
  const [leftSec, setLeftSec] = useState(0);
  const autoSubmittedRef = useRef(false);
  const updateScrollButtons = () => {
    const el = listRef.current;
    if (!el) return;
    setCanScrollUp(el.scrollTop > 0);
    setCanScrollDown(el.scrollTop + el.clientHeight < el.scrollHeight - 1);
  };
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
  useEffect(() => {
    updateScrollButtons();
  }, [questions]);
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
  const flatQuestions = questionFlat.flatMap((s) => s.questions);
  const totalQuestions = flatQuestions.length;

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

  useEffect(() => {
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
        slider.addEventListener("mousemove", move, false);
        slider.addEventListener("mousedown", startDragging, false);
        slider.addEventListener("mouseup", stopDragging, false);
        slider.addEventListener("mouseleave", stopDragging, false);
      }
    });
  }, []);
  const handleScrollUp = (e) => {
    e?.stopPropagation();
    const el = listRef.current;
    if (!el) return;
    const step = Math.max(el.clientHeight - 40, 240);
    el.scrollBy({ top: -step, behavior: "smooth" });
  };

  const handleScrollDown = (e) => {
    e?.stopPropagation();
    const el = listRef.current;
    if (!el) return;
    const step = Math.max(el.clientHeight - 40, 240);
    el.scrollBy({ top: step, behavior: "smooth" });
  };

  return (
    <Box
      sx={{
        transition: (theme) =>
          theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        ...(open
          ? {
              width: 240,
              "& .MuiTypography-root": { display: "block" },
              "& .question-palette__list": {
                gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
              },
            }
          : {}),
      }}
    >
      <Box
        sx={{
          minHeight: 48,
          display: open ? "flex" : "none",
          alignItems: "center",
          px: 2.5,
        }}
      >
        <Typography variant="subtitle1" fontWeight={700}>
          Tiến độ làm bài
        </Typography>
      </Box>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
          py: 1,
          backgroundColor: "#EFB034FF",
        }}
      >
        {open && (
          <LuAlarmClock
            style={{
              marginRight: 8,
              fontSize: 28,
            }}
          />
        )}
        <span style={{ fontSize: open ? 16 : 12 }}>{fmt(leftSec)}</span>
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
          onMouseDown={(e) => e.stopPropagation()}
          onClick={handleScrollUp}
          sx={{
            minWidth: 0,
            fontSize: "30px",
            justifySelf: "center",
            cursor: !canScrollUp ? "default" : "pointer",
          }}
          type="button"
        >
          <IoChevronUpSharp />
        </Button>
        <Box
          ref={listRef}
          className="question-palette__list"
          onScroll={updateScrollButtons}
          sx={{
            width: "100%",
            maxHeight: open ? 240 : 120,
            overflowY: "auto",
            ...(!open && {
              "&::-webkit-scrollbar": {
                display: "none",
              },
              scrollbarWidth: "none", // Firefox
              msOverflowStyle: "none", // IE and Edge
            }),
          }}
        >
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
                    // justifyContent: "flex-start",
                    // alignItems: "flex-start",
                    width: "100%",
                    "::-webkit-scrollbar-thumb": {
                      background: "white",
                    },
                    gridTemplateColumns: open
                      ? "repeat(5, minmax(0, 1fr))"
                      : "repeat(1, minmax(0, 1fr))",
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
                          {count < 9 ? `0${++count}` : ++count}
                        </Typography>
                      </Button>
                    );
                  })}
                </Box>
              </Box>
            );
          })}
        </Box>
        <Button
          onMouseDown={(e) => e.stopPropagation()}
          onClick={handleScrollDown}
          sx={{
            minWidth: 0,
            fontSize: "30px",
            justifySelf: "center",
            cursor: !canScrollDown ? "default" : "pointer",
          }}
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
          paddingX: open ? 2 : 1,
          gap: 2,
        }}
      >
        <Button
          variant={"contained"}
          sx={{
            fontSize: open ? "16px" : "14px",
            backgroundColor: "#1A4E8DFF",
            paddingX: open ? 3 : 2,
            paddingY: 1,
            borderRadius: 3,
            color: "white",
            width: open ? "auto" : "40px", // Thêm responsive width cho button
            minWidth: open ? "auto" : "40px",
            ":hover": {
              backgroundColor: "rgba(26,78,141,0.8)",
              boxShadow: "0 0 10px 0 rgba(26,78,141,0.5)",
            },
          }}
          onClick={handleSubmit}
        >
          {open ? (isTest ? "Nộp bài" : "Xem kết quả") : "Nộp"}
        </Button>
      </Box>
    </Box>
  );
}

export default ExamQuestionsPalette;
