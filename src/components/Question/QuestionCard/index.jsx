import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
  useRadioGroup,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import cookies from "~/utils/cookies.js";
import {postLogQuestion, updateLogQuestion} from "~/services/question.service.js";
import ReportError from "~/components/ReportError/index.jsx";
import CodeDisplay from "~/components/CodeDisplay/index.jsx";
import Actions from "~/components/Question/Actions/index.jsx";
import parse from "html-react-parser";
import pushToast from "~/helpers/sonnerToast.js";
import ShowHint from "~/components/Question/ShowHint/index.jsx";

const StyledFormControlLabel = styled((props) => <FormControlLabel {...props} />, {
  shouldForwardProp: (prop) => prop !== 'isCorrect' && prop !== 'showAnswer' && prop !== 'isSubmitted',
})(
  ({ theme, isCorrect, checked, showAnswer, isSubmitted }) => {
    if (showAnswer)
      return {
        backgroundColor: `${
          checked
            ? (isCorrect === 'true' ? 'rgba(57,153,24,0.78)' : '#FF7777')
            : theme.palette.sectionBackground.primary
        }`,
        color: `${checked ? 'white' : theme.palette.text.secondary}`,
        transition: "all 0.2s",
        '& .MuiTypography-root': {
          fontWeight: checked ? 700 : 400,
        },
        border: "1px solid #1A4E8DFF"
      }
    else if (!isSubmitted)
      return {
        backgroundColor: `${
          checked
            ? '#3DC2EC'
            : theme.palette.sectionBackground.primary
        }`,
        color: `${checked ? 'white' : theme.palette.text.secondary}`,
        transition: "all 0.2s",
        border: "1px solid #1A4E8DFF"
      }
    else if (isSubmitted)
      return {
        backgroundColor: `${
          isCorrect === 'true'
            ? '#3DC2EC'
            : '#FF7777'
        }`,
        color: 'white',
        transition: "all 0.2s",
        border: "1px solid #1A4E8DFF"
      }
  },
);

function Option(props) {
  const radioGroup = useRadioGroup();

  let checked = false;
  const { showAnswer, isSubmitted } = props;

  if (showAnswer) {
    // if (radioGroup && radioGroup.value) {
    //   checked = props.value === radioGroup.value;
    // }
    if (radioGroup && radioGroup.value && isSubmitted) {
      checked = (props.isCorrect === 'true') || radioGroup.value === props.value;
    } else {
      checked = radioGroup && (radioGroup.value === props.value);
    }
  } else {
    if (radioGroup && radioGroup.value) {
      checked = props.value === radioGroup.value;
    }
  }

  useEffect(() => {
    let questionPaletteItem = document.getElementById(`question-palette-${radioGroup.name}`);
    if (questionPaletteItem) {
      if (showAnswer) {
        if (props.value === radioGroup.value && props.isCorrect === 'true') {
          document.getElementById(`question-palette-${radioGroup.name}`).style.backgroundColor = 'rgba(57,153,24,0.78)';
        } else if (checked) {
          document.getElementById(`question-palette-${radioGroup.name}`).style.backgroundColor = '#FF7777';
        } else if (!radioGroup.value && isSubmitted) {
          document.getElementById(`question-palette-${radioGroup.name}`).style.backgroundColor = '#FF7777';
        }
      } else {
        if (checked) {
          document.getElementById(`question-palette-${radioGroup.name}`).style.backgroundColor = '#3DC2EC';
        }
      }
    }
  }, [checked, isSubmitted, showAnswer]);

  return <StyledFormControlLabel disabled={((!!radioGroup.value && !checked) || (isSubmitted && !checked)) && showAnswer} checked={checked} {...props} />;
}

