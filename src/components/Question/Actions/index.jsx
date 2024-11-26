import Box from "@mui/material/Box";
import {Icon} from "@mui/material";
import Button from "@mui/material/Button";
import {FaCheck, FaRegComment} from "react-icons/fa";
import { FaFlag } from "react-icons/fa6";
import * as React from "react";
import Comments from "~/components/Question/Comments/index.jsx";
import pushToast from "~/helpers/sonnerToast.js";
import {useEffect} from "react";

function Actions({
  id = "",
  totalComments = 0,
  setBookmarked = () => {},
  setMastered = () => {},
  bookmarked = 0,
  mastered = 0
}) {
  const [openComments, setOpenComments] = React.useState(false);

  const handleToggleComments = () => {
    setOpenComments(!openComments);
  }

  useEffect(() => {
    const element = document.getElementById(`question-palette-${id}`);
    if (!element) return;

    if (!mastered) {
      element.classList.remove("question-palette__item--mastered");
    } else {
      element.classList.add("question-palette__item--mastered");
    }
  }, [bookmarked]);

  useEffect(() => {
    const element = document.getElementById(`question-palette-${id}`);
    if (!element) return;

    if (!bookmarked) {
      element.classList.remove("question-palette__item--not-sure");
    } else {
      element.classList.add("question-palette__item--not-sure");
    }
  }, [bookmarked]);

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
            onClick={() => setMastered()}
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
            onClick={() => setBookmarked()}
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