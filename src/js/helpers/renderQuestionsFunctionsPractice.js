import config from "../config";
import { initLogQuestion, commitLogQuestion, commitResult } from "./genLog";

export const initPaletteHTML = (sectionTitle, sectionQuestions, count = 0, multi) => {
  //! tạo palette chứa các câu hỏi
  const questionPaletteList = document.querySelector('.question-palette__list')

  const sectionQuestionsFlat = [];
  sectionQuestions.forEach((setQuestions) => {
    if (typeof setQuestions === "object" && setQuestions.questions)
      sectionQuestionsFlat.push(...setQuestions.questions);
    else sectionQuestionsFlat.push(setQuestions);
  });
  sectionQuestionsFlat.flat();
  sectionQuestionsFlat.forEach((question, index) => {
    const questionPaletteItem = document.createElement('div')
    questionPaletteItem.classList.add("question-palette__item", "btn-select-question", "question-palette__item--empty")
    questionPaletteItem.setAttribute('btn-data-question-id', question._id);
    questionPaletteItem.innerHTML = index + 1 + count;
    questionPaletteList.appendChild(questionPaletteItem);

    questionPaletteItem.addEventListener('click', () => {
      const questionId = questionPaletteItem.getAttribute('btn-data-question-id');
      const questionContainer = document.querySelector(`.question-main[data-question-id="${questionId}"]`);
      if (questionContainer) {
        questionContainer.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center'
        });
      }
    });
  });
  //! end tạo palette chứa các câu hỏi
}

const renderComment = () => {
  document.querySelector('.question-main__comments')?.classList.toggle('active')
}

