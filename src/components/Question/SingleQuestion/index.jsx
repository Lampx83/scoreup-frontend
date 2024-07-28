import Box from "@mui/material/Box";
import { useTheme } from "@mui/material";
import * as React from "react";
import QuestionCard from "~/components/Question/QuestionCard/index.jsx";

function SingleQuestion(props) {
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
        {...props}
      />
    </Box>
  )
}

export default SingleQuestion;