function QuestionCard({
  index = "",
  context = "",
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
  isSubmitted = false,
  addResult = () => null,
  isRecommended = false,
  difficulty = 0,
  knowledge_concept = "",
  indexRcm = 0,
  handleIncreaseDoneCount = () => null,
  startTime = null,
  setAnswered = () => null,
  showActions = true,
}) {
  const theme = useTheme();
  const [selectedOption, setSelectedOption] = useState("");
  const [bookmarked, setBookmarked] = useState(0);
  const [mastered, setMastered] = useState(0);

  const handleSelectOption = (e) => {
    setSelectedOption(e.target.value);
  }

  const handleSendLog = ({
    exercise_id,
    score,
    user_ans,
    correct_ans,
  }) => {
    const time_cost = new Date().getTime() - startTime;
    startTime = null;
    setAnswered(true);

    addResult({
      question: exercise_id,
      user_ans: user_ans,
      correct_ans: correct_ans,
      score: score,
      index: parseInt(index)
    });

    postLogQuestion({
      score: score,
      time_cost: time_cost,
      user_ans: user_ans,
      correct_ans: correct_ans,
      exercise_id: exercise_id,
      isRecommended: isRecommended,
      bookmarked: bookmarked,
      mastered: mastered,
      indexRcm: indexRcm
    })
  }

  const handleHoverQuestionCard = (e) => {
    if (startTime) return;
    startTime = new Date().getTime();
  }

  const handleLeaveQuestionCard = (e) => {
    startTime = null;
  }

  useEffect(() => {
    setSelectedOption("");
  }, [question, options]);

  const onToggleMastered = async () => {
    setMastered(mastered === 0 ? 1 : 0);
    try {
      const res = await updateLogQuestion({
        exercise_id: id,
        mastered: mastered === 0 ? 1 : 0
      });
      if (mastered === 1) {
        pushToast("Câu hỏi này sẽ hiển thị lại trong tương lai.", "info");
      } else {
        pushToast("Chúng tôi sẽ hạn chế hiển thị câu hỏi này trong tương lai!", "success");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const onToggleBookmarked = async () => {
    setBookmarked(bookmarked === 0 ? 1 : 0);
    try {
      const res = await updateLogQuestion({
        exercise_id: id,
        bookmarked: bookmarked === 0 ? 1 : 0
      });
      if (bookmarked === 1) {
        pushToast("Câu hỏi này sẽ không được ưu tiên trong đề xuất nữa.", "info");
      } else {
        pushToast("Những đề xuất tiếp theo sẽ tập trung vào chủ đề tương tự!", "warning");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Box
      sx={{
        padding: 3,
        color: theme.palette.text.secondary,
      }}
      id={id}
      onMouseOver={handleHoverQuestionCard}
      onMouseLeave={handleLeaveQuestionCard}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: 'center'
        }}
      >
        <Typography variant={"body1"} fontWeight={700} sx={{whiteSpace: 'pre-wrap'}}>
          {parse(`${(!!index || !!indexRcm) ? `Câu ${index || indexRcm}` : `Câu hỏi`}: ${question}`)}
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
          }}
        >
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
          {hint && <ShowHint
            hint={hint}
            showHint={isSubmitted && showAnswer}
          />}
        </Box>
      </Box>
      <Box
        sx={{
          marginX: 2,
          marginY: 3,
          display: "flex",
          gap: 2,
          alignItems: "center"
        }}
      >
        {code && (
          <Box
            sx={{
              width: "50%",
              display: "flex",
              flexDirection: "column",
              gap: 1
            }}
          >
            <CodeDisplay code={code}/>
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
            <img style={{width: "100%", borderRadius: "10px"}} src={image} alt={image}/>
          </Box>
        )}
        <Box
          sx={{
            width: (code || image) ? "50%" : "100%",
          }}
        >
          {audio && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 2
              }}
            >
              <audio controls controlsList="nodownload" autoPlay={false} onSeeked={() => null} src={audio}>
                Your browser does not support the audio element.
              </audio>
            </Box>
          )}
          <FormControl
            sx={{
              display: "flex", 
              flexDirection: "column",
              gap: 1,
              width: "100%"
            }}
            id={`question-${id}`}
          >
            <RadioGroup
              name={id}
              value={selectedOption}
              onChange={handleSelectOption}
            >
              {options.map((option, index) => (
                <Option
                  key={index}
                  control={<Radio onChange={() => {
                    handleSendLog({
                      exercise_id: id,
                      score: option.option === correct ? 1 : 0,
                      time_cost: 0,
                      correct_ans: [correct],
                      user_ans: [option.option]
                    })
                    if (showAnswer && isRecommended) handleIncreaseDoneCount(id);
                  }}/>}
                  value={option.option}
                  label={`(${String.fromCharCode(index + 'A'.charCodeAt(0))}) ${option.text}`}
                  isCorrect={option.option === correct ? 'true' : 'false'}
                  showAnswer={showAnswer}
                  isSubmitted={isSubmitted}
                  sx={{
                    borderColor: theme.palette.text.secondary,
                    borderRadius: 5,
                    whiteSpace: "wrap",
                    textWrap: "wrap",
                    width: "100%",
                    justifyContent: "flex-start",
                    textAlign: "left",
                    paddingX: 2,
                    paddingY: 1,
                    marginX: 0,
                    marginY: 1,
                    '& .MuiButtonBase-root': {
                      display: "none"
                    },
                    '&.Mui-checked': {
                      backgroundColor: 'black'
                    },
                  }}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Box>
      </Box>
      {showActions && <Actions id={id} totalComments={totalComments} setBookmarked={onToggleBookmarked} setMastered={onToggleMastered}
                bookmarked={bookmarked} mastered={mastered}/>}
    </Box>
  )
}

export default QuestionCard;