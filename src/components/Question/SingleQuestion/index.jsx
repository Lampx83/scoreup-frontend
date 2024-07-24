import Box from "@mui/material/Box";
import { useTheme } from "@mui/material";
import * as React from "react";
import QuestionCard from "~/components/Question/QuestionCard/index.jsx";

function SingleQuestion({
  context = "",
  question = "",
  options = [],
  code = "",
  image = "",
  audio = "",
  index = "1"
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
      <QuestionCard
        question={question}
        options={options}
        code={code}
        image={image}
        audio={audio}
        index={index}
      />
    </Box>
  )
}

export default SingleQuestion;