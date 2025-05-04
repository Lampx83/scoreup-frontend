import { useEffect, useState, useRef, useCallback, memo, useMemo } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import {
  getRecommendQuestions,
  updateBox,
  sendPerformance,
} from "~/services/question.service.js";
import Box from "@mui/material/Box";
import { parseQuestion } from "~/helpers/parseNotionResponseToObject.js";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  HashNavigation,
  Keyboard,
  Mousewheel,
  Navigation,
} from "swiper/modules";
import { FaArrowUp, FaArrowDown, FaStop } from "react-icons/fa";

import "./styles.css";

import RecommendCard from "~/components/RecommendCard/index.jsx";
import * as React from "react";
import IconButton from "@mui/material/IconButton";
import { Tooltip } from "@mui/material";
import cookies from "~/utils/cookies.js";
export default function RecommendDetailList() {
  const [questions, setQuestions] = useState([]);
  const [initialSlide, setInitialSlide] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const swiperRef = useRef(null);
  const [current, setCurrent] = useState(0);
  const [answeredMap, setAnsweredMap] = useState({});
  const [completedSets, setCompletedSets] = useState({});
  // Track clicked/viewed questions
  const [interactedMap, setInteractedMap] = useState({});
  // Timer reference for tracking time spent on questions
  const timerRef = useRef(null);
  const user = cookies.get("user");

  const questionsParsed = useMemo(
    () => questions?.map((item) => parseQuestion(item.data)) || [],
    [questions]
  );

  const currentSetInfo = useMemo(() => {
    const currentSet = Math.floor(current / 5);
    const startIndex = currentSet * 5;
    const endIndex = Math.min((currentSet + 1) * 5, questionsParsed.length);

    return {
      currentSet,
      startIndex,
      endIndex,
      indexes: Array.from(
        { length: endIndex - startIndex },
        (_, i) => startIndex + i
      ),
      isLastInSet: (current + 1) % 5 === 0 || current === endIndex - 1,
    };
  }, [current, questionsParsed.length]);

  // Track whenever user changes slides
  useEffect(() => {
    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Start a new timer for the current question
    timerRef.current = setTimeout(() => {
      // Mark as interacted after 5 seconds
      setInteractedMap((prev) => {
        if (prev[current]) return prev;
        return { ...prev, [current]: true };
      });
    }, 5000);

    // Clean up timer on unmount or when changing slides
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [current]);

  const handleSetCompleted = useCallback(
    (setIndex) => {
      if (completedSets[setIndex]) return;

      const startIdx = setIndex * 5;
      const endIdx = Math.min((setIndex + 1) * 5, questionsParsed.length);

      const setQuestions = questionsParsed.slice(startIdx, endIdx);
      const setQuestionsData = questions.slice(startIdx, endIdx);

      const setData = setQuestions.map((q, idx) => ({
        id: q.id,
        type: setQuestionsData[idx].category,
      }));

      // Your custom logic here for completed sets
      updateBox({ setData });

      // Use the actual number of questions in this set
      const totalQuestionsInSet = setQuestions.length;

      // Send performance metrics - use the actual count for all metrics
      sendPerformance({
        total: totalQuestionsInSet,
        click: totalQuestionsInSet,
        completed: totalQuestionsInSet,
      });

      setCompletedSets((prev) => ({ ...prev, [setIndex]: true }));

      return setData;
    },
    [completedSets, questionsParsed, questions]
  );

  const handleLastQuestionOfIncompleteSet = useCallback(() => {
    // Only execute if we're at the last question of a set
    if (!currentSetInfo.isLastInSet) return;

    // Check if this set is already completed
    if (completedSets[currentSetInfo.currentSet]) return;

    // Get questions in the current set
    const setQuestions = questionsParsed.slice(
      currentSetInfo.startIndex,
      currentSetInfo.endIndex
    );

    // Get question data in the current set
    const setQuestionsData = questions.slice(
      currentSetInfo.startIndex,
      currentSetInfo.endIndex
    );

    // Create array with questions and their answered status
    const setStatus = setQuestions.map((q, idx) => {
      const questionIndex = currentSetInfo.startIndex + idx;
      return {
        id: q.id,
        index: questionIndex,
        type: setQuestionsData[idx].category,
        isAnswered: !!answeredMap[questionIndex],
        clicked: !!interactedMap[questionIndex],
      };
    });

    // Output to console for debugging
    // console.log(
    //   `Incomplete set ${currentSetInfo.currentSet} at last question:`,
    //   setStatus
    // );
    // console.log(
    //   "Unanswered questions:",
    //   setStatus.filter((q) => !q.isAnswered)
    // );
    const answeredQuestions = setStatus.filter((q) => q.isAnswered);
    if (answeredQuestions.length > 0) {
      updateBox({ setData: answeredQuestions });
    }

    return setStatus;
  }, [
    currentSetInfo,
    completedSets,
    questionsParsed,
    questions,
    answeredMap,
    interactedMap,
  ]);

  const handleAnswered = useCallback(
    (questionId, type) => {
      // When answering, also mark as interacted
      setInteractedMap((prev) => ({
        ...prev,
        [current]: true,
      }));

      setAnsweredMap((prev) => {
        if (prev[current]) return prev;

        const newMap = { ...prev, [current]: true };

        const allInSetAnswered = currentSetInfo.indexes.every(
          (idx) => newMap[idx]
        );

        if (allInSetAnswered) {
          // Before handling set completion, make sure all questions in set are marked as interacted
          const updatedInteractedMap = { ...interactedMap };
          currentSetInfo.indexes.forEach((idx) => {
            updatedInteractedMap[idx] = true;
          });
          setInteractedMap(updatedInteractedMap);

          // Short delay to allow state update before handling set completion
          setTimeout(() => {
            handleSetCompleted(currentSetInfo.currentSet);
          }, 10);
        }

        return newMap;
      });
    },
    [current, currentSetInfo, handleSetCompleted, interactedMap]
  );

  // Handle card click - mark as interacted
  const handleCardClick = useCallback(() => {
    setInteractedMap((prev) => ({
      ...prev,
      [current]: true,
    }));
  }, [current]);

  // Handle exit button click
  const handleExit = useCallback(() => {
    // Get current set information
    const currentSet = Math.floor(current / 5);

    // Only send performance data if this set hasn't been completed yet
    // (to avoid duplicate data, since completed sets already trigger sendPerformance)
    if (!completedSets[currentSet]) {
      const startIndex = currentSet * 5;
      const endIndex = Math.min((currentSet + 1) * 5, questionsParsed.length);

      // Count stats for the current set
      const totalQuestions = endIndex - startIndex;
      let clickedCount = 0;
      let completedCount = 0;

      // Calculate metrics for current set
      for (let i = startIndex; i < endIndex; i++) {
        // Count as interacted if explicitly interacted with OR answered
        if (interactedMap[i] || answeredMap[i]) {
          clickedCount++;
        }
        if (answeredMap[i]) {
          completedCount++;
        }
      }

      // Only send performance data if there's any interaction or completion
      if (clickedCount > 0 || completedCount > 0) {
        // Send performance data for the current set
        sendPerformance({
          total: totalQuestions,
          click: clickedCount,
          completed: completedCount,
        });
      }

      // Update box with answered questions from the current set
      if (completedCount > 0) {
        // Get questions in the current set
        const setQuestions = questionsParsed.slice(startIndex, endIndex);
        const setQuestionsData = questions.slice(startIndex, endIndex);

        // Create array with answered questions data
        const answeredQuestionsData = [];
        for (let i = 0; i < setQuestions.length; i++) {
          const questionIndex = startIndex + i;
          if (answeredMap[questionIndex]) {
            answeredQuestionsData.push({
              id: setQuestions[i].id,
              type: setQuestionsData[i].category,
            });
          }
        }

        // Update box with answered questions
        if (answeredQuestionsData.length > 0) {
          updateBox({ setData: answeredQuestionsData });
        }
      }
    }

    // Navigate back
    navigate(`/dashboard`);
  }, [
    current,
    questionsParsed,
    questions,
    interactedMap,
    answeredMap,
    navigate,
    completedSets,
  ]);

  const getCanNext = useCallback(() => {
    const nextQuestion = current + 1;

    if (nextQuestion >= questionsParsed.length) return false;

    const nextQuestionSet = Math.floor(nextQuestion / 5);

    if (nextQuestionSet === currentSetInfo.currentSet) return true;

    return currentSetInfo.indexes.every((idx) => answeredMap[idx]);
  }, [current, questionsParsed.length, currentSetInfo, answeredMap]);

  useEffect(() => {
    if (location.state?.targetIndex !== undefined) {
      setInitialSlide(location.state.targetIndex);
      if (!location.hash) {
        window.location.hash = location.state.targetIndex;
      }
    } else if (location.hash) {
      const hash = location.hash.replace("#", "");
      if (!isNaN(Number(hash))) {
        setInitialSlide(Number(hash));
      }
    }
  }, [location]);

  useEffect(() => {
    const fetchQuestions = async () => {
      const res = await getRecommendQuestions();
      setQuestions(res.data);
    };
    fetchQuestions();
  }, []);

  // Check if we're at the last question of a set whenever current changes
  useEffect(() => {
    if (currentSetInfo.isLastInSet) {
      handleLastQuestionOfIncompleteSet();
    }
  }, [current, currentSetInfo.isLastInSet, handleLastQuestionOfIncompleteSet]);

  const handleSwiperInit = useCallback(
    (swiper) => {
      swiperRef.current = swiper;

      let targetIndex = location.state?.targetIndex ?? 0;

      if (!targetIndex && location.hash) {
        const hash = location.hash.replace("#", "");
        if (!isNaN(Number(hash))) {
          targetIndex = Number(hash);
        }
      }

      if (targetIndex > 0) {
        setTimeout(() => swiper.slideTo(targetIndex, 0), 100);
      }
    },
    [location]
  );

  if (!user?.recommend) {
    return <Navigate to="/dashboard" />;
  }

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
              modules={[Mousewheel, Navigation, Keyboard, HashNavigation]}
              className="swiper"
              navigation={{
                nextEl: ".next-button-swiper",
                prevEl: ".prev-button-swiper",
              }}
              initialSlide={initialSlide}
              onSwiper={handleSwiperInit}
              onSlideChange={(swiper) => setCurrent(swiper.activeIndex)}
            >
              {questionsParsed.map((question, index) => (
                <SwiperSlide key={index} data-hash={`${index}`}>
                  <Box
                    sx={{
                      height: "100%",
                      maxHeight: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onClick={handleCardClick}
                  >
                    <RecommendCard
                      {...question}
                      type={questions[index].category}
                      desc={questions[index].desc}
                      onAnswered={handleAnswered}
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
          <Tooltip title="Thoát">
            <IconButton onClick={handleExit}>
              <FaStop />
            </IconButton>
          </Tooltip>
          <Tooltip
            title={
              getCanNext()
                ? "Tiếp"
                : `${
                    current === questionsParsed.length - 1
                      ? "Đã hết câu hỏi!"
                      : "Hãy hoàn thành những câu hỏi trước để xem thêm!"
                  }`
            }
          >
            <span>
              <NextBtn getCanNext={getCanNext} />
            </span>
          </Tooltip>
        </Box>
      </Box>
    </>
  );
}

const NextBtn = memo(function nextBtn({ getCanNext }) {
  return (
    <IconButton
      className="next-button-swiper"
      variant="text"
      disabled={!getCanNext()}
    >
      <FaArrowDown />
    </IconButton>
  );
});
