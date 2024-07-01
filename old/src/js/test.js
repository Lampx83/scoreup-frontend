import {
  getPage,
  getQuestions,
  privateRequest
} from './databaseAPI.js';
import {getCookie} from './helpers/cookieFunctions.js';

import * as renderQuestionsFuntions from "./helpers/renderQuestionsFunctions.js";
import { initTimerCount, initTimerCountdown } from './helpers/timerCounts.js';
import { checkAuth } from './helpers/auth.js';
import { initEditor } from './helpers/medium-editor.js';
import Viewer from 'viewerjs';


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
  // console.log(queryObject);
  
  //? lấy thông tin certificate
  const certificateInfo = await getPage(queryObject.certificateId);
  window.certificateInfo = certificateInfo;

  //? set title cho page
  const certificateTitles = document.querySelectorAll('.certificate-title');
  certificateTitles.forEach((title) => {
    title.innerHTML = "Test " + certificateInfo.properties.title.title[0]?.plain_text;
  });

  //? lấy thông tin các section của bài thi
  // !section info json
  const sectionsInfoJson = JSON.parse(certificateInfo.properties.sections_info_json.rich_text[0]?.plain_text);
  let sectionsInfo = [];
  if (!queryObject.tags) {
    sectionsInfo = [...sectionsInfoJson];
  } else {
    sectionsInfoJson.forEach((sectionInfo) => {
      if (sectionInfo.tag && queryObject.tags.includes(sectionInfo.tag)) {
        sectionsInfo.push(sectionInfo);
      }
    });
  }
  // !end section info json

  const notionDatabaseId = certificateInfo.properties.database_id.rich_text[0]?.plain_text;

  //? lặp qua từng section, lấy câu hỏi của từng section
  let count = 0;

  //? nếu là miniTest thì giảm số lượng câu hỏi
  if (queryObject.mode == "miniTest") {
    for (let sectionInfo of sectionsInfo) {
      sectionInfo.number_questions /= 3;
    }
  } else if (queryObject.mode == "shortTest") {
    for (let sectionInfo of sectionsInfo) {
      sectionInfo.number_questions /= 2;
    }
  }

  //? nếu đã có process thì lấy từ local storage
  let testProcess = JSON.parse(localStorage.getItem("testProcess"));
  if (testProcess && testProcess.certificateId === queryObject.certificateId && testProcess.mode === queryObject.mode && JSON.stringify(testProcess.tags) === JSON.stringify(queryObject.tags)){
    sectionsInfo = testProcess.sectionsInfo;
    for (let i = 0; i < sectionsInfo.length; i++) {
      const sectionInfo = sectionsInfo[i];
      const sectionQuestions = sectionInfo.sectionQuestions;
  
      //? xoá hiệu ứng loading
      const questionsDiv = document.querySelector('.questions')
      const questions = questionsDiv.closest('.questions')
      questions.classList.remove('placeholder')
      const right = questions.closest('.right')
      right.classList.remove('placeholder-glow')
      //? end xoá hiệu ứng loading
  
      //! render
      renderQuestionsFuntions.initPaletteHTML(sectionInfo.section, sectionQuestions, count, sectionInfo.multi);
      renderQuestionsFuntions.initQuestionHTML(sectionInfo.section, sectionQuestions, count, queryObject.mode, sectionInfo.multi);
      
      if (sectionInfo.multi)
        count += sectionQuestions.map(item => item.questions.length).reduce((a, b) => a + b, 0);
      else
        count += sectionQuestions.length;
    };
  } else {
    //! save process to local storage
    const testProcess = {
      certificateId: queryObject.certificateId,
      mode: queryObject.mode,
      tags: queryObject.tags,
      sectionsInfo: sectionsInfo
    };
    //! end save process to local storage
  
    for (let i = 0; i < sectionsInfo.length; i++) {
      const sectionInfo = sectionsInfo[i];
      const sectionLimit = sectionInfo.number_questions;
      let sectionQuestions = [];
      
      sectionQuestions = await getQuestions({
        notionDatabaseId,
        tag: sectionInfo.tag,
        limit: parseInt(sectionLimit),
        multiQuestions: sectionInfo.multi
      })
  
      testProcess.sectionsInfo[i].sectionQuestions = sectionQuestions;
  
      //? xoá hiệu ứng loading
      const questionsDiv = document.querySelector('.questions')
      const questions = questionsDiv.closest('.questions')
      questions.classList.remove('placeholder')
      const right = questions.closest('.right')
      right.classList.remove('placeholder-glow')
      //? end xoá hiệu ứng loading
  
      //! render
      renderQuestionsFuntions.initPaletteHTML(sectionInfo.section, sectionQuestions, count, sectionInfo.multi);
      renderQuestionsFuntions.initQuestionHTML(sectionInfo.section, sectionQuestions, count, queryObject.mode, sectionInfo.multi);
      
      if (sectionInfo.multi)
        count += sectionQuestions.map(item => item.questions.length).reduce((a, b) => a + b, 0);
      else
        count += sectionQuestions.length;
    };
  
    //! save process to local storage
    localStorage.setItem("testProcess", JSON.stringify(testProcess));
    //! end save process to local storage
  }
  testProcess = JSON.parse(localStorage.getItem("testProcess"));

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
  if (testProcess && (testProcess.remainingTime || testProcess.timeTaken)) {
    console.log(queryObject.mode)
    switch (queryObject.mode) {
      case "fullTest":
      case "miniTest":
      case "shortTest":
        window.timer = initTimerCountdown(testProcess.remainingTime / 60);
        break;
      case "practice":
        window.timer = initTimerCount(testProcess.timeTaken);
        break;
    }
  } else {
    switch (queryObject.mode) {
      case "fullTest":
        window.timer = initTimerCountdown(parseInt(certificateInfo.properties.time_limit.rich_text[0]?.plain_text));
        break;
      case "miniTest":
        window.timer = initTimerCountdown(parseInt(certificateInfo.properties.time_limit.rich_text[0]?.plain_text) / 3);
        break;
      case "shortTest":
        window.timer = initTimerCountdown(parseInt(certificateInfo.properties.time_limit.rich_text[0]?.plain_text) / 2);
        break;
      case "practice":
        window.timer = initTimerCount(0);
        break;
    };
  }
};

