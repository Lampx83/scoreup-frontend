import {
  getDatabase,
  getPage,
  getQuestions
} from './databaseAPI.js';

import * as renderQuestionsFuntions from "./helpers/renderQuestionsFunctions.js";
import { initTimerCount, initTimerCountdown } from './helpers/timerCounts.js';
import { checkAuth } from './helpers/auth.js';
import config from './config.js';

const init = async () => {
  //? lấy certificateId từ url
  const queryString = window.location.search.slice(1);
  const queryObject = {};
  queryString.split('&').forEach((item) => {
    const [key, value] = item.split('=');
    queryObject[key] = value;
  });
  if (!queryString || !queryObject.certificateId) {
    window.location.href = "index.html";
    return;
  }
  if (queryObject.tags && queryObject.tags.length > 0){
    queryObject.tags = queryObject.tags.split(",");
  }
  console.log(queryObject);
  
  //? lấy thông tin certificate
  const certificateInfo = await getPage(queryObject.certificateId);
  window.certificateInfo = certificateInfo;

  //? set title cho page
  const certificateTitles = document.querySelectorAll('.certificate-title');
  certificateTitles.forEach((title) => {
    title.innerHTML = "Test " + certificateInfo.properties.title.title[0]?.plain_text;
  });

  //? lấy thông tin các section của bài thi
  let sectionsInfoString = certificateInfo.properties.sections_info.rich_text[0]?.plain_text;
  const sectionsInfo = {};
  
  if (!queryObject.tags) {    
    sectionsInfoString.split(";").forEach(item => {
      const [key, value] = item.split(":");
      sectionsInfo[key] = value;
    });
  } else {
    sectionsInfoString.split(";").forEach(item => {
      const [key, value] = item.split(":");
      if (queryObject.tags.some(tag => {
        return (key.toLowerCase().split(" ").join("_")).includes(tag);
      })) {
        sectionsInfo[key] = value;
      }
    });
  }

  const notionDatabaseId = certificateInfo.properties.database_id.rich_text[0]?.plain_text;

  //? lặp qua từng section, lấy câu hỏi của từng section
  const questionsBySection = {};
  let count = 0;
  for (let sectionTitle in sectionsInfo) {
    const sectionLimit = sectionsInfo[sectionTitle];
    let sectionQuestions = [];
    if (sectionTitle.includes("-multi")) {
      sectionTitle = sectionTitle.replace("-multi", "");
      sectionQuestions = await getQuestions({
        notionDatabaseId,
        tag: sectionTitle.toLowerCase().split(" ").join("_"),
        limit: parseInt(sectionLimit),
        multiQuestions: true
      })
      questionsBySection[sectionTitle + "-multi"] = sectionQuestions;

      //? xoá hiệu ứng loading
      const questionsDiv = document.querySelector('.questions')
      const questions = questionsDiv.closest('.questions')
      questions.classList.remove('placeholder')
      const right = questions.closest('.right')
      right.classList.remove('placeholder-glow')
      //? end xoá hiệu ứng loading

      //! render palette
      renderQuestionsFuntions.initPaletteHTML(sectionTitle + "-multi", sectionQuestions, count);
      renderQuestionsFuntions.initQuestionHTML(sectionTitle + "-multi", sectionQuestions, count);
      
      count += sectionQuestions.map(item => item.questions.length).reduce((a, b) => a + b, 0);
    } else {
      //? xoá hiệu ứng loading
      const questionsDiv = document.querySelector('.questions')
      const questions = questionsDiv.closest('.questions')
      questions.classList.remove('placeholder')
      const right = questions.closest('.right')
      right.classList.remove('placeholder-glow')
      //? end xoá hiệu ứng loading

      sectionQuestions = await getQuestions({
        notionDatabaseId,
        tag: sectionTitle.toLowerCase().split(" ").join("_"),
        limit: parseInt(sectionLimit),
      })
      questionsBySection[sectionTitle] = sectionQuestions;
      //! render palette
      renderQuestionsFuntions.initPaletteHTML(sectionTitle, sectionQuestions, count);
      renderQuestionsFuntions.initQuestionHTML(sectionTitle, sectionQuestions, count);
      count += sectionQuestions.length;
    }
  };
  //! lấy questionContainer đầu tiên rồi hiển thị
  const questionContainers = document.querySelectorAll(".question-container");
  renderQuestionsFuntions.showQuestion(questionContainers[0].getAttribute("data-question-id"));
  
  //! logic chuyển câu hỏi
  renderQuestionsFuntions.navigateQuestion();

  //! logic show hint
  renderQuestionsFuntions.showHint();

  //! logic for form
  renderQuestionsFuntions.initFormLogic();

  //! đếm giờ, set biến global timer
  if (certificateInfo.properties.time_limit.rich_text[0]?.plain_text) {
    const timeLimit = certificateInfo.properties.time_limit.rich_text[0]?.plain_text;
    const timer = initTimerCountdown(timeLimit);
    window.timer = timer;
    window.timeIn = new Date();
  } else {
    const timer = initTimerCount();
    window.timer = timer;
    window.timeIn = new Date();
  }
};

checkAuth();
init();