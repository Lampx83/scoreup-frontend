import createTopNav from "./topNav.js";
import { getCookie } from "./helpers/cookieFunctions.js";
import createFooter from "./footer.js";
import config from "./config.js";
createTopNav("home");
createFooter();

import {
  getPage,
  getQuestions,
  privateRequest
} from './databaseAPI.js';

import * as renderQuestionsFuntions from "./helpers/renderQuestionsFunctions.js";
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
  //
  // //? nếu đã có process thì lấy từ local storage
  // for (let i = 0; i < sectionsInfo.length; i++) {
  //   const sectionInfo = sectionsInfo[i];
  //   const sectionLimit = sectionInfo.number_questions;
  //   let sectionQuestions = [];
  //
  //   sectionQuestions = await getQuestions({
  //     notionDatabaseId,
  //     tag: sectionInfo.tag,
  //     limit: parseInt(sectionLimit),
  //     multiQuestions: sectionInfo.multi
  //   })
  //
  //   //? xoá hiệu ứng loading
  //   const questionsDiv = document.querySelector('.questions')
  //   const questions = questionsDiv.closest('.questions')
  //   questions.classList.remove('placeholder')
  //   const right = questions.closest('.right')
  //   right.classList.remove('placeholder-glow')
  //   //? end xoá hiệu ứng loading
  //
  //   //! render
  //   renderQuestionsFuntions.initPaletteHTML(sectionInfo.section, sectionQuestions, count, sectionInfo.multi);
  //   renderQuestionsFuntions.initQuestionHTML(sectionInfo.section, sectionQuestions, count, queryObject.mode, sectionInfo.multi);
  //
  //   if (sectionInfo.multi)
  //     count += sectionQuestions.map(item => item.questions.length).reduce((a, b) => a + b, 0);
  //   else
  //     count += sectionQuestions.length;
  // };
  //
  // //! lấy questionContainer đầu tiên rồi hiển thị
  // const questionContainers = document.querySelectorAll(".question-container");
  // renderQuestionsFuntions.showQuestion(questionContainers[0].getAttribute("data-question-id"));
  //
  // //! logic chuyển câu hỏi
  // renderQuestionsFuntions.navigateQuestion();
  //
  // //! logic show hint
  // renderQuestionsFuntions.showHint();
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
  });