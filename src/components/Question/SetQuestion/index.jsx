import {useTheme} from "@mui/material";
import QuestionCard from "~/components/Question/QuestionCard/index.jsx";
import Box from "@mui/material/Box";
import * as React from "react";
import parse from 'html-react-parser';

function SetQuestion({
  context = "",
  questions = [],
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
                alignItems: "center"
              }}
            >
              <Box
                sx={{
                  backgroundColor: theme.palette.questionBackground.secondary,
                  padding: 1,
                  borderRadius: 2,
                  color: theme.palette.text.secondary,
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
          context={context}
          question={question?.question}
          options={question?.options}
          code={question?.code}
          image={question?.image}
          audio={question?.audio}
        />
      ))}
    </Box>
  )
}

export default SetQuestion;