const renderSingleQuestion = (index, question, mode) => {
  const questionContainer = document.createElement('div')
  questionContainer.classList.add('question-container', 'mb-4')
  questionContainer.setAttribute('data-question-id', question._id)

  //! tạo div audio
  if (question.properties.audio.rich_text[0]?.plain_text) {
    const questionContainerAudio = document.createElement('div')
    questionContainerAudio.classList.add('question-container__audio')
    questionContainerAudio.innerHTML = `
      <audio controls>
        <source src="${config.mediaUrl + question.properties.audio.rich_text[0]?.plain_text}" type="audio/mpeg">
        Your browser does not support the audio element.
      </audio>
    `
    questionContainer.appendChild(questionContainerAudio)
  }
  //!end tạo div audio
  
  const questionMain = document.createElement('div')
  questionMain.classList.add('question-main')
  questionMain.setAttribute('data-question-id', question._id)
  questionMain.setAttribute('data-question-index', index)
  if (question.properties.hint.rich_text?.length > 0 && question.properties.hint.rich_text[0].plain_text.length > 0 && question.properties.hint.rich_text[0].plain_text.split(' ').join('') !== '') {
    questionMain.setAttribute('data-question-hint', question.properties.hint.rich_text[0].plain_text)
  } else {
    questionMain.setAttribute('data-question-hint', 'Sorry, no hint for this question')
  }

  //! tạo button hint
  const questionHint = document.createElement('div')
  questionHint.classList.add('question-hint', 'btn', 'btn-primary', 'btn-hint')
  if (!(mode === "practice")) {
    questionHint.classList.add('d-none');
  };
  questionHint.setAttribute('data-bs-toggle', 'modal')
  questionHint.setAttribute('data-bs-target', '#hint-modal')
  questionHint.innerHTML = `<i class="fa-solid fa-lightbulb"></i> Key`
  questionMain.appendChild(questionHint)
  //! end tạo button hint

  //! tạo div content
  const questionMainContent = document.createElement('div')
  questionMainContent.classList.add('question-main__content')
  questionMainContent.innerHTML = `
    <h6 class="question-main__title editor">
      <strong>Question ${index}:</strong> ${question.properties.question.rich_text[0].plain_text}
    </h6>
    <div class="question-main__img">
      <img src="${config.mediaUrl + question.properties.img.rich_text[0]?.plain_text}" alt="">
    </div>
  `
  questionMain.appendChild(questionMainContent)
  //! end tạo div content

  //! tạo div options
  const questionMainOptions = document.createElement('div')
  questionMainOptions.classList.add('question-main__options', 'editor')
  questionMainOptions.setAttribute('data-question-id', question._id)
  questionMainOptions.setAttribute('data-correct-option', question.properties.correct.rich_text[0].plain_text)
  let optionsHtml = [];
  for (const key in question.properties) {
    if (/^[a-zA-Z]$/.test(key) && question.properties[key].rich_text?.length > 0) {
      optionsHtml.push(`
      <div class="question-main__option" data-option-id="${key}">
        <label for="${question._id + '_' + key}">
          <input type="radio" name="${question._id}" id="${question._id + '_' + key}" value="${key}">
          ${question.properties[key].rich_text[0].plain_text}
        </label>
      </div>
      `)
    }
  }
  optionsHtml.sort();
  questionMainOptions.innerHTML = optionsHtml.join('')
  questionMain.appendChild(questionMainOptions)

  //! tao div actions
  const questionMainActions = document.createElement('div')
  questionMainActions.classList.add('question-main__actions', 'row')
  questionMainActions.innerHTML = `
    <div class="col-6">
      <button
        class="btn-comment"
      >
        <span class="IconContainer">
          <svg fill="white" viewBox="0 0 512 512" height="1em">
            <path
              d="M123.6 391.3c12.9-9.4 29.6-11.8 44.6-6.4c26.5 9.6 56.2 15.1 87.8 15.1c124.7 0 208-80.5 208-160s-83.3-160-208-160S48 160.5 48 240c0 32 12.4 62.8 35.7 89.2c8.6 9.7 12.8 22.5 11.8 35.5c-1.4 18.1-5.7 34.7-11.3 49.4c17-7.9 31.1-16.7 39.4-22.7zM21.2 431.9c1.8-2.7 3.5-5.4 5.1-8.1c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208s-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6c-15.1 6.6-32.3 12.6-50.1 16.1c-.8 .2-1.6 .3-2.4 .5c-4.4 .8-8.7 1.5-13.2 1.9c-.2 0-.5 .1-.7 .1c-5.1 .5-10.2 .8-15.3 .8c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4c4.1-4.2 7.8-8.7 11.3-13.5c1.7-2.3 3.3-4.6 4.8-6.9c.1-.2 .2-.3 .3-.5z"
            ></path>
          </svg>
        </span>
        <p class="text m-0">
          Comments
          <span class="btn-comment__count">(5)</span>
        </p>
      </button>
    </div>
    <div class="col-6 text-end">
      <button class="btn btn-mastered">Mastered</button>
      <button class="btn btn-not-sure">Not sure</button>
    </div>
  `
  const commentBtn = questionMainActions.querySelector('.btn-comment')
  commentBtn.addEventListener('click', renderComment)
  questionMain.appendChild(questionMainActions)
  //! end tao div actions

  //* logic chọn đáp án & lưu lại process
  const inputs = questionMainOptions.querySelectorAll("input");
  inputs.forEach((input) => {
    input.addEventListener("change", () => {

      const questionPaletteItem = document.querySelector(`.question-palette__item[btn-data-question-id="${question._id}"]`);
      let check = false;
      for (const input of inputs) {
        if (input.checked) {
          input.closest(".question-main__option").classList.add("question-main__option--selected");
          questionPaletteItem.classList.add("question-palette__item--selected");
          check = true;
        }
        else
        {
          input.closest(".question-main__option").classList.remove("question-main__option--selected");
        }
      }
      if (!check) {
        questionPaletteItem.classList.remove("question-palette__item--selected");
      }
    });
  });
  //* end logic chọn đáp án
  questionContainer.appendChild(questionMain)
  //! end tạo div options

  return questionContainer
}

