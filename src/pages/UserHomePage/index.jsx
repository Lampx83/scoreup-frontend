import * as React from "react";
import Box from "@mui/material/Box";
import headerImg from "~/assets/images/header_userhomepage.png";
import { Container, Icon, Typography, useTheme } from "@mui/material";
import SingleQuestion from "~/components/Question/SingleQuestion/index.jsx";
import SetQuestion from "~/components/Question/SetQuestion/index.jsx";
import { useEffect, useState } from "react";
import { getQuestions } from "~/services/question.service.js";
import { parseQuestion } from "~/helpers/parseNotionResponseToObject.js";
import useFilterQuestion from "~/hooks/useFilterQuestion.jsx";
import QuestionsPalette from "~/components/QuestionsPalette/index.jsx";
import cookies from "~/utils/cookies.js";

export default function UserHomePage() {
  const theme = useTheme();
  const user = cookies.get("user");
  const { filter } = useFilterQuestion();
  const notionDatabaseId = filter.certificateDatabaseId;
  const tags =
    filter?.tags?.map((tag) => ({
      tag: tag.tag,
      limit: tag.limit,
      multiQuestions: tag.multiQuestions,
      section: tag.section,
    })) || [];

  const [questions, setQuestions] = useState([]);
  let count = 0;

  useEffect(() => {
    setQuestions([]);
    const getData = async () => {
      let questions = [];
      for (const tag of tags) {
        const res = await getQuestions({
          limit: tag.limit,
          multiQuestions: tag.multiQuestions,
          tag: tag.tag,
          notionDatabaseId,
        });
        // questions = [...questions, ...(res?.map(parseQuestion))];
        questions.push({
          section: tag.section,
          multi: tag.multiQuestions,
          questions: res?.map(parseQuestion),
        });
      }
      setQuestions(questions);
    };
    getData();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [filter]);

  return (
    <>
      {questions.length === 0 &&
      filter?.certificateDatabaseId &&
      filter?.tags?.length !== 0 ? (
        <Container
          maxWidth={false}
          sx={{
            // width: "100%",
            height: "100vh",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.palette.background.paper,
            transition: "all 0.5s",
          }}
        >
          <Box
            sx={{
              width: "65px",
              aspectRatio: "1",
              position: "relative",
              "&:before, &:after": {
                content: '""',
                position: "absolute",
                borderRadius: "50px",
                boxShadow: `0 0 0 3px inset ${theme.palette.primary.main}`,
                animation: "l5 2.5s infinite",
              },
              "&:after": {
                animationDelay: "-1.25s",
                borderRadius: "0",
              },
              "@keyframes l5": {
                "0%": { inset: "0 35px 35px 0" },
                "12.5%": { inset: "0 35px 0 0" },
                "25%": { inset: "35px 35px 0 0" },
                "37.5%": { inset: "35px 0 0 0" },
                "50%": { inset: "35px 0 0 35px" },
                "62.5%": { inset: "0 0 0 35px" },
                "75%": { inset: "0 0 35px 35px" },
                "87.5%": { inset: "0 0 35px 0" },
                "100%": { inset: "0 35px 35px 0" },
              },
            }}
          ></Box>
        </Container>
      ) : (
        <Container
          maxWidth={false}
          sx={{
            margin: "auto",
            width: "100%",
            position: "relative",
            maxWidth: theme.breakpoints.values.lg
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
                color: "white",
              }}
            >
              <Typography variant="h4" fontWeight={700} sx={{}}>
                Xin chào, {user?.fullName || user?.username || user?.email || "meow"}!
              </Typography>
              <Typography variant="p" fontWeight={500} sx={{}}>
                Lướt xuống để xem các bài tập được gợi ý riêng cho bạn.
              </Typography>
            </Box>
            <img
              src={headerImg}
              alt="header"
              style={{
                width: "100%",
                height: "238px",
                borderRadius: 15,
                objectFit: "cover",
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: -1,
              }}
            />
          </Box>

          {/*questions container*/}
          {filter?.certificateDatabaseId && filter?.tags?.length ? (
            <Box
              sx={{
                paddingY: 5,
                marginY: 1,
                maxWidth: "100%",
                width: "100%",
                position: "relative",
              }}
            >
              <Box>
                <Typography variant="body1" sx={{ marginTop: 5 }}>
                  Bạn đang học:
                </Typography>
                <Typography variant="h5" fontWeight={700}>
                  {filter?.certificateInfo?.title}
                </Typography>
              </Box>

              <QuestionsPalette questions={questions} />

              {questions.map((element, index) => {
                return (
                  <Box key={index} sx={{ marginTop: 5 }}>
                    <Typography
                      variant={"h5"}
                      fontWeight={700}
                      color={theme.palette.text.secondary}
                    >
                      {element.section}
                    </Typography>
                    {element.questions.map((question, index) => {
                      if (element.multi) {
                        count = count + question.length;
                        return (
                          <SetQuestion
                            key={index}
                            questions={question}
                            context={question[0]?.context}
                            count={count - question.length}
                          />
                        );
                      } else {
                        return (
                          <SingleQuestion
                            key={index}
                            {...question}
                            index={++count}
                          />
                        );
                      }
                    })}
                  </Box>
                );
              })}
            </Box>
          ) : (
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
      )}
    </>
  );
}
