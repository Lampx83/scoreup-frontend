import { Button, Tooltip, Typography } from "@mui/material";
import { HiOutlineLightBulb } from "react-icons/hi";
import Box from "@mui/material/Box";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore.js";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Virtual } from "swiper/modules";
import BoxItem from "~/components/BoxItem/index.jsx";
import NavigateNextIcon from "@mui/icons-material/NavigateNext.js";
import * as React from "react";
import { parseQuestion } from "~/helpers/parseNotionResponseToObject.js";
import { useEffect, useState } from "react";
import { getRecommendQuestions } from "~/services/question.service.js";

export default function RecommendBox() {
  const [questions, setQuestions] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [totalQuestions, setTotalQuestions] = useState(0);

  useEffect(() => {
    const fetchQuestions = async () => {
      const res = await getRecommendQuestions();
      setTotalQuestions(res?.data?.length || 0);
      if (res?.data?.length > 5) {
        res.data = res.data.slice(0, 5);
        setHasMore(true);
      }
      setQuestions(res?.data || []);
    };
    fetchQuestions();
  }, []);

  const questionsParsed =
    questions?.map((item) => parseQuestion(item.data)) || [];

  return (
    <Box
      sx={{
        marginY: 4,
        border: "1px solid #e0e0e0",
        padding: 2,
        borderRadius: 2,
        backgroundColor: "#F8F9FAFF",
      }}
    >
      <Typography variant="h5" fontWeight={700} sx={{ marginBottom: 2 }}>
        <HiOutlineLightBulb /> Bài tập đề xuất {`(${totalQuestions})`}:
      </Typography>
      {questions.length === 0 ? (
        <Box sx={{ padding: 2, textAlign: "center" }}>
          <Typography variant="body1">
            Chưa có câu hỏi gợi ý, hãy làm thêm bài tập!
          </Typography>
        </Box>
      ) : (
        <>
          <Box
            sx={{
              paddingBottom: 2,
              display: "flex",
              gap: 1,
              alignItems: "center",
            }}
          >
            <Button
              className="prev-button-swiper"
              variant="text"
              sx={{ padding: 1, minWidth: 0 }}
            >
              <NavigateBeforeIcon />
            </Button>
            <Swiper
              slidesPerView={3}
              spaceBetween={30}
              pagination={{
                dynamicBullets: true,
                el: ".pagination-swiperrrr",
              }}
              navigation={{
                nextEl: ".next-button-swiper",
                prevEl: ".prev-button-swiper",
              }}
              modules={[Pagination, Navigation, Virtual]}
              className="mySwiper"
              virtual
            >
              {questionsParsed.map((question, index) => (
                <SwiperSlide key={index} virtualIndex={index}>
                  <BoxItem
                    question={question}
                    type={questions[index].category}
                    desc={questions[index].desc}
                    index={index}
                  />
                </SwiperSlide>
              ))}
              {hasMore && (
                <SwiperSlide virtualIndex={questionsParsed.length}>
                  <Box
                    sx={{
                      padding: 2,
                      border: "1px solid #E0E0E0",
                      borderRadius: 2,
                      boxShadow: 1,
                      backgroundColor: "white",
                      cursor: "pointer",
                      height: "250px",
                      boxSizing: "border-box",
                    }}
                  >
                    <Typography
                      variant="body1"
                      fontWeight={600}
                      sx={{
                        overflow: "hidden",
                        whiteSpace: "wrap",
                        maxWidth: "100%",
                      }}
                    >
                      Hãy hoàn thành những câu hỏi trước đó để xem thêm...
                    </Typography>
                  </Box>
                </SwiperSlide>
              )}
            </Swiper>
            <Button
              className="next-button-swiper"
              variant="text"
              sx={{ padding: 1, minWidth: 0 }}
            >
              <NavigateNextIcon />
            </Button>
          </Box>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Box
              className="pagination-swiperrrr"
              sx={{
                marginX: "auto",
                transform: "translateX(0) !important",
              }}
            ></Box>
          </Box>
        </>
      )}
    </Box>
  );
}
