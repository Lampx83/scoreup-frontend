import Box from "@mui/material/Box";
import { Container, Typography, useTheme } from "@mui/material";
import headerImg from "~/assets/images/header_userhomepage.png";
import * as React from "react";
import cookies from "~/utils/cookies.js";
import { useEffect, useRef, useState } from "react";
import { getRecommendQuestions } from "~/services/question.service.js";
import { v4 as uuidv4 } from "uuid";
import SingleQuestion from "~/components/Question/SingleQuestion/index.jsx";
import { parseQuestion } from "~/helpers/parseNotionResponseToObject.js";
import Button from "@mui/material/Button";

export default function RecommendPage() {
  const theme = useTheme();
  const user = cookies.get("user");
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(0);
  const [bookmarked, setBookmarked] = useState(0);
  const session_id_ref = useRef(uuidv4());

  const getData = async ({
    difficulty = 0,
    knowledge_concept = "",
    score = 0,
    bookmarked = 0,
    session_id = session_id_ref.current,
  }) => {
    const res = await getRecommendQuestions({
      difficulty,
      knowledge_concept,
      score,
      bookmarked,
      session_id,
    });

    const question = res?.recommend_exercise ? parseQuestion(res.recommend_exercise) : null;

    setQuestions((prevQuestions) => [...prevQuestions, question]);
  };

  useEffect(() => {
    getData({
      knowledge_concept: "so-thuc",
    });
  }, []);

  return (
    <Container
      maxWidth={false}
      sx={{
        margin: "auto",
        width: "100%",
        position: "relative",
        maxWidth: theme.breakpoints.values.lg,
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
          <Typography variant="h4" fontWeight={700}>
            Xin chào, {user?.fullName || user?.email || "meow"}!
          </Typography>
          <Typography variant="p" fontWeight={500}>
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
      <Box
        sx={{
          paddingY: 5,
          marginY: 1,
          maxWidth: "100%",
          width: "100%",
          position: "relative",
        }}
      >
        {questions.map((question, index) => {
          if (index === questions.length - 1) {
            return (
              <SingleQuestion
                key={index}
                {...question}
                index={index + 1}
                showAnswer={true}
                setScore={setScore}
                setBookmarked={setBookmarked}
              />
            );
          }
        })}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              getData({
                knowledge_concept: questions?.at(-1)?.knowledge_concept,
                score: score,
                bookmarked: bookmarked,
                session_id: session_id_ref.current,
                difficulty: questions?.at(-1)?.difficulty || 0,
              })
            }}
          >
            Trở lại
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              getData({
                knowledge_concept: questions?.at(-1)?.knowledge_concept,
                score: score,
                bookmarked: bookmarked,
                session_id: session_id_ref.current,
                difficulty: questions?.at(-1)?.difficulty || 0,
              })
            }}
          >
            Tiếp theo
          </Button>
        </Box>
      </Box>
    </Container>
  );
}