const renderMultiQuestions = (count = 0, questions, mode) => {
  const questionContainer = document.createElement('div')
  questionContainer.classList.add('question-container', 'mb-4')
  let questionIds = [];
  let questionIndex = [];
  //! tạo div audio
  if (questions[0].properties.audio.rich_text[0]?.plain_text) {
    const questionContainerAudio = document.createElement('div')
    questionContainerAudio.classList.add('question-container__audio')
    questionContainerAudio.innerHTML = `
      <audio controls>
        <source src="${config.mediaUrl + questions[0].properties.audio.rich_text[0]?.plain_text}" type="audio/mpeg">
        Your browser does not support the audio element.
      </audio>
    `
    questionContainer.appendChild(questionContainerAudio)
  }
  //!end tạo div audio

  //! tạo div question context
  if (questions[0].properties.context.rich_text?.length > 0) {
    // console.log(questions[0].properties.context.rich_text[0].plain_text)
    // questions[0].properties.context.rich_text[0].plain_text = questions[0].properties.context.rich_text[0].plain_text.replaceAll("src='", "src='" + config.mediaUrl)
    const context = questions[0].properties.context.rich_text[0].plain_text.replaceAll("src='", "src='" + config.mediaUrl)
    const questionContainerContext = document.createElement('div')
    questionContainerContext.classList.add('question-container__context')
    questionContainerContext.innerHTML = `
      <div class="question-container__context-content editor">
        ${context}
      </div>
    `
    questionContainer.appendChild(questionContainerContext)
  }
  //! end tạo div question context

  const questionMainContainer = document.createElement('div')
  questionMainContainer.classList.add('question-main-container')
  questions.forEach((question) => {
    count += 1;
    const questionMain = document.createElement('div')
    questionMain.classList.add('question-main', 'mb-4')
    questionMain.setAttribute('data-question-id', question._id)
    questionMain.setAttribute('data-question-index', count)
    questionIndex.push(count);
    questionIds.push(question._id);

    if (question.properties.hint.rich_text?.length > 0 && question.properties.hint.rich_text[0].plain_text.length > 0 && question.properties.hint.rich_text[0].plain_text.split(' ').join('') !== '') {
      questionMain.setAttribute('data-question-hint', question.properties.hint.rich_text[0].plain_text)
    } else {
      questionMain.setAttribute('data-question-hint', 'Sorry, no hint for this question')
    }

    //! tạo button hint
    const questionHint = document.createElement('div')
    questionHint.classList.add('question-hint', 'btn', 'btn-primary', 'btn-hint')
    if (!(mode === "practice")) {
      questionHint.classList.add('d-none');
    };
    questionHint.setAttribute('data-bs-toggle', 'modal')
    questionHint.setAttribute('data-bs-target', '#hint-modal')
    questionHint.innerHTML = `<i class="fa-solid fa-lightbulb"></i> Key`
    questionMain.appendChild(questionHint)
    //! end tạo button hint
  
    //! tạo div content
    const questionMainContent = document.createElement('div')
    questionMainContent.classList.add('question-main__content')
    questionMainContent.innerHTML = `
      <h6 class="question-main__title editor">
        <strong>Question ${count}:</strong> ${question.properties.question.rich_text[0].plain_text}
      </h6>
      <div class="question-main__img">
        <img src="${config.mediaUrl + question.properties.img.rich_text[0]?.plain_text}" alt="">
      </div>
    `
    questionMain.appendChild(questionMainContent)
    //! end tạo div content
  
    //! tạo div options
    const questionMainOptions = document.createElement('div')
    questionMainOptions.classList.add('question-main__options', 'editor');
    questionMainOptions.setAttribute('data-question-id', question._id)
    questionMainOptions.setAttribute('data-correct-option', question.properties.correct.rich_text[0].plain_text)
    let optionsHtml = [];
    for (const key in question.properties) {
      if (/^[a-zA-Z]$/.test(key) && question.properties[key].rich_text?.length > 0) {
        optionsHtml.push(`
        <div class="question-main__option" data-option-id="${key}">
          <label for="${question._id + '_' + key}">
            <input type="radio" name="${question._id}" id="${question._id + '_' + key}" value="${key}">
            ${question.properties[key].rich_text[0].plain_text}
          </label>
        </div>
        `)
      }
    }
    optionsHtml.sort();
    questionMainOptions.innerHTML = optionsHtml.join('')
    questionMain.appendChild(questionMainOptions)

    //! tao div actions
    const questionMainActions = document.createElement('div')
    questionMainActions.classList.add('question-main__actions', 'row')
    questionMainActions.innerHTML = `
      <div class="col-6">
        <button
          class="btn-comment"
        >
          <span class="IconContainer">
            <svg fill="white" viewBox="0 0 512 512" height="1em">
              <path
                d="M123.6 391.3c12.9-9.4 29.6-11.8 44.6-6.4c26.5 9.6 56.2 15.1 87.8 15.1c124.7 0 208-80.5 208-160s-83.3-160-208-160S48 160.5 48 240c0 32 12.4 62.8 35.7 89.2c8.6 9.7 12.8 22.5 11.8 35.5c-1.4 18.1-5.7 34.7-11.3 49.4c17-7.9 31.1-16.7 39.4-22.7zM21.2 431.9c1.8-2.7 3.5-5.4 5.1-8.1c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208s-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6c-15.1 6.6-32.3 12.6-50.1 16.1c-.8 .2-1.6 .3-2.4 .5c-4.4 .8-8.7 1.5-13.2 1.9c-.2 0-.5 .1-.7 .1c-5.1 .5-10.2 .8-15.3 .8c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4c4.1-4.2 7.8-8.7 11.3-13.5c1.7-2.3 3.3-4.6 4.8-6.9c.1-.2 .2-.3 .3-.5z"
              ></path>
            </svg>
          </span>
          <p class="text m-0">
            Comments
            <span class="btn-comment__count">(5)</span>
          </p>
        </button>
      </div>
      <div class="col-6 text-end">
        <button class="btn btn-mastered">Mastered</button>
        <button class="btn btn-not-sure">Not sure</button>
      </div>
    `
    const commentBtn = questionMainActions.querySelector('.btn-comment')
    commentBtn.addEventListener('click', renderComment)
    questionMain.appendChild(questionMainActions)

    //* logic chọn đáp án & lưu lại process
    const inputs = questionMainOptions.querySelectorAll("input");
    inputs.forEach((input) => {
      input.addEventListener("change", () => {

        const questionPaletteItem = document.querySelector(`.question-palette__item[btn-data-question-id="${question._id}"]`);
        let check = false;

        for (const input of inputs) {
          if (input.checked) {
            check = true;
            input.closest(".question-main__option").classList.add("question-main__option--selected");
            questionPaletteItem.classList.add("question-palette__item--selected");
          }
          else
          {
            input.closest(".question-main__option").classList.remove("question-main__option--selected");
          }
        }
        if (!check) {
          questionPaletteItem.classList.remove("question-palette__item--selected");
        }
      });
    });
    //* end logic chọn đáp án
    

    questionMainContainer.appendChild(questionMain)
    //! end tạo div options
  });

  //! chú thích các câu hỏi có trong set
  const questionContainerNote = document.createElement('div')
  questionContainerNote.classList.add('question-container__note')
  if (questionIndex.length > 1) {
    questionContainerNote.innerHTML = `
      <p>Questions ${questionIndex[0] + " to " + questionIndex[questionIndex.length - 1]}</p>
    `
  }
  questionContainer.appendChild(questionContainerNote)
  //! end chú thích các câu hỏi có trong set

  questionContainer.appendChild(questionMainContainer)
  questionContainer.setAttribute('data-question-id', questionIds.join(','))

  return questionContainer
}

