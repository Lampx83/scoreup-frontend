import config from "./config.js";
import { getCookie } from "./helpers/cookieFunctions.js";
import { checkAuth } from "./helpers/auth.js";

import { getDatabase, getPage, getQuestions } from "./databaseAPI.js";
import { all } from "axios";
import { type } from "jquery";

const quizBox = document.querySelector(".quiz-box");
// const optionList = quizBox.querySelector(".option-list");
// const resultBox = document.querySelector(".quiz-result");
// const tryAgainBtn = document.querySelector(".tryAgain-btn");
// const nextBtn = quizBox.querySelector(".next-btn");
// const goHomeBtn = resultBox.querySelector(".goHome-btn");

let userScore = 0;
let questionArr = [];
let questionLength = 0;
let questionIndex = 1;
let questionCount = 0;

const headerScoreUpdate = (userScore, questionLength) => {
  const headerScoreText = quizBox.querySelector(".header-score");
  headerScoreText.textContent = `Score: ${userScore} / ${questionLength}`;
};

const questionCounter = (index) => {
  const questionTotal = quizBox.querySelector(".question-total");
  questionTotal.textContent = `${index} of ${questionLength} Questions`;
};

const showQuestion = (index, question) => {
  const questionText = quizBox.querySelector(".question-text");
  questionText.innerHTML = `${index}. ${question.question}`;

  question.options.forEach((option) => {
    const optionDiv = document.createElement("div");
    optionDiv.classList.add("option-list__option");
    optionDiv.innerHTML = `<span>${option.optionText}</span>`;
    optionList.appendChild(optionDiv);
    optionDiv.onclick = () => {
      let correctAnswer = question.answer;
      let userAnswer = option.userAnswer;
      if (correctAnswer == userAnswer) {
        optionDiv.classList.add("correct");
        userScore += 1;
        headerScoreUpdate();
      } else {
        optionDiv.classList.add("incorrect");

        const correctAnswerText = question.options.filter(
          (item) => item.userAnswer == correctAnswer
        )[0].optionText;
        const allOptions = quizBox.querySelectorAll(".option-list__option");
        for (let i = 0; i < allOptions.length; i++) {
          if (allOptions[i].innerText == correctAnswerText) {
            allOptions[i].classList.add("correct");
          }
          allOptions[i].classList.add("disabled");
        }
      }

      nextBtn.classList.add("active");
    };
  });

  console.log(question);
};


const showQuizResults = () => {
  quizBox.classList.add("d-none");
  resultBox.classList.add("active");

  const scoreText = document.querySelector(".score-text");
  scoreText.textContent = `You Score ${userScore} out of ${questionLength}`;

  const circularProgress = resultBox.querySelector(".circular-progress");
  const progressValue = resultBox.querySelector(".progress-value");
  let progressStartValue = 0;
  let progressEndValue = (userScore / questionLength) * 100;
  console.log(progressEndValue);
  let speed = 1;

  let progress = setInterval(() => {
    if (userScore === 0) {
      progressValue.textContent = `${progressStartValue.toFixed(1)} %`;
      circularProgress.style.background = `conic-gradient(#a5d7e8 ${
        progressStartValue * 3.6
      }deg, var(--light-p-color) 0deg)`;
      clearInterval(progress);
    } else {
      progressStartValue += 0.1;
      progressValue.textContent = `${progressStartValue.toFixed(1)} %`;
      circularProgress.style.background = `conic-gradient(#a5d7e8 ${
        progressStartValue * 3.6
      }deg, var(--light-p-color) 0deg)`;
      if (progressStartValue.toFixed(1) == progressEndValue.toFixed(1)) {
        clearInterval(progress);
      }
    }
  }, speed);
};

