import { Chip, Container, Icon, Typography, useTheme } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import Button from "@mui/material/Button";
import { IoIosArrowBack } from "react-icons/io";
import Box from "@mui/material/Box";
import * as React from "react";
import { getResultById } from "~/services/question.service.js";
import { getPage } from "~/utils/request.js";
import {
  parseCertificate,
  parseQuestion,
} from "~/helpers/parseNotionResponseToObject.js";
import { moment } from "~/utils/moment.js";
import { FaCaretDown, FaCaretUp } from "react-icons/fa6";
import parse from "html-react-parser";
import ShowHint from "~/components/Question/ShowHint/index.jsx";
import SyntaxHighlighter from "react-syntax-highlighter";
import {
  a11yLight,
  nightOwl,
} from "react-syntax-highlighter/dist/cjs/styles/hljs/index.js";
import Loading from "~/components/Loading/index.jsx";

export default function ResultAdminExamPage() {
  const theme = useTheme();
  const { certId, resultId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = React.useState(null);
  const [certInfo, setCertInfo] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const isPostTest = certId === "1a64b65d1cba804d8107c9642a70154c";

  const handleToggleQuestionPalette = (e) => {
    const element = document.getElementById("question-palette");
    if (element.style.top === "0px" || !element.style.top) {
      element.style.top = `calc(${-element.offsetHeight}px)`;
    } else {
      element.style.top = "0";
    }
    setOpen(!open);
  };

  const handleSelectQuestion = (id) => {
    const element = document.getElementById(id);
    element.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
    handleToggleQuestionPalette();
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await getResultById({
        id: resultId,
      });
      setResult(res.metadata);

      if (!isPostTest) {
        const certInfo = await getPage(certId);
        setCertInfo(parseCertificate(certInfo));
      } else {
        setCertInfo({
          title: "Đề thi thử",
        });
      }

      setIsLoading(false);
    };
    fetchData();
  }, []);

  return (
    <>
      {isLoading && <Loading />}
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
          id={"question-palette"}
          sx={{
            marginTop: 2,
            borderRadius: 3,
            paddingY: 2,
            position: "sticky",
            top: 0,
            zIndex: 1,
            backgroundColor: theme.palette.questionBackground.secondary,
            transition: "all 0.5s",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "flex-start",
            "& .question-palette__item--not-sure": {
              backgroundColor: "#FFDE4D !important",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 1,
              justifyContent: "flex-start",
              alignItems: "center",
              marginBottom: 2,
              flexBasis: "100%",
            }}
          >
            <Button
              sx={{
                padding: 1,
              }}
              onClick={() => navigate("/dashboard")}
            >
              <IoIosArrowBack />
            </Button>
            <Typography variant="h5" fontWeight={700}>
              {certInfo?.title}
            </Typography>
            <Chip
              variant={"filled"}
              label={result?.correct + "/" + result?.total}
              color={"info"}
            />
            <Chip
              variant={"filled"}
              label={moment(result?.createdAt).format("HH:mm, DD/MM/YYYY")}
              color={"secondary"}
            />
            {/*calculate time from start to end*/}
            {result?.start && result?.end && (
              <Chip
                variant={"filled"}
                label={
                  moment(result?.end).diff(moment(result?.start), "minutes") +
                  " phút"
                }
                color={"success"}
              />
            )}
          </Box>
          {result?.questions?.map((element, index) => {
            return (
              <Box
                key={index}
                sx={{
                  color: theme.palette.text.primary,
                  borderRadius: 3,
                  paddingX: 2,
                  paddingY: 1,
                  // flexBasis: "30%"
                }}
              >
                <Typography
                  variant={"h6"}
                  fontWeight={700}
                  color={theme.palette.text.secondary}
                >
                  {element.section}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                    overflow: "auto",
                    width: "fit-content",
                    marginTop: 1,
                    "::-webkit-scrollbar-thumb": {
                      background: "white",
                    },
                  }}
                >
                  {element.questions.map((_, index) => {
                    return (
                      <Button
                        key={index}
                        sx={{
                          // padding: 1,
                          minWidth: 0,
                          width: 35,
                          backgroundColor:
                            _.score === 1 ? "rgba(57,153,24,0.78)" : "#FF7777",
                        }}
                        id={`question-palette-${_.id}`}
                        onClick={() => handleSelectQuestion(_.question._id)}
                      >
                        <Typography variant={"body1"}>{_.index + 1}</Typography>
                      </Button>
                    );
                  })}
                </Box>
              </Box>
            );
          })}
          <Icon
            as={open ? FaCaretDown : FaCaretUp}
            sx={{
              color: theme.palette.text.primary,
              fontSize: 30,
              cursor: "pointer",
              position: "absolute",
              bottom: -30,
              right: 0,
              backgroundColor: theme.palette.questionBackground.secondary,
              borderRadius: "0 0 10px 10px",
              boxSizing: "content-box",
              padding: 0.5,
            }}
            onClick={(e) => handleToggleQuestionPalette(e)}
          />
        </Box>

        <Box>
          {result?.questions.map((element, index) => {
            return (
              <Box key={index} sx={{ marginTop: 5 }}>
                <Typography
                  variant={"h5"}
                  fontWeight={700}
                  color={theme.palette.text.secondary}
                >
                  {element.section}
                </Typography>
                {element?.questions?.map((question) => {
                  const user_ans = question.user_ans;
                  const correct_ans = question.correct_ans;
                  const score = question.score;
                  const index = question.index;
                  const {
                    id,
                    options = [],
                    code = "",
                    image = "",
                    audio = "",
                    hint = "",
                    totalComments = 0,
                    question: title,
                  } = parseQuestion(question.question);

                  return (
                    <Box
                      sx={{
                        backgroundColor:
                          theme.palette.questionBackground.primary,
                        borderRadius: 2,
                        marginY: 2,
                      }}
                      key={index}
                      id={id}
                    >
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
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            variant={"body1"}
                            fontWeight={700}
                            sx={{ whiteSpace: "pre-wrap" }}
                          >
                            {parse(`Câu ${index + 1}: ${title}`)}
                          </Typography>
                          {hint && <ShowHint hint={hint} showHint={true} />}
                        </Box>
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
                                width: "50%",
                                display: "flex",
                                flexDirection: "column",
                                gap: 1,
                              }}
                            >
                              <SyntaxHighlighter
                                language="c"
                                style={
                                  theme.palette.mode === "dark"
                                    ? nightOwl
                                    : a11yLight
                                }
                                wrapLongLines={true}
                                customStyle={{
                                  fontSize: "14px",
                                  borderRadius: "10px",
                                  padding: "16px",
                                }}
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
                              <img
                                style={{ width: "100%", borderRadius: "10px" }}
                                src={image}
                                alt={image}
                              />
                            </Box>
                          )}
                          <Box
                            sx={{
                              width: code || image ? "50%" : "100%",
                            }}
                          >
                            {audio && (
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                  marginBottom: 2,
                                }}
                              >
                                <audio
                                  controls
                                  controlsList="nodownload"
                                  autoPlay={false}
                                  onSeeked={() => null}
                                  src={audio}
                                >
                                  Your browser does not support the audio
                                  element.
                                </audio>
                              </Box>
                            )}
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 1,
                                width: "100%",
                              }}
                            >
                              {options.map((option, index) => {
                                const isTrue = correct_ans.includes(
                                  option.option
                                );
                                const isChoose = user_ans.includes(
                                  option.option
                                );
                                const isAnswered = user_ans.length > 0;

                                return (
                                  <Box
                                    key={index}
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
                                      backgroundColor: isAnswered
                                        ? isTrue
                                          ? "rgba(57,153,24,0.78)"
                                          : isChoose
                                            ? "#FF7777"
                                            : "white"
                                        : "white",
                                      fontWeight: isAnswered
                                        ? isTrue
                                          ? 700
                                          : isChoose
                                            ? 700
                                            : 400
                                        : 400,
                                      color: isAnswered
                                        ? isTrue
                                          ? "white"
                                          : isChoose
                                            ? "white"
                                            : theme.palette.text.secondary
                                        : theme.palette.text.secondary,
                                    }}
                                  >
                                    {`(${String.fromCharCode(index + "A".charCodeAt(0))}) ${option.text}`}
                                  </Box>
                                );
                              })}
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            );
          })}
        </Box>
      </Container>
    </>
  );
}