//! navigation question
export const navigateQuestion = () => {
  const btnNav = document.querySelector('.questions__navigation')
  if (btnNav) {
    const btnPrev = btnNav.querySelector('.prev')
    const btnNext = btnNav.querySelector('.next')
    btnPrev.addEventListener('click', () => {
      const currentQuestion = document.querySelector('.question-container.show').querySelector('.question-main.show')
      const currentQuestionIndex = currentQuestion.getAttribute('data-question-index')
      const preQuestionIndex = parseInt(currentQuestionIndex) - 1
      const preQuestionId = document.querySelector(`.question-main[data-question-index="${preQuestionIndex}"]`)?.getAttribute('data-question-id')
      if (preQuestionId) {
        showQuestion(preQuestionId)
      }
    })
    btnNext.addEventListener('click', () => {
      const currentQuestion = document.querySelector('.question-container.show').querySelector('.question-main.show')
      const currentQuestionIndex = currentQuestion.getAttribute('data-question-index')
      const nextQuestionIndex = parseInt(currentQuestionIndex) + 1
      const nextQuestionId = document.querySelector(`.question-main[data-question-index="${nextQuestionIndex}"]`)?.getAttribute('data-question-id')
      if (nextQuestionId) {
        showQuestion(nextQuestionId)
      }
    })

    const btnFlag = btnNav.querySelector('.flag');
    btnFlag.addEventListener('click', () => {
      const currentQuestion = document.querySelector('.question-container.show').querySelector('.question-main.show')
      const currentQuestionId = currentQuestion.getAttribute('data-question-id')
      const questionPaletteItem = document.querySelector(`.question-palette__item[btn-data-question-id="${currentQuestionId}"]`);
      questionPaletteItem.classList.toggle('question-palette__item--flagged')
    })

    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        btnPrev.click();
      } else if (e.key === "ArrowRight") {
        btnNext.click();
      }
    })
  }
}
//! end navigation question

