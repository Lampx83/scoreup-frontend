import Box from "@mui/material/Box";
import { Icon, Typography, useTheme } from "@mui/material";
import * as React from "react";
import Button from "@mui/material/Button";
import { FaCaretUp, FaCaretDown } from "react-icons/fa6";
import {useEffect} from "react";

function QuestionsPalette({ questions = [] }) {
  let count = 0;
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

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
      behavior: 'smooth',
      block: 'center',
      inline: 'center'
    });
    handleToggleQuestionPalette();
  };

  const handleToggleQuestionPalette = (e) => {
    const element = document.getElementById("question-palette");
    if (element.style.top === '0px' || !element.style.top) {
      element.style.top = `calc(${-element.offsetHeight}px)`;
    } else {
      element.style.top = '0';
    }
    setOpen(!open);
  }

  useEffect(() => {
    // drag questions palette
    const sliders = document.querySelectorAll('.question-palette__list');
    sliders?.forEach(slider => {
      let mouseDown = false;
      let startX, scrollLeft;

      if (slider) {
        const startDragging = (e) => {
          mouseDown = true;
          startX = e.pageX - slider.offsetLeft;
          scrollLeft = slider.scrollLeft;
        }

        const stopDragging = (e) => {
          mouseDown = false;
        }

        const move = (e) => {
          e.preventDefault();
          if (!mouseDown) {
            return;
          }
          const x = e.pageX - slider.offsetLeft;
          const scroll = x - startX;
          slider.scrollLeft = scrollLeft - scroll;
        }
        // drag questions palette

        // Add the event listeners
        slider.addEventListener('mousemove', move, false);
        slider.addEventListener('mousedown', startDragging, false);
        slider.addEventListener('mouseup', stopDragging, false);
        slider.addEventListener('mouseleave', stopDragging, false);
      }
      // end drag questions palette
    });
  }, []);

  return (
    <Box
      id={"question-palette"}
      sx={{
        marginTop: 2,
        borderRadius: 3,
        paddingY: 2,
        position: "sticky",
        top: 0,
        zIndex: 1,
        backgroundColor: theme.palette.questionBackground.secondary,
        transition: "all 0.5s",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "flex-start",
        '& .question-palette__item--not-sure': {
          backgroundColor: '#FFDE4D !important',
        }
      }}
    >
      {questionFlat.map((element, index) => {
        return (
          <Box
            key={index}
            sx={{
              color: theme.palette.text.primary,
              borderRadius: 3,
              paddingX: 2,
              paddingY: 1,
              // flexBasis: "30%"
            }}
          >
            <Typography
              variant={"h6"}
              fontWeight={700}
              color={theme.palette.text.secondary}
            >
              {element.section}
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                flexWrap: "wrap",
                gap: 1,
                height: "100px",
                overflow: "auto",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                width: "fit-content",
                marginTop: 1,
                "::-webkit-scrollbar-thumb": {
                  background: "white",
                },
              }}
            >
              {element.questions.map((_, index) => {
                return (
                  <Button
                    key={index}
                    sx={{
                      // padding: 1,
                      minWidth: 0,
                      width: 35,
                      backgroundColor: theme.palette.questionBackground.primary,
                    }}
                    id={`question-palette-${_.id}`}
                    onClick={() => handleSelectQuestion(_.id)}
                  >
                    <Typography variant={"body1"}>{++count}</Typography>
                  </Button>
                );
              })}
            </Box>
          </Box>
        );
      })}
      <Icon
        as={open ? FaCaretDown : FaCaretUp}
        sx={{
          color: theme.palette.text.primary,
          fontSize: 30,
          cursor: "pointer",
          position: "absolute",
          bottom: -30,
          right: 0,
          backgroundColor: theme.palette.questionBackground.secondary,
          borderRadius: "0 0 10px 10px",
          boxSizing: "content-box",
          padding: 0.5
        }}
        onClick={(e) => handleToggleQuestionPalette(e)}
      />
    </Box>
  );
}

export default QuestionsPalette;