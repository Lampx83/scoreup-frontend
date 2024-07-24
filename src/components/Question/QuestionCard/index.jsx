import Box from "@mui/material/Box";
import {Icon, Typography, useTheme} from "@mui/material";
import Button from "@mui/material/Button";
import {FaRegLightbulb} from "react-icons/fa";
import SyntaxHighlighter from "react-syntax-highlighter";
import {a11yLight, nightOwl} from "react-syntax-highlighter/dist/cjs/styles/hljs/index.js";
import Actions from "~/components/Question/Actions/index.jsx";
import * as React from "react";
import parse from 'html-react-parser';

function QuestionCard({
  index = 1,
  context = "",
  question = "",
  options = [],
  code = "",
  image = "",
  audio = ""
}) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        padding: 3,
        color: theme.palette.text.secondary,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: 'center'
        }}
      >
        <Typography variant={"body1"} fontWeight={700}>
          {parse(question)}
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
            <SyntaxHighlighter language="cpp" style={theme.palette.mode === 'dark' ? nightOwl : a11yLight}
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
              <audio controls controlsList="nodownload" autoPlay={false} onSeeked={() => null}>
                <source src={audio} type="audio/mpeg"/>
                Your browser does not support the audio element.
              </audio>
            </Box>
          )}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              width: "100%"
            }}
          >
            {options.map((option, index) => (
              <Button
                key={index}
                variant={"outlined"}
                sx={{
                  color: theme.palette.text.secondary,
                  borderColor: theme.palette.text.secondary,
                  backgroundColor: theme.palette.sectionBackground.primary,
                  fontWeight: 400,
                  borderRadius: 5,
                  whiteSpace: "wrap",
                  textWrap: "wrap",
                  width: "100%",
                  justifyContent: "flex-start",
                }}
              >
                {option}
              </Button>
            ))}
          </Box>
        </Box>

      </Box>

      <Actions/>
    </Box>
  )
}

export default QuestionCard;