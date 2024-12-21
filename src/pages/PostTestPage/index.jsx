import * as React from "react";
import Box from "@mui/material/Box";
import headerImg from "~/assets/images/Container 136.png";
import {Chip, Container, Typography, useTheme} from "@mui/material";
import SingleQuestion from "~/components/Question/SingleQuestion/index.jsx";
import SetQuestion from "~/components/Question/SetQuestion/index.jsx";
import {useEffect, useRef, useState} from "react";
import {getQuestions, submitResult} from "~/services/question.service.js";
import { parseQuestion } from "~/helpers/parseNotionResponseToObject.js";
import QuestionsPalette from "~/components/QuestionsPalette/index.jsx";
import cookies from "~/utils/cookies.js";
import useActiveTab from "~/hooks/useActiveTab.jsx";
import Loading from "~/components/Loading/index.jsx";
import {useNavigate, useParams} from "react-router-dom";


export default function PostTestPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const {updateActiveTab} = useActiveTab();
  const user = cookies.get("user");
  const [showAnswer, setShowAnswer] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const result = useRef({
    questions: [],
    total: 0,
    correct: 0,
    start: new Date(),
    end: null,
  });
  const { notionDatabaseId } = useParams();
  // new Date() + 30 mins
  let countFrom = new Date().getTime() + 30 * 60 * 1000;

  const addResult = ({
                       question,
                       user_ans,
                       correct_ans,
                       score
                     }) => {
    if (score) {
      result.current.correct++;
    }
    for (const item of result.current.questions) {
      for (const q of item.questions) {
        if (q.question === question) {
          q.user_ans = user_ans;
          q.correct_ans = correct_ans;
          q.score = score;
          break;
        }
      }
    }
  }

  const [questions, setQuestions] = useState([]);
  let count = 0;

  useEffect(() => {
    setQuestions([]);
    setShowAnswer(false);
    setIsSubmitted(false);
    result.current = {
      questions: [],
      total: 0,
      correct: 0,
      start: new Date(),
      end: null,
    }
    const getData = async () => {
      let questions = [];

      const res = await getQuestions({
        limit: 30,
        multiQuestions: false,
        tag: "post_test",
        notionDatabaseId,
      });
      // questions = [...questions, ...(res?.map(parseQuestion))];
      questions.push({
        section: "Bài thi thử cuối kì",
        multi: false,
        questions: res?.map(parseQuestion),
      });

      result.current.questions.push({
        section: "Bài thi thử cuối kì",
        multi: false,
        questions: res?.map(parseQuestion)?.map((question) => ({
          question: question.id,
          user_ans: [],
          correct_ans: [question.correct],
          score: 0,
          index: count++,
        })),
      })

      setQuestions(questions);

      result.current.total = questions.reduce((acc, cur) => {
        return acc + cur.questions.length;
      }, 0);
    };
    getData();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    updateActiveTab("post-test")
  }, []);

  useEffect(() => {
    const sendResult = async () => {
      if (isSubmitted) {
        const calculateCorrect = () => {
          let correct = 0;
          for (const item of result.current.questions) {
            for (const q of item.questions) {
              if (q.score === 1) {
                correct++;
              }
            }
          }
          return correct;
        }

        const res = await submitResult({
          user_id: user?.id,
          certificateId: notionDatabaseId,
          questions: result.current.questions,
          total: result.current.total,
          correct: calculateCorrect(),
          start: result.current.start,
          end: new Date(),
        });

        navigate(`/history/${notionDatabaseId}/${res?.metadata?._id}`);
      }
    }
    sendResult();
  }, [isSubmitted]);

  return (
    <>
      {questions.length === 0 ? (
        <Loading />
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
                Xin chào, {user?.fullName || user?.email || "meow"}!
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

          {(
            <Box
              sx={{
                paddingY: 5,
                marginY: 1,
                maxWidth: "100%",
                width: "100%",
                position: "relative",
              }}
            >
              <QuestionsPalette
                questions={questions}
                showAnswer={showAnswer}
                setShowAnswer={setShowAnswer}
                setIsSubmitted={setIsSubmitted}
                result={result}
                isSubmitted={isSubmitted}
                countFrom={countFrom}
                isTest={true}
              />

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
                            showAnswer={showAnswer}
                            isSubmitted={isSubmitted}
                            addResult={addResult}
                            showActions={false}
                          />
                        );
                      } else {
                        return (
                          <SingleQuestion
                            key={index}
                            {...question}
                            index={++count}
                            showAnswer={showAnswer}
                            isSubmitted={isSubmitted}
                            addResult={addResult}
                            showActions={false}
                          />
                        );
                      }
                    })}
                  </Box>
                );
              })}
            </Box>
          )}
        </Container>
      )}
    </>
  );
}