checkAuth();
init()
  .then(() => {
    initEditor();
    const viewer = new Viewer(document.querySelector('.images'), {
      navbar: false,
      title: false,
      toolbar: {
        zoomIn: true,
        zoomOut: true,
        oneToOne: true,
        reset: true,
        rotateLeft: true,
        rotateRight: true,
        flipHorizontal: true,
        flipVertical: true,
      },
      keyboard: false,
      loop: false,
      viewed() {
        viewer.zoomTo(1.5);
        // alert("You can zoom in/out by using mouse wheel or by clicking on the image and press 'Ctrl' and scroll up/down");
        const notification = document.createElement('div');
        notification.classList.add('notification');
        notification.innerHTML = "You can zoom in/out by using mouse wheel or use the toolbar below the image.\nYou can also move the image by dragging it.";
        document.body.appendChild(notification);
        let opacity = 1;
        const interval = setInterval(() => {
          opacity -= 0.05;
          notification.style.opacity  = opacity;
        }, 500);
        setTimeout(() => {
          clearInterval(interval);
          notification.remove();
        }, 5000);
      }
    })

    //! load process
    const testProcessSelected = JSON.parse(localStorage.getItem("testProcess")).selectedQuestions || [];
    testProcessSelected.forEach((question) => {
      const questionMain = document.querySelector(`.question-main[data-question-id="${question._id}"]`);
      const input = questionMain.querySelector(`input[value="${question.answer}"]`);
      input.click();
    });
    //! end load process
  });

//! ask for infor
const askForInfo = (button) => {
  const isAsked = (JSON.parse(getCookie("user"))).askedForInfo;
  if (!isAsked) {
    const askForInfoBtn = document.querySelector("#askForInfoBtn");
    askForInfoBtn.click();

    const askForInfoForm = document.querySelector("#askForInfo-form");
    askForInfoForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const gender = document.querySelector("#genderInput").value;
      const birth = document.querySelector("#birthInput").value;
      const occupation = document.querySelector("#occupationInput").value;
      const topics = [...document.querySelectorAll("input[name='topics']")].filter(item => item.checked).map(item => item.value);

      const response = await privateRequest({
        endpoint: "user/edit",
        method: "PATCH",
        body: {
          gender,
          birth,
          occupation,
          topicsInterested: topics,
          askedForInfo: true
        }
      });

      if (response.statusCode === 200) {
        alert("Update successed!");
        checkAuth();
      } else {
        alert("Update failed!");
      }

      const actionButton = button.getAttribute("action");
      if (actionButton === "reload") {
        window.location.reload();
      } else if (actionButton === "back") {
        window.history.back();
      }
    });
    return true;
  }
  else 
  {
    return false;
  }
}

const tryAgainBtn = document.querySelector(".tryAgain-btn");
tryAgainBtn.addEventListener("click", async () => {
  if (!askForInfo(tryAgainBtn)) {
    window.location.reload();
  };
});

const goBackBtn = document.querySelector(".goBack-btn");
goBackBtn.addEventListener("click", async () => {
  if (!askForInfo(goBackBtn)) {
    window.history.back();
  };
});

const pauseBtn = document.querySelector("#pause-btn");
pauseBtn.addEventListener("click", async () => {
  const check = confirm("Save and go back to home page?");
  if (check) {
    window.history.back();
  }
});

//! end ask for infor