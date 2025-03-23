import { Box, Tooltip, Typography } from "@mui/material";
import Chip from "@mui/material/Chip";

export default function BoxItem({ question }) {
  console.log(question);

  return (
    <Box
      sx={{
        padding: 2,
        border: "1px solid #E0E0E0",
        borderRadius: 2,
        boxShadow: 1,
        backgroundColor: "#FFFFFF",
        cursor: "pointer",
      }}
    >
      <Tooltip title={question.question}>
        <Typography
          variant="body1"
          fontWeight={600}
          sx={{
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
            maxWidth: "100%",
            marginBottom: 3,
          }}
        >
          Câu hỏi: {question.question}
        </Typography>
      </Tooltip>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          marginTop: 1,
        }}
      >
        {question.options.map((option, index) => {
          return (
            <Tooltip title={`(${option.option}) ${option.text}`}>
              <Chip
                key={index}
                variant="outlined"
                sx={{
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  maxWidth: "100%",
                  textAlign: "left",
                  justifyContent: "flex-start",
                  border: "1px solid #FFCA1CFF",
                }}
                label={`(${option.option}) ${option.text}`}
              ></Chip>
            </Tooltip>
          );
        })}
      </Box>
    </Box>
  );
}
