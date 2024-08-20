import {useTheme} from "@mui/material";
import QuestionCard from "~/components/Question/QuestionCard/index.jsx";
import Box from "@mui/material/Box";
import * as React from "react";
import parse from 'html-react-parser';

function SetQuestion({
  context = "",
  questions = [],
  count = 0,
  showAnswer = false,
  isSubmitted = false
}) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        backgroundColor: theme.palette.questionBackground.primary,
        borderRadius: 2,
        marginY: 2,
      }}
    >
      <Box>
        <Box
          sx={{
            padding: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: 'center'
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "center",
                width: "100%"
              }}
            >
              <Box
                sx={{
                  backgroundColor: theme.palette.questionBackground.secondary,
                  padding: 1,
                  borderRadius: 2,
                  color: theme.palette.text.secondary,
                  width: "100%",
                  '& img': {
                    width: "100%",
                    height: "auto"
                  }
                }}
              >
                {parse(context)}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      {questions.map((question, index) => (
        <QuestionCard
          key={index}
          {...question}
          index={++count}
          showAnswer={showAnswer}
          isSubmitted={isSubmitted}
        />
      ))}
    </Box>
  )
}

export default SetQuestion;