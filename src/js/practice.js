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

import * as renderQuestionsFunctions from "./helpers/renderQuestionsFunctionsPractice.js";
import { checkAuth } from './helpers/auth.js';
import { initEditor } from './helpers/medium-editor.js';
import Viewer from 'viewerjs';

// drag questions palette
const slider = document.querySelector('.question-palette__list');
let mouseDown = false;
let startX, scrollLeft;

if (slider) {
  const startDragging = (e) => {
    mouseDown = true;
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  }

  const stopDragging = (e) => {
    mouseDown = false;
  }

  const move = (e) => {
    e.preventDefault();
    if(!mouseDown) { return; }
    const x = e.pageX - slider.offsetLeft;
    const scroll = x - startX;
    slider.scrollLeft = scrollLeft - scroll;
  }
  // drag questions palette

  // Add the event listeners
  slider.addEventListener('mousemove', move, false);
  slider.addEventListener('mousedown', startDragging, false);
  slider.addEventListener('mouseup', stopDragging, false);
  slider.addEventListener('mouseleave', stopDragging, false);
}
// end drag questions palette

// toggle question palette
const btnTogglePalette = document.querySelector('.question-palette__label');
if (btnTogglePalette) {
  btnTogglePalette.addEventListener('click', () => {
    const paletteContent = document.querySelector('.question-palette');
    const questionLabel = document.querySelector('.question-palette__label');
    if (paletteContent.style.top === '0px' || !paletteContent.style.top) {
      paletteContent.style.top = `calc(${-paletteContent.offsetHeight + questionLabel.offsetHeight}px)`;
      questionLabel.querySelector('i').style.transform = 'rotate(180deg)';
    } else {
      paletteContent.style.top = '0';
      questionLabel.querySelector('i').style.transform = 'rotate(0deg)';
    }
  })
}
// end toggle question palette

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
    title.innerHTML = "Practice " + certificateInfo.properties.title.title[0]?.plain_text;
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

  const renderQuestions = async () => {
    for (let i = 0; i < sectionsInfo.length; i++) {
      const sectionInfo = sectionsInfo[i];
      // const sectionLimit = sectionInfo.number_questions;
      const sectionLimit = 5;
      let sectionQuestions = [];

      sectionQuestions = await getQuestions({
        notionDatabaseId,
        tag: sectionInfo.tag,
        limit: parseInt(sectionLimit),
        multiQuestions: sectionInfo.multi
      });

      //! render
      renderQuestionsFunctions.initPaletteHTML(sectionInfo.section, sectionQuestions, count, sectionInfo.multi);
      renderQuestionsFunctions.initQuestionHTML(sectionInfo.section, sectionQuestions, count, queryObject.mode, sectionInfo.multi);

      if (sectionInfo.multi)
        count += sectionQuestions.map(item => item.questions.length).reduce((a, b) => a + b, 0);
      else
        count += sectionQuestions.length;
    }
  }

  await renderQuestions()

  let rendering = false
  window.addEventListener('scroll', async() => {
    if (document.documentElement.scrollTop + document.documentElement.clientHeight + 1500 >= document.documentElement.scrollHeight && !rendering) {
      rendering = true
      await renderQuestions()
      rendering = false
    }
  })

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