import Box from "@mui/material/Box";
import { Icon } from "@mui/material";
import Button from "@mui/material/Button";
import { FaCheck, FaRegComment } from "react-icons/fa";
import { FaFlag, FaRegFaceFrown } from "react-icons/fa6";
import * as React from "react";
import Comments from "~/components/Question/Comments/index.jsx";
import pushToast from "~/helpers/sonnerToast.js";
import { useEffect } from "react";

function Actions({
  id = "",
  totalComments = 0,
  setBookmarked = () => {},
  setMastered = () => {},
  bookmarked = 0,
  mastered = 0,
  isPractice = true,
}) {
  const [openComments, setOpenComments] = React.useState(false);

  const handleToggleComments = () => {
    setOpenComments(!openComments);
  };

  useEffect(() => {
    if (!isPractice) return;

    const paletteId = `question-palette-${id}`;
    const element = document.getElementById(paletteId);
    if (!element) return;

    if (!mastered) {
      element.classList.remove("question-palette__item--mastered");
    } else {
      element.classList.add("question-palette__item--mastered");
    }
  }, [mastered, isPractice, id]);

  useEffect(() => {
    const paletteId = `question-palette-${id}`;
    const element = document.getElementById(paletteId);
    if (!element) return;

    if (isPractice) {
      if (bookmarked) {
        element.classList.add("question-palette__item--not-sure");
      } else {
        element.classList.remove("question-palette__item--not-sure");
      }
    } else {
      const flagId = `flag-icon-${id}`;
      const existingFlag = document.getElementById(flagId);

      if (bookmarked) {
        if (!existingFlag) {
          element.style.position = "relative";
          const flagIcon = document.createElement("span");
          flagIcon.id = flagId;
          flagIcon.innerHTML = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M64 32C64 14.3 49.7 0 32 0S0 14.3 0 32V64 368 480c0 17.7 14.3 32 32 32s32-14.3 32-32V352l64.3-16.1c41.1-10.3 84.6-5.5 122.5 13.4c44.2 22.1 95.5 24.8 141.7 7.4l34.7-13c12.5-4.7 20.8-16.6 20.8-30V66.1c0-23-24.2-38-44.8-27.7l-9.6 4.8c-46.3 23.2-100.8 23.2-147.1 0c-35.1-17.6-75.4-22-113.5-12.5L64 48V32z"></path></svg>`;
          flagIcon.style.position = "absolute";
          flagIcon.style.top = "-5px";
          flagIcon.style.right = "4px";
          flagIcon.style.color = "#EFB034FF";
          flagIcon.style.fontSize = "12px";
          flagIcon.style.zIndex = "1";
          element.appendChild(flagIcon);
        }
      } else {
        if (existingFlag) {
          existingFlag.remove();
        }
      }
    }
  }, [bookmarked, isPractice, id]);

  if (!isPractice) {
    return (
      <>
        <Box
          sx={{
            display: "flex",
            gap: 1,
            justifyContent: "flex-start",
            ml: "16px",
          }}
        >
          <Button
            variant={"contained"}
            sx={{
              backgroundColor: bookmarked ? "#8E681CFF" : "#EFB034FF",
              borderRadius: 5,
              color: bookmarked ? "white" : "black",
              fontSize: "12px",
              ":hover": {
                backgroundColor: bookmarked
                  ? "rgba(255,141,107,0.8)"
                  : "#d5d5d5",
              },
            }}
            onClick={() => setBookmarked()}
          >
            <Icon
              as={FaRegFaceFrown}
              sx={{ marginRight: 1, fontSize: "16px" }}
            />
            {bookmarked ? "Hủy đánh dấu" : "Xem lại"}
          </Button>
        </Box>
      </>
    );
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
            ":hover": {
              backgroundColor: "rgba(26,78,141,0.8)",
              boxShadow: "0 0 10px 0 rgba(26,78,141,0.5)",
            },
          }}
          onClick={handleToggleComments}
        >
          <Icon as={FaRegComment} sx={{ marginRight: 1, fontSize: "16px" }} />
          Bình luận ({totalComments})
        </Button>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant={"contained"}
            sx={{
              backgroundColor: "#03DAC6FF",
              borderRadius: 5,
              color: "white",
              fontSize: "12px",
              ":hover": {
                backgroundColor: "rgba(3,218,198,0.7)",
                boxShadow: "0 0 10px 0 rgba(3,218,198,0.5)",
              },
            }}
            onClick={() => setMastered()}
          >
            <Icon as={FaCheck} sx={{ marginRight: 1, fontSize: "16px" }} />
            Đã thành thạo
          </Button>
          <Button
            variant={"contained"}
            sx={{
              backgroundColor: "#FF8D6BFF",
              borderRadius: 5,
              color: "white",
              fontSize: "12px",
              ":hover": {
                backgroundColor: "rgba(255,141,107,0.8)",
                boxShadow: "0 0 10px 0 rgba(255,141,107,0.5)",
              },
            }}
            onClick={() => setBookmarked()}
          >
            <Icon as={FaFlag} sx={{ marginRight: 1, fontSize: "16px" }} />
            Bookmark
          </Button>
        </Box>
      </Box>
      <Comments openComments={openComments} questionId={id} />
    </>
  );
}

export default Actions;
