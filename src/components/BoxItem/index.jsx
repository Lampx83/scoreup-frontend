import { Box, Tooltip, Typography } from "@mui/material";
import Chip from "@mui/material/Chip";
import { useNavigate } from "react-router-dom";
const colors = {
  bookmarked: "#FFF6D9FF",
  "spaced-repetition": "#FFE6DFFF",
  "content-based filtering": "#E5FBF7FF",
};

const chipColors = {
  bookmarked: "#EFB034FF",
  "spaced-repetition": "#DE3B40FF",
  "content-based filtering": "#1EB89BFF",
};

export default function BoxItem({ question, type, desc, index }) {
  const navigate = useNavigate();

  const handleNavigate = () => {
    // Use the state object to pass the index
    navigate(`/detail-recommend`, {
      state: { targetIndex: index },
      replace: true,
    });
    // Add the hash after navigation
    setTimeout(() => {
      window.location.hash = index;
    }, 50);
  };

  return (
    <Box
      sx={{
        padding: 2,
        border: "1px solid #E0E0E0",
        borderRadius: 2,
        boxShadow: 1,
        backgroundColor: colors[type],
        cursor: "pointer",
      }}
      onClick={handleNavigate}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          marginBottom: 1,
        }}
      >
        <Chip
          label={desc}
          size={"small"}
          sx={{
            backgroundColor: chipColors[type],
            color: "#FFFFFF",
            fontWeight: 600,
          }}
        />
      </Box>
      <Tooltip title={question.question}>
        <Typography
          variant="body1"
          fontWeight={600}
          sx={{
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
            maxWidth: "100%",
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
            <Tooltip title={`(${option.option}) ${option.text}`} key={index}>
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