//! show hint
export const showHint = () => {
  const btnsShowHint = document.querySelectorAll('.btn-hint')
  if (btnsShowHint && btnsShowHint.length > 0)
  {
    btnsShowHint.forEach((btn) => {
      btn.addEventListener('click', () => {
        const hint = btn.closest('.question-main').getAttribute('data-question-hint')
        const hintModalContent = document.querySelector('.content-hint')
        hintModalContent.innerHTML = hint
      })
    })
  }
}
//! end show hint

export const initQuestionHTML = (sectionTitle, sectionQuestions, count = 0, mode, multi) => {
  const questionsDiv = document.querySelector('.questions')
  const questionsNavigation = document.querySelector('.questions__navigation')

  //! render câu hỏi
  if (multi) {
    sectionQuestions.forEach((setQuestions) => {
      questionsDiv.insertBefore(renderMultiQuestions(count, setQuestions.questions, mode), questionsNavigation)
      count += setQuestions.questions.length;
    });
  } else {
    sectionQuestions.forEach((question, index) => {
      count += 1;
      questionsDiv.insertBefore(renderSingleQuestion(count, question, mode), questionsNavigation)
    });
  }
  //!end render câu hỏi
}

//! logic form
export const initFormLogic = (max_score = 100) => {
  const testForm = document.querySelector("#test-form");
  if (testForm)
  {
    testForm.addEventListener("submit", (e) => {
      e.preventDefault();

      //! cancel submit btn
      const submitBtn = document.querySelector("#submit-btn");
      submitBtn.type = "button";
      //!end cancel submit btn

      const optionsContainers = testForm.querySelectorAll(".question-main__options");

      const inputs = testForm.querySelectorAll("input");
      inputs.forEach((input) => {
        input.disabled = true;
      });

      optionsContainers.forEach(item => {
        const selectedOptions = item.querySelectorAll("input:checked");
        const correctOptionsIds = item.getAttribute("data-correct-option").split(",");

        selectedOptions.forEach((selectedOption) => {
          const selectedOptionId = selectedOption.closest(".question-main__option").getAttribute("data-option-id");
          
          if (!correctOptionsIds.includes(selectedOptionId)) {
            selectedOption.closest(".question-main__option").classList.add("question-main__option--incorrect");
            document.querySelector(".question-palette__item[btn-data-question-id='" + item.getAttribute("data-question-id") + "']").classList.add("question-palette__item--incorrect");
            item.closest(".question-main").setAttribute("data-question-status", "incorrect");
          } else {
            selectedOption.closest(".question-main__option").classList.add("question-main__option--correct");
            document.querySelector(".question-palette__item[btn-data-question-id='" + item.getAttribute("data-question-id") + "']").classList.add("question-palette__item--correct");
            item.closest(".question-main").setAttribute("data-question-status", "correct");
          }
        });

        correctOptionsIds.forEach((correctOptionId) => {
          const correctOption = item.querySelector(`.question-main__option[data-option-id="${correctOptionId}"]`);
          correctOption.classList.add("question-main__option--correct");

          if (!selectedOptions.length || selectedOptions.length != correctOptionsIds.length) {
            document.querySelector(".question-palette__item[btn-data-question-id='" + item.getAttribute("data-question-id") + "']").classList.add("question-palette__item--incorrect");
            item.closest(".question-main").setAttribute("data-question-status", "incorrect");
          }
        });
      });

      //! dừng đồng hồ
      const currentTimer = document.querySelector(".timer__time");
      if (currentTimer)
      {
        const currentTimerValue = currentTimer.innerHTML;
        currentTimer.classList.add("timer__time--red");
        clearInterval(window.timer);
        currentTimer.innerHTML = currentTimerValue;
      }
      //! end dừng đồng hồ

      //! hiển thị nút hint
      const btnsHint = document.querySelectorAll('.btn-hint')
      btnsHint.forEach((btn) => {
        btn.classList.remove('d-none')
      })
      //! end hiển thị nút hint

      //! hiển thị modal result
      //? lấy score pattern
      const searchParams = new URLSearchParams(window.location.search);
      const mode = searchParams.get("mode");
      const resultModal = document.querySelector('#result-modal')
      const questions = document.querySelectorAll(".question-main");
      const totalQuestions = questions.length;
      const correctQuestions = document.querySelectorAll(".question-main[data-question-status='correct']");
      const max_score = parseInt(window.certificateInfo.properties.max_score.rich_text[0]?.plain_text) ? parseInt(window.certificateInfo.properties.max_score.rich_text[0]?.plain_text) : 100;

      if (mode && mode == "fullTest") {
        let score = 0;
        if (window.certificateInfo.properties.scoring_pattern.rich_text[0]?.plain_text) {
          const scorePattern = JSON.parse(window.certificateInfo.properties.scoring_pattern.rich_text[0]?.plain_text);
          const result = {};
    
          correctQuestions.forEach((question) => {
            const id = question.getAttribute('data-question-id');
            const sectionTitle = document.querySelector(`.question-palette__item[btn-data-question-id="${id}"]`).closest('.question-palette__section').querySelector('.question-palette__title').textContent;
    
            for (const key in scorePattern) {
              if (key.includes(sectionTitle)) {
                if (!result[key]) {
                  result[key] = 0;
                }
                result[key] += 1;
              }
            }
          });
    
          for (const key in result) {
            score += (scorePattern[key][result[key]]);
          }
        } else score = (correctQuestions.length / totalQuestions) * max_score;
        
        const scoreText = document.querySelector('.score-text');
        scoreText.textContent = `Your Score ${correctQuestions.length} out of ${questions.length}`
  
        const circularProgress = resultModal.querySelector('.circular-progress');
        const progressValue = resultModal.querySelector('.progress-value');
        progressValue.textContent = `${score.toFixed(0)}`;
        circularProgress.style.background = `conic-gradient(#a5d7e8 ${(score / max_score) * 360}deg, rgba(255, 255, 255, .1) 0deg)`;
  
      } else {
        const scoreText = document.querySelector('.score-text');
        scoreText.textContent = `Your Score ${correctQuestions.length} out of ${questions.length}`
  
        const circularProgress = resultModal.querySelector('.circular-progress');
        const progressValue = resultModal.querySelector('.progress-value');
        let progressStartValue = 0;
        let progressEndValue = (correctQuestions.length / totalQuestions) * 100;
  
        let progress = setInterval(() => {
          if (progressStartValue < 100 && progressEndValue < 100 && progressStartValue < progressEndValue) {
            progressStartValue += 0.2;
            progressValue.textContent = `${progressStartValue.toFixed(1)} %`;
            circularProgress.style.background = `conic-gradient(#a5d7e8 ${progressStartValue * 3.6}deg, rgba(255, 255, 255, .1) 0deg)`;
            if (progressStartValue == progressEndValue) {
              clearInterval(progress);
            }
          } else {
            progressStartValue = progressEndValue = 100;
            clearInterval(progress);
          }
        }, 1);
      }

      //! end hiển thị modal result

      //! ghi lại kết quả test
      const correctIds = Array.from(document.querySelectorAll(".question-main[data-question-status='correct']")).map(question => {
        return question.getAttribute('data-question-id')
      })
      const incorrectIds = Array.from(document.querySelectorAll(".question-main[data-question-status='incorrect']")).map(question => {
        return question.getAttribute('data-question-id')
      })
      commitResult({
        certificateId: window.certificateInfo.id,
        correctIds: correctIds,
        incorrectIds: incorrectIds,
        duration: localStorage.getItem("testProcess") ? JSON.parse(localStorage.getItem("testProcess")).timeTaken : 0,
        mode: mode
      })
      //! end ghi lại kết quả test

      //! xoa testProcess
      localStorage.removeItem("testProcess");
      //! end xoa testProcess
    })
  }
}
//! end logic form