import * as React from "react";
import Box from "@mui/material/Box";
import headerImg from "~/assets/images/header_userhomepage.png";
import {Container, Icon, Typography, useTheme} from "@mui/material";
import SingleQuestion from "~/components/Question/SingleQuestion/index.jsx";
import SetQuestion from "~/components/Question/SetQuestion/index.jsx";
import {useEffect, useState} from "react";
import {getQuestions} from "~/services/question.service.js";
import {parseQuestion} from "~/helpers/parseNotionResponseToObject.js";
import useFilterQuestion from "~/hooks/useFilterQuestion.jsx";

export default function UserHomePage() {
  const theme = useTheme();
  const { filter } = useFilterQuestion();
  const notionDatabaseId = filter.certificateDatabaseId;
  const tags = filter?.tags?.map(tag => ({
    tag: tag.tag,
    limit: tag.limit,
    multiQuestions: tag.multiQuestions,
    section: tag.section
  })) || [];

  const [questions, setQuestions] = useState([]);
  let count = 0;

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
        // questions = [...questions, ...(res?.map(parseQuestion))];
        questions.push({
          section: tag.section,
          multi: tag.multiQuestions,
          questions: res?.map(parseQuestion)
        })
      }
      setQuestions(questions);
    }
    getData();
  }, [filter]);

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

      <Box>
        <Typography variant="body1" sx={{marginTop: 5}}>
          Bạn đang học:
        </Typography>
        <Typography variant="h5" fontWeight={700}>
          {filter?.certificateInfo?.title}
        </Typography>
      </Box>

      {/*questions container*/}
      {(filter?.certificateDatabaseId && filter?.tags) ? <Box
        sx={{
          paddingY: 5,
          marginY: 1,
        }}
      >
        {questions.map((element, index) => {
          return (
            <Box key={index} sx={{marginTop: 5}}>
              <Typography variant={"h5"} fontWeight={700} color={theme.palette.text.secondary}>{element.section}</Typography>
              {element.questions.map((question, index) => {
                if (element.multi) {
                  return (
                    <SetQuestion
                      key={index}
                      questions={question}
                      context={question[0]?.context}
                      count={count}
                    />
                  )
                } else {
                  return (
                    <SingleQuestion
                      key={index}
                      question={question?.question}
                      options={question?.options}
                      image={question?.image}
                      audio={question?.audio}
                      code={question?.code}
                      index={++count}
                    />
                  )
                }
              })}
            </Box>
          )
        })}
      </Box> : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            height: "50vh",
            width: "100%",
          }}
        >
          <Typography variant="h5" fontWeight={700} sx={{}}>
            Trước hết, hãy cho chúng tôi biết thêm về bạn!
          </Typography>
          <Typography variant="p" fontWeight={500} sx={{}}>
            Mở bộ lọc và chọn nội dung học bạn muốn!
          </Typography>
        </Box>
      )}
    </Container>
  );
}