const renderQuestions = (setQuestions) => {
  const mySwiper = document.querySelector(".mySwiper");
  mySwiper.innerHTML = "";
  //render swiperWrapper
  const swiperWrapper = document.createElement("div");
  swiperWrapper.classList.add("swiper-wrapper");
  setQuestions.forEach((question) => {
    // render swiperSlide
    const swiperSlide = document.createElement("div");
    swiperSlide.classList.add("swiper-slide");
    // end render swiperSlide

    // render form
    const form = document.createElement("form");
    form.classList.add("d-flex", "flex-column", "align-items-center");
    form.setAttribute("data-question-id", question._id);
    form.setAttribute(
      "data-correct-option",
      question.properties.correct.rich_text[0].plain_text
    );
    // end render form

    // render question text
    const questionBox = document.createElement("div");
    questionBox.classList.add(
      "question-box",
      "d-flex",
      "flex-column",
      "align-items-center"
    );

    const questionText = document.createElement("h6");
    questionText.classList.add("question-box__text");
    questionText.innerHTML =
      question.properties.question.rich_text[0].plain_text;
    questionBox.appendChild(questionText);
    if (question.properties.img.rich_text[0]?.plain_text) {
      const questionImg = document.createElement("img");
      questionImg.src =
        `${config.mediaUrl}` + question.properties.img.rich_text[0]?.plain_text;
      questionImg.alt = "question image";
      questionBox.appendChild(questionImg);
    }
    form.appendChild(questionBox);
    // render question text

    // render options
    const options = document.createElement("div");
    options.classList.add("option-list");
    for (const key in question.properties) {
      if (
        /^[a-zA-Z]$/.test(key) &&
        question.properties[key].rich_text?.length > 0
      ) {
        const option = document.createElement("div");
        option.classList.add("option-list__option", "col-6");
        option.setAttribute("data-option-id", question._id);
        option.setAttribute("answer-key", key);
        option.innerHTML = `<span>${question.properties[key].rich_text[0].plain_text}</span>`;
        options.appendChild(option);
      }
    }

    // sort options
    const optionElements = options.querySelectorAll(".option-list__option");
    const sortedOptions = Array.from(optionElements).sort((a, b) => {
      const textA = a.querySelector("span").textContent.trim();
      const textB = b.querySelector("span").textContent.trim();
      return textA.localeCompare(textB);
    });

    options.innerHTML = "";
    sortedOptions.forEach((option) => {
      options.appendChild(option);
    });
    // end sort options

    form.appendChild(options);
    swiperSlide.appendChild(form);
    // end render options
    swiperWrapper.appendChild(swiperSlide);
  });
  mySwiper.appendChild(swiperWrapper);
  //render swiperWrapper

  //render swiper-pagination
  const swiperBtnNext = document.createElement("div");
  swiperBtnNext.classList.add("swiper-button-next");
  mySwiper.appendChild(swiperBtnNext);
  const swiperBtnPrev = document.createElement("div");
  swiperBtnPrev.classList.add("swiper-button-prev");
  mySwiper.appendChild(swiperBtnPrev);
  const swiperPagination = document.createElement("div");
  swiperPagination.classList.add("swiper-pagination");
  mySwiper.appendChild(swiperPagination);
  //end render swiper-pagination

  var swiper = new Swiper(".mySwiper", {
    pagination: {
      el: ".swiper-pagination",
      type: "progressbar",
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });
};

const init = async () => {
  const queryString = window.location.search.slice(1).split("&");
  const queryObject = {};
  queryString.forEach((query) => {
    const [key, value] = query.split("=");
    queryObject[key] = value;
  });

  // console.log(queryObject)

  if (!queryString || !queryObject.certificateId) {
    window.location.href = "index.html";
    return;
  }

  //? lấy thông tin certificate
  const certificateInfo = await getPage(queryObject.certificateId);
  window.certificateInfo = certificateInfo;
  const notionDatabaseId =
    certificateInfo.properties.database_id.rich_text[0]?.plain_text;

  //? lấy thông tin các section của bài thi

  let metadata = {
    tag: queryObject.tags,
    multiQuestions: true,
    limit: queryObject.limit,
    notionDatabaseId: notionDatabaseId,
  };
  const data = await getQuestions(metadata);
  
  const setQuestions = data[0].questions;
  renderQuestions(setQuestions);
  headerScoreUpdate(0, setQuestions.length);

  // logic show answer immdiately
  let showAnswerNow = true;
  if (showAnswerNow) {
    document.querySelectorAll(".option-list__option").forEach((option) => {
      option.onclick = () => {
        const questionId = option.getAttribute("data-option-id");
        const answerKey = option.getAttribute("answer-key");
        
        const correctOption = document.querySelector(
          `[data-question-id="${questionId}"]`
        ).getAttribute("data-correct-option");
        const correctOptionElement = document.querySelector(
          `[data-option-id="${questionId}"][answer-key="${correctOption}"] `
        );

        console.log(answerKey)
        console.log(correctOption)
        if (answerKey == correctOption) {
          userScore += 1;
          headerScoreUpdate(userScore, setQuestions.length);
          option.classList.add("correct");
          const options = document.querySelectorAll(`.option-list__option[data-option-id="${questionId}"`);  
          for (let i = 0; i < options.length; i++) {
            options[i].classList.add("disabled");
          }
        } else {
          headerScoreUpdate(userScore, setQuestions.length);
          option.classList.add("incorrect");
          correctOptionElement.classList.add("correct");
          const options = document.querySelectorAll(`.option-list__option[data-option-id="${questionId}"`);  
          for (let i = 0; i < options.length; i++) {
            options[i].classList.add("disabled");
          }
        }
      };
    });
  }
  // end logic show answer immdiately


};



checkAuth();
init();
