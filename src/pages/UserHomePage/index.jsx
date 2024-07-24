import * as React from "react";
import Box from "@mui/material/Box";
import headerImg from "~/assets/images/header_userhomepage.png";
import {Container, Icon, Typography, useTheme} from "@mui/material";
import SingleQuestion from "~/components/Question/SingleQuestion/index.jsx";
import SetQuestion from "~/components/Question/SetQuestion/index.jsx";
import {useEffect, useState} from "react";
import {getQuestions} from "~/services/question.service.js";
import {parseQuestion} from "~/helpers/parseQuestion.js";

export default function UserHomePage() {
  const notionDatabaseId = "ba1ea74a570842ab9d46c6fd62772b83";
  const tags = [
    {
      tag: "part_1",
      multiQuestions: false,
      limit: 5
    },
    {
      tag: "part_7",
      multiQuestions: true,
      limit: 10
    }
  ];

  const [questions, setQuestions] = useState([]);


  useEffect(() => {

    const getData = async () => {
      let questions = [];
      for (const tag of tags) {
        const res = await getQuestions({
          limit: tag.limit,
          multiQuestions: tag.multiQuestions,
          tag: tag.tag,
          notionDatabaseId
        })
        questions = [...questions, ...(res.map(parseQuestion))];
      }
      console.log(questions)
      setQuestions(questions);
    }
    getData();
  }, []);

  return (
    <Container maxWidth={'lg'}
      sx={{
        margin: "auto",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "238px",
          position: "relative",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            marginLeft: 10,
            maxWidth: "50%",
            whiteSpace: "wrap",
            color: "white"
          }}
        >
          <Typography variant="h4" fontWeight={700} sx={{}}>
            Xin chào, Duy Việt!
          </Typography>
          <Typography variant="p" fontWeight={500} sx={{}}>
            Lướt xuống để xem các bài tập được gợi ý riêng cho bạn.
          </Typography>
        </Box>
        <img src={headerImg} alt="header" style={{
          width: "100%",
          height: "238px",
          borderRadius: 15,
          objectFit: "cover",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: -1
        }}/>
      </Box>

      {/*questions container*/}
      <Box
        sx={{
          paddingY: 5,
          marginY: 5,
        }}
      >
        {questions.map((element, index) => {
          if (!Array.isArray(element)) {
            return (
              <SingleQuestion
                key={index}
                question={`Câu ${index + 1}: ` + element?.question}
                options={element?.options}
                image={element?.image}
                audio={element?.audio}
                code={element?.code}
              />
            )
          } else {
            return (
              <SetQuestion
                key={index}
                questions={element}
                context={element[0]?.context}
              />
            )
          }
        })}
      </Box>
    </Container>
  );
}
