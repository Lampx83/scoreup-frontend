import config from "./config.js";
import { getCookie } from "./helpers/cookieFunctions.js";
import { checkAuth } from "./helpers/auth.js";

import { getDatabase, getPage, getQuestions } from "./databaseAPI.js";
import { all } from "axios";
import { type } from "jquery";

const quizBox = document.querySelector(".quiz-box");
const resultBox = document.querySelector(".quiz-result");

let userScore = 0;
let questionArr = [];
let questionLength = 0;
let questionIndex = 1;
let questionCount = 0;

const headerScoreUpdate = (userScore, questionLength) => {
  const headerScoreText = quizBox.querySelector(".header-score");
  headerScoreText.textContent = `Score: ${userScore} / ${questionLength}`;
};

const renderQuizHeader = (headerTitle, questionLength, showAnswerNow) => {
  if (showAnswerNow) {
    const quizHeader = document.querySelector(".quiz-box__header");
    quizHeader.innerHTML = "";
    const headerTitleElement = document.createElement("span");
    headerTitleElement.classList.add("header-title");
    headerTitleElement.textContent = headerTitle;
    quizHeader.appendChild(headerTitleElement);

    const headerScore = document.createElement("span");
    headerScore.classList.add("text-white", "header-score");
    headerScore.textContent = `Score: 0 / ${questionLength}`;
    quizHeader.appendChild(headerScore);
  } else {
    const quizHeader = document.querySelector(".quiz-box__header");
    quizHeader.innerHTML = "";
    const headerTitleElement = document.createElement("span");
    headerTitleElement.classList.add("header-title");
    headerTitleElement.textContent = headerTitle;
    quizHeader.appendChild(headerTitleElement);
  }
};

const showQuizResults = (userScore, questionLength) => {
  
  resultBox.classList.add("active");

  const scoreText = document.querySelector(".score-text");
  scoreText.textContent = `You Score ${userScore} out of ${questionLength}`;

  const circularProgress = resultBox.querySelector(".circular-progress");
  const progressValue = resultBox.querySelector(".progress-value");
  let progressStartValue = 0;
  let progressEndValue = (userScore / questionLength) * 100;
  console.log(progressEndValue);
  let speed = 0.01;

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
    const questionDiv = document.createElement("div");
    questionDiv.classList.add(
      "d-flex",
      "flex-column",
      "align-items-center",
      "swiper-slide__question"
    );
    questionDiv.setAttribute("data-question-id", question._id);
    questionDiv.setAttribute(
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
    questionDiv.appendChild(questionBox);
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

    questionDiv.appendChild(options);
    swiperSlide.appendChild(questionDiv);
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

  if (queryObject.showAnswerNow === "true") {
    queryObject.showAnswerNow = true;
  } else {
    queryObject.showAnswerNow = false;
  }

  if (!queryString || !queryObject.certificateId) {
    window.location.href = "index.html";
    return;
  }

  //? lấy thông tin certificate
  const certificateInfo = await getPage(queryObject.certificateId);
  window.certificateInfo = certificateInfo;
  const notionDatabaseId =
    certificateInfo.properties.database_id.rich_text[0]?.plain_text;
  const certificateTitle =
    certificateInfo.properties.title.title[0]?.plain_text;
  console.log(certificateInfo);
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
  const showAnswerNow = queryObject.showAnswerNow;
  renderQuizHeader(certificateTitle, setQuestions.length, showAnswerNow);
  if (showAnswerNow) {
    document.querySelectorAll(".option-list__option").forEach((option) => {
      option.onclick = () => {
        const questionId = option.getAttribute("data-option-id");
        const answerKey = option.getAttribute("answer-key");
        const correctOption = document
          .querySelector(`[data-question-id="${questionId}"]`)
          .getAttribute("data-correct-option");
        const correctOptionElement = document.querySelector(
          `[data-option-id="${questionId}"][answer-key="${correctOption}"] `
        );

        if (answerKey == correctOption) {
          userScore += 1;
          headerScoreUpdate(userScore, setQuestions.length);
          option.classList.add("correct", "selected");
          const options = document.querySelectorAll(
            `.option-list__option[data-option-id="${questionId}"`
          );
          for (let i = 0; i < options.length; i++) {
            options[i].classList.add("disabled");
          }
        } else {
          headerScoreUpdate(userScore, setQuestions.length);
          option.classList.add("incorrect", "selected");
          correctOptionElement.classList.add("correct");
          const options = document.querySelectorAll(
            `.option-list__option[data-option-id="${questionId}"`
          );
          for (let i = 0; i < options.length; i++) {
            options[i].classList.add("disabled");
          }
        }
      };
    });
  } else {
    //# choose answer
    document.querySelectorAll(".option-list__option").forEach((option) => {
      option.onclick = () => {
        const questionId = option.getAttribute("data-option-id");

        const options = document.querySelectorAll(
          `.option-list__option[data-option-id="${questionId}"`
        );
        for (let i = 0; i < options.length; i++) {
          options[i].classList.remove("selected", "disabled");
        }
        option.classList.add("selected", "disabled");
      };
    });
    //# end choose answer
  }

  //# submit logic
  const submitBtn = document.querySelector(".submit-btn");
  submitBtn.onclick = () => {
    let correctAnswers = 0;

    //# Calculate score
    document.querySelectorAll(".option-list__option").forEach((option) => {
      const questionId = option.getAttribute("data-option-id");
      const answerKey = option.getAttribute("answer-key");
      const correctOption = document
        .querySelector(`[data-question-id="${questionId}"]`)
        .getAttribute("data-correct-option");
      const correctOptionElement = document.querySelector(
        `[data-option-id="${questionId}"][answer-key="${correctOption}"] `
      );

      if (option.classList.contains("selected")) {
        if (answerKey == correctOption) {
          correctAnswers += 1;
          option.classList.add("correct");
          option.style.setProperty('color', 'var(--correct-ans)', 'important');
          option.style.setProperty('background', 'var(--correct-ans-bg)', 'important');
        } else {
          option.classList.add("incorrect");
          option.style.setProperty('color', 'var(--incorrect-ans)', 'important');
          option.style.setProperty('background', 'var(--incorrect-ans-bg)', 'important');
          correctOptionElement.classList.add("correct");
        }
        const options = document.querySelectorAll(
          `.option-list__option[data-option-id="${questionId}"`
        );
        for (let i = 0; i < options.length; i++) {
          options[i].classList.add("disabled");
        }
      } else {
        if (answerKey == correctOption) {
          correctOptionElement.classList.add("correct");
        }
        option.classList.add("disabled");
      }
    });
    userScore = correctAnswers;
    //# Calculate score
    showQuizResults(userScore, setQuestions.length);
  };
  //# end submit logic

  //# try again 
  const tryAgainBtn = document.querySelector(".tryAgain-btn");
  tryAgainBtn.onclick = () => {
    window.location.reload();
  }
  //# end try again 

  //# go home 
  const goHomeBtn = document.querySelector(".goHome-btn");
  goHomeBtn.onclick = () => {
    window.location.href = `certificate.html?id=${certificateInfo.id}`;
  }
  //# end go home
};

checkAuth();
init();
