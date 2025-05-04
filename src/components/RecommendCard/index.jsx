import Box from "@mui/material/Box";
import parse from "html-react-parser";
import { Tooltip, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import ReportError from "~/components/ReportError/index.jsx";
import ShowHint from "~/components/Question/ShowHint/index.jsx";
import CodeDisplay from "~/components/CodeDisplay/index.jsx";
import { LiaComments } from "react-icons/lia";
import IconButton from "@mui/material/IconButton";
import { FaRegBookmark, FaCheck } from "react-icons/fa";
import Comments from "~/components/Question/Comments/index.jsx";
import {
  postLogQuestion,
  updateLogQuestion,
} from "~/services/question.service.js";
import pushToast from "~/helpers/sonnerToast.js";
import Chip from "@mui/material/Chip";

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

export default function RecommendCard({
  index = "",
  question = "",
  options = [],
  code = "",
  image = "",
  audio = "",
  id = "",
  correct = "",
  hint = "",
  totalComments = 0,
  showAnswer = false,
  addResult = () => null,
  isRecommended = true,
  difficulty = 0,
  knowledge_concept = "",
  indexRcm = 0,
  handleIncreaseDoneCount = () => null,
  startTime = null,
  setAnswered = () => null,
  type,
  desc = "",
  onAnswered = () => null,
}) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [openComment, setOpenComment] = useState(false);
  const [bookmarked, setBookmarked] = useState(0);
  const [mastered, setMastered] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(null);

  useEffect(() => {
    // Start timing when component mounts
    setQuestionStartTime(new Date().getTime());

    // Clean up timing on unmount
    return () => {
      setQuestionStartTime(null);
    };
  }, []);

  const onToggleBookmarked = async () => {
    setBookmarked(bookmarked === 0 ? 1 : 0);
    try {
      const res = await updateLogQuestion({
        exercise_id: id,
        bookmarked: bookmarked === 0 ? 1 : 0,
      });
      if (bookmarked === 1) {
        pushToast(
          "Câu hỏi này sẽ không được ưu tiên trong đề xuất nữa.",
          "info"
        );
      } else {
        pushToast(
          "Những đề xuất tiếp theo sẽ tập trung vào chủ đề tương tự!",
          "warning"
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onToggleMastered = async () => {
    setMastered(mastered === 0 ? 1 : 0);
    try {
      const res = await updateLogQuestion({
        exercise_id: id,
        mastered: mastered === 0 ? 1 : 0,
      });
      if (mastered === 1) {
        pushToast("Câu hỏi này sẽ hiển thị lại trong tương lai.", "info");
      } else {
        pushToast(
          "Chúng tôi sẽ hạn chế hiển thị câu hỏi này trong tương lai!",
          "success"
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleOptionSelect = (option) => {
    if (selectedOption) return;

    setSelectedOption(option);
    setAnswered && setAnswered(true);

    const time_cost = questionStartTime
      ? new Date().getTime() - questionStartTime
      : 0;
    setQuestionStartTime(null);

    // Add result for tracking if function is provided
    addResult &&
      addResult({
        question: id,
        user_ans: option,
        correct_ans: correct,
        score: option === correct ? 1 : 0,
        index: parseInt(index || indexRcm || 0),
      });

    postLogQuestion({
      exercise_id: id,
      score: option === correct ? 1 : 0,
      time_cost: time_cost,
      user_ans: [option],
      correct_ans: [correct],
      isRecommended: isRecommended,
      bookmarked: bookmarked,
      mastered: mastered,
      indexRcm: indexRcm,
    });

    // Increase done count if needed
    if (showAnswer && isRecommended) {
      handleIncreaseDoneCount && handleIncreaseDoneCount(id);
    }

    onAnswered && onAnswered(id, type);
  };

  const getOptionStyle = (option) => {
    const baseStyle = {
      padding: "10px 15px",
      marginY: 1,
      borderRadius: 6,
      cursor: selectedOption ? "default" : "pointer",
      display: "flex",
      alignItems: "center",
      border: "1px solid #E0E0E0",
      backgroundColor: "#FFFFFF",
      transition: "all 0.2s ease-in-out",
      "&:hover": {
        backgroundColor: selectedOption ? "#FFFFFF" : "#F5F5F5",
        boxShadow: selectedOption ? "none" : "0px 2px 4px rgba(0, 0, 0, 0.1)",
      },
    };

    if (selectedOption) {
      if (option === correct) {
        return {
          ...baseStyle,
          backgroundColor: "rgba(57,153,24,0.78)",
          color: "#FFFFFF",
          fontWeight: "bold",
          "&:hover": {
            backgroundColor: "rgba(57,153,24,0.78)", // Keep background color consistent on hover
            color: "#FFFFFF", // Keep text color consistent on hover
          },
        };
      } else if (option === selectedOption) {
        return {
          ...baseStyle,
          backgroundColor: "#FF7777",
          color: "#FFFFFF",
          fontWeight: "bold",
          "&:hover": {
            backgroundColor: "#FF7777", // Keep background color consistent on hover
            color: "#FFFFFF", // Keep text color consistent on hover
          },
        };
      }
    }

    return baseStyle;
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        gap: 2,
        maxHeight: "100%",
        overflowY: "auto",
        paddingY: 2,
      }}
    >
      <Box
        sx={{
          padding: 2,
          // border: "1px solid #E0E0E0",
          borderRadius: 2,
          boxShadow: 1,
          backgroundColor: colors[type],
          cursor: "pointer",
          width: "600px",
          height: "100%",
          boxSizing: "border-box",
        }}
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

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant={"body1"}
            fontWeight={700}
            sx={{ whiteSpace: "pre-wrap" }}
          >
            {parse(
              `${!!index || !!indexRcm ? `Câu ${index || indexRcm}` : `Câu hỏi`}: ${question}`
            )}
          </Typography>
        </Box>

        {(code || image) && (
          <Box
            sx={{
              marginX: 2,
              marginY: 3,
              display: "flex",
              gap: 2,
              alignItems: "center",
            }}
          >
            {code && (
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                <CodeDisplay code={code} />
              </Box>
            )}
            {image && (
              <Box
                sx={{
                  width: "50%",
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                <img
                  style={{ width: "100%", borderRadius: "10px" }}
                  src={image}
                  alt={image}
                />
              </Box>
            )}
          </Box>
        )}

        {options.length > 0 && (
          <Box sx={{ mt: 2 }}>
            {options.map((opt) => (
              <Box
                key={opt.option}
                sx={getOptionStyle(opt.option)}
                onClick={() => handleOptionSelect(opt.option)}
              >
                <Typography
                  variant="body1"
                  fontWeight={500}
                  sx={{ width: "30px" }}
                >
                  {opt.option}.
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "inherit",
                    fontWeight:
                      selectedOption &&
                      (opt.option === correct || opt.option === selectedOption)
                        ? 700
                        : 400,
                  }}
                >
                  {parse(opt.text)}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Tooltip title="Bình luận">
          <IconButton
            sx={{
              backgroundColor: openComment ? "gray" : "#F3F4F6FF",
            }}
            onClick={() => {
              setOpenComment(!openComment);
            }}
          >
            <LiaComments />
          </IconButton>
        </Tooltip>

        <Tooltip title="Bookmark">
          <IconButton
            sx={{
              backgroundColor: bookmarked ? "#FFDC6EFF" : "#F3F4F6FF",
              ":hover": {
                backgroundColor: bookmarked ? "#FFDC6EFF" : "#F3F4F6FF",
              },
            }}
            onClick={onToggleBookmarked}
          >
            <FaRegBookmark />
          </IconButton>
        </Tooltip>

        <Tooltip title="Đã thành thạo">
          <IconButton
            sx={{
              backgroundColor: mastered ? "#3DC2EC" : "#F3F4F6FF",
              ":hover": {
                backgroundColor: mastered ? "#3DC2EC" : "#F3F4F6FF",
              },
            }}
            onClick={onToggleMastered}
          >
            <FaCheck />
          </IconButton>
        </Tooltip>
        <ReportError
          question={{
            question: question,
            options: options,
            correct: correct,
            hint: hint,
            code: code,
            image: image,
            audio: audio,
          }}
        />

        {hint && selectedOption && <ShowHint hint={hint} showHint={true} />}
      </Box>

      <Box
        sx={{
          maxHeight: "100%",
          overflow: "auto",
        }}
      >
        {openComment && <Comments openComments={openComment} questionId={id} />}
      </Box>
    </Box>
  );
}
