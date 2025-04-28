import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getRecommendQuestions } from "~/services/question.service.js";
import Box from "@mui/material/Box";
import { parseQuestion } from "~/helpers/parseNotionResponseToObject.js";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  HashNavigation,
  Keyboard,
  Mousewheel,
  Navigation,
  Virtual,
} from "swiper/modules";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

import "./styles.css";

import RecommendCard from "~/components/RecommendCard/index.jsx";
import * as React from "react";
import IconButton from "@mui/material/IconButton";

export default function RecommendDetailList() {
  const [questions, setQuestions] = useState([]);
  const [initialSlide, setInitialSlide] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const swiperRef = useRef(null);

  // Extract hash number or state when component mounts or location changes
  useEffect(() => {
    // First check if we have targetIndex in location state
    if (location.state && typeof location.state.targetIndex === "number") {
      setInitialSlide(location.state.targetIndex);
      // Set hash if it's not already set
      if (!location.hash) {
        window.location.hash = location.state.targetIndex;
      }
    }
    // Then check hash
    else if (location.hash) {
      const hash = location.hash.replace("#", "");
      if (hash && !isNaN(Number(hash))) {
        setInitialSlide(Number(hash));
      }
    }
  }, [location]);

  // Fetch questions
  useEffect(() => {
    const fetchQuestions = async () => {
      const res = await getRecommendQuestions();
      setQuestions(res.data);
    };
    fetchQuestions();
  }, []);

  // Handle swiper initialization
  const handleSwiperInit = (swiper) => {
    swiperRef.current = swiper;

    // Get target index from state or hash
    let targetIndex = 0;

    if (location.state && typeof location.state.targetIndex === "number") {
      targetIndex = location.state.targetIndex;
    } else if (location.hash) {
      const hash = location.hash.replace("#", "");
      if (hash && !isNaN(Number(hash))) {
        targetIndex = Number(hash);
      }
    }

    // Navigate to the correct slide after Swiper is initialized
    if (targetIndex > 0) {
      setTimeout(() => {
        swiper.slideTo(targetIndex, 0);
      }, 100);
    }
  };

  const questionsParsed =
    questions?.map((item) => parseQuestion(item.data)) || [];

  return (
    <>
      <Box
        sx={{
          marginX: 4,
          height: "90vh",
          display: "flex",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box
          sx={{
            height: "100%",
            maxHeight: "100%",
            display: "flex",
            justifyContent: "center",
            gap: 2,
            width: "100%",
          }}
        >
          {questions.length > 0 && (
            <Swiper
              direction={"vertical"}
              slidesPerView={1}
              spaceBetween={30}
              keyboard={true}
              mousewheel={false}
              allowTouchMove={false}
              pagination={{
                clickable: true,
              }}
              hashNavigation={{
                watchState: true,
                replaceState: true,
              }}
              modules={[
                Mousewheel,
                Navigation,
                Keyboard,
                Virtual,
                HashNavigation,
              ]}
              className="swiper"
              navigation={{
                nextEl: ".next-button-swiper",
                prevEl: ".prev-button-swiper",
              }}
              virtual
              initialSlide={initialSlide}
              onSwiper={handleSwiperInit}
            >
              {questionsParsed.map((question, index) => (
                <SwiperSlide
                  key={index}
                  virtualIndex={index}
                  data-hash={`${index}`}
                >
                  <Box
                    sx={{
                      height: "100%",
                      maxHeight: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <RecommendCard
                      {...question}
                      type={questions[index].category}
                      desc={questions[index].desc}
                    />
                  </Box>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <IconButton className="prev-button-swiper" variant="text">
            <FaArrowUp />
          </IconButton>
          <IconButton className="next-button-swiper" variant="text">
            <FaArrowDown />
          </IconButton>
        </Box>
      </Box>
    </>
  );
}
