import Box from "@mui/material/Box";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
  useRadioGroup,
  useTheme
} from "@mui/material";
import SyntaxHighlighter from "react-syntax-highlighter";
import {a11yLight, nightOwl} from "react-syntax-highlighter/dist/cjs/styles/hljs/index.js";
import Actions from "~/components/Question/Actions/index.jsx";
import * as React from "react";
import parse from 'html-react-parser';
import {styled} from "@mui/material/styles";
import {useEffect} from "react";
import ShowHint from "~/components/Question/ShowHint/index.jsx";
import cookies from "~/utils/cookies.js";
import {postLogQuestion} from "~/services/question.service.js";


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
      }
  },
);

function Option(props) {
  const radioGroup = useRadioGroup();

  let checked = false;
  const { showAnswer, isSubmitted } = props;

  if (showAnswer) {
    if (radioGroup && radioGroup.value) {
      checked = props.value === radioGroup.value || props.isCorrect === 'true';
    } else if (isSubmitted) {
      checked = props.isCorrect === 'true';
    }
  } else {
    if (radioGroup && radioGroup.value) {
      checked = props.value === radioGroup.value;
    }
  }

  useEffect(() => {
    if (showAnswer) {
      if (props.value === radioGroup.value && props.isCorrect === 'true') {
        document.getElementById(`question-palette-${radioGroup.name}`).style.backgroundColor = 'rgba(57,153,24,0.78)';
      } else if (checked) {
        document.getElementById(`question-palette-${radioGroup.name}`).style.backgroundColor = '#FF7777';
      }
    } else {
      if (checked) {
        document.getElementById(`question-palette-${radioGroup.name}`).style.backgroundColor = '#3DC2EC';
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
  isSubmitted = false
}) {
  const theme = useTheme();
  const [showHint, setShowHint] = React.useState(false);
  let startTime = null;

  const handleSelectOption = (e) => {
    setShowHint(true);
  }

  const userInfo = cookies.get("user", { path: "/" });

  const handleSendLog = ({
    exercise_id,
    score,
    user_ans,
    correct_ans,
  }) => {
    const time_cost = new Date().getTime() - startTime;
    startTime = null;

    postLogQuestion({
      user_id: userInfo._id,
      score: score,
      time_cost: time_cost,
      user_ans: user_ans,
      correct_ans: correct_ans,
      exercise_id: exercise_id
    })
  }

  const handleHoverQuestionCard = (e) => {
    if (startTime) return;
    startTime = new Date().getTime();
  }

  const handleLeaveQuestionCard = (e) => {
    startTime = null;
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
        <Typography variant={"body1"} fontWeight={700}>
          {parse(`Câu ${index}: ${question}`)}
        </Typography>
        {hint && <ShowHint
          hint={hint}
          showHint={showHint}
        />}
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
            <SyntaxHighlighter language="c" style={theme.palette.mode === 'dark' ? nightOwl : a11yLight}
                               wrapLongLines={true}
                               customStyle={{fontSize: '14px', borderRadius: "10px", padding: "16px"}}
            >
              {code}
            </SyntaxHighlighter>
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
          >
            <RadioGroup
              name={id}
              onChange={handleSelectOption}
            >
              {options.map((option, index) => (
                <Option
                  key={index}
                  control={<Radio onClick={() => handleSendLog({
                    exercise_id: id,
                    score: option.option === correct ? 1 : 0,
                    time_cost: 0,
                    correct_ans: [correct],
                    user_ans: [option.option]
                  })}/>}
                  value={option.option}
                  label={`(${String.fromCharCode(index + 'A'.charCodeAt(0))}). ${option.text}`}
                  isCorrect={option.option === correct ? 'true' : 'false'}
                  showAnswer={showAnswer}
                  isSubmitted={isSubmitted}
                  sx={{
                    // color: theme.palette.text.secondary,
                    // backgroundColor: theme.palette.sectionBackground.primary,
                    borderColor: theme.palette.text.secondary,
                    // fontWeight: 400,
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

      <Actions id={id} totalComments={totalComments}/>
    </Box>
  )
}

export default QuestionCard;