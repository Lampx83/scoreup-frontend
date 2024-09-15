import Box from "@mui/material/Box";
import {Icon, Typography, useTheme} from "@mui/material";
import Button from "@mui/material/Button";
import {FaCheck, FaRegComment, FaRegLightbulb} from "react-icons/fa";
import {FaRegFaceSadTear} from "react-icons/fa6";
import { FaFlag } from "react-icons/fa6";
import * as React from "react";
import Comments from "~/components/Question/Comments/index.jsx";
import pushToast from "~/helpers/sonnerToast.js";

function Actions({
  id = "",
  totalComments = 0
}) {
  const theme = useTheme();
  const [openComments, setOpenComments] = React.useState(false);

  const handleToggleComments = () => {
    setOpenComments(!openComments);
  }

  const handleMastered = (id) => {
    pushToast("Chúng tôi sẽ hạn chế hiển thị câu hỏi này trong tương lai!", "success");
  }

  const handleNotSure = (id) => {
    const element = document.getElementById(`question-palette-${id}`);
    if (element?.classList?.contains("question-palette__item--not-sure")) {
      element?.classList?.remove("question-palette__item--not-sure");
      return;
    }
    pushToast("Những đề xuất tiếp theo sẽ tập trung vào chủ đề tương tự!", "warning");
    document?.getElementById(`question-palette-${id}`)?.classList?.toggle("question-palette__item--not-sure");
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          gap: 1,
          justifyContent: "space-between",
        }}
      >
        <Button
          variant={"contained"}
          sx={{
            backgroundColor: "#1A4E8DFF",
            borderRadius: 5,
            color: "white",
            fontSize: "12px",
            ':hover': {
              backgroundColor: "rgba(26,78,141,0.8)",
              boxShadow: "0 0 10px 0 rgba(26,78,141,0.5)"
            }
          }}
          onClick={handleToggleComments}
        >
          <Icon as={FaRegComment} sx={{marginRight: 1, fontSize: '16px'}}/>
          Bình luận ({totalComments})
        </Button>
        <Box sx={{display: "flex", gap: 1}}>
          <Button
            variant={"contained"}
            sx={{
              backgroundColor: "#03DAC6FF",
              borderRadius: 5,
              color: "white",
              fontSize: "12px",
              ':hover': {
                backgroundColor: "rgba(3,218,198,0.7)",
                boxShadow: "0 0 10px 0 rgba(3,218,198,0.5)"
              }
            }}
            onClick={() => handleMastered(id)}
          >
            <Icon as={FaCheck} sx={{marginRight: 1, fontSize: '16px'}}/>
            Đã thành thạo
          </Button>
          <Button
            variant={"contained"}
            sx={{
              backgroundColor: "#FF8D6BFF",
              borderRadius: 5,
              color: "white",
              fontSize: "12px",
              ':hover': {
                backgroundColor: "rgba(255,141,107,0.8)",
                boxShadow: "0 0 10px 0 rgba(255,141,107,0.5)"
              }
            }}
            onClick={() => handleNotSure(id)}
          >
            <Icon as={FaFlag} sx={{marginRight: 1, fontSize: '16px'}}/>
            Bookmark
          </Button>
        </Box>
      </Box>
      <Comments
        openComments={openComments}
        questionId={id}
      />
    </>
  )
}

export default Actions;