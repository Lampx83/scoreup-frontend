import Box from "@mui/material/Box";
import {
  FormControl,
  FormControlLabel,
  FormGroup,
  Icon,
  Radio,
  RadioGroup,
  Typography,
  useRadioGroup,
  useTheme
} from "@mui/material";
import Button from "@mui/material/Button";
import {FaRegLightbulb} from "react-icons/fa";
import SyntaxHighlighter from "react-syntax-highlighter";
import {a11yLight, nightOwl} from "react-syntax-highlighter/dist/cjs/styles/hljs/index.js";
import Actions from "~/components/Question/Actions/index.jsx";
import * as React from "react";
import parse from 'html-react-parser';
import {styled} from "@mui/material/styles";
import {useEffect} from "react";


const StyledFormControlLabel = styled((props) => <FormControlLabel {...props} />, {
  shouldForwardProp: (prop) => prop !== 'isCorrect',
})(
  ({ theme, isCorrect, checked }) => ({
    backgroundColor: `${checked ? (isCorrect === 'true' ? 'rgba(57,153,24,0.78)' : '#FF7777') : theme.palette.sectionBackground.primary}`,
    color: `${checked ? 'white' : theme.palette.text.secondary}`,
    transition: "all 0.2s",
    '& .MuiTypography-root': {
      fontWeight: checked ? 700 : 400,
    },
  }),
);

function Option(props) {
  const radioGroup = useRadioGroup();

  let checked = false;

  if (radioGroup && radioGroup.value) {
    checked = props.value === radioGroup.value || props.isCorrect === 'true';
  }

  useEffect(() => {
    if (props.value === radioGroup.value && props.isCorrect === 'true') {
      document.getElementById(`question-palette-${radioGroup.name}`).style.backgroundColor = 'rgba(57,153,24,0.78)';
    } else if (checked) {
      document.getElementById(`question-palette-${radioGroup.name}`).style.backgroundColor = '#FF7777';
    }
  }, [checked]);

  return <StyledFormControlLabel disabled={!!radioGroup.value && !checked} checked={checked} {...props} />;
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
}) {
  const theme = useTheme();

  const handleSelectOption = (e) => {
    // console.log(e.target.value);
  }

  return (
    <Box
      sx={{
        padding: 3,
        color: theme.palette.text.secondary,
      }}
      id={id}
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
        <Button
          sx={{
            minWidth: 0,
            backgroundColor: "#FFDC6EFF",
            borderRadius: "50%",
            width: 35,
            height: 35,
            ':hover': {
              backgroundColor: "rgba(255,220,110,0.7)",
              boxShadow: "0 0 10px 0 rgba(255,220,110,0.7)"
            }
          }}
        >
          <Icon as={FaRegLightbulb}/>
        </Button>
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
                  control={<Radio/>}
                  value={option.option}
                  label={`(${String.fromCharCode(index + 'A'.charCodeAt(0))}). ${option.text}`}
                  isCorrect={option.option === correct ? 'true' : 'false'}
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

      <Actions id={id}/>
    </Box>
  )
}

export default QuestionCard;