import config from "../config";
import { initLogQuestion, commitLogQuestion, commitResult } from "./genLog";

//! show question func
export const showQuestion = (questionId) => {
  const questionShowing = document.querySelector(".question-container.show"); //? lấy câu hỏi đang hiển thị
  const questionShowingIds = questionShowing?.getAttribute("data-question-id").split(','); //? lấy id câu hỏi đang hiển thị

  const questionShowingMain = questionShowing?.querySelector(".question-main.show");
  if (questionShowingMain) {
    //! lưu log câu hỏi cũ
    const selectedOptions = questionShowingMain.querySelectorAll("input:checked");
    const correctOptionsIds = questionShowingMain.querySelector(".question-main__options").getAttribute("data-correct-option").split(",");
    if (selectedOptions.length) {
      let answer = [];
      let check = true;
      selectedOptions.forEach((selectedOption) => {
        const selectedOptionId = selectedOption.closest(".question-main__option").getAttribute("data-option-id");
        answer.push(selectedOptionId);
        if (!correctOptionsIds.includes(selectedOptionId)) {
          check = false;
        }
      });
      commitLogQuestion({
        answer: answer,
        status: check ? "correct" : "incorrect"
      });
    } else {
      commitLogQuestion({
        answer: null,
        status: "unanswered"
      }); 
    }
  }

  if (questionShowingIds) { //? nếu id câu hỏi chuyển đến khác id câu hỏi đang hiển thị
    questionShowing.classList.remove("show"); //? ẩn câu hỏi đang hiển thị

    if (!questionShowingIds.includes(questionId)) {
      //! dừng audio
      const questionShowingAudio = questionShowing.querySelector('.question-container__audio audio')
      if (questionShowingAudio) {
        questionShowingAudio.pause()
      }
      //! end dừng audio
    }

    const questionTarget = document.querySelector(`.question-main[data-question-id="${questionId}"]`).closest(".question-container");
    if (questionTarget) {
      questionTarget.classList.add("show"); //? hiển thị câu hỏi chuyển đến
      const questionMainsTarget = questionTarget.querySelectorAll(`.question-main`);
      Array.from(questionMainsTarget).forEach((questionMainTarget) => {
        if (!(questionMainTarget.getAttribute("data-question-id") === questionId)) {
          questionMainTarget.classList.remove("show");
        } else {
          questionMainTarget.classList.add("show");
          //! khởi tạo log câu hỏi mới
          initLogQuestion({questionId});
        }
      });
    }

    questionShowingIds.forEach((questionShowingId) => {
      const btnShowing = document.querySelector(`.btn-select-question[btn-data-question-id="${questionShowingId}"]`);
      btnShowing?.classList.remove("question-palette__item--active"); //? chuyển btn sang trạng thái không chọn
    });

    const questionTargetIds = questionTarget.getAttribute("data-question-id").split(',');
    questionTargetIds.forEach((questionTargetId) => {
      const btnTarget = document.querySelector(`.btn-select-question[btn-data-question-id="${questionTargetId}"]`);
      btnTarget?.classList.add("question-palette__item--active"); //? chuyển btn sang trạng thái chọn
    });
  } else if (!questionShowingIds) {
    const questionTarget = document.querySelector(`.question-container[data-question-id="${questionId}"]`);
    if (questionTarget) {
      questionTarget.classList.add("show"); //? hiển thị câu hỏi chuyển đến
      questionTarget.querySelector(".question-main").classList.add("show");
      //! khởi tạo log câu hỏi mới
      initLogQuestion({questionId: questionTarget.querySelector(".question-main").getAttribute("data-question-id")});

      const questionTargetIds = questionTarget.getAttribute("data-question-id").split(',');
      questionTargetIds.forEach((questionTargetId) => {
        const btnTarget = document.querySelector(`.btn-select-question[btn-data-question-id="${questionTargetId}"]`);
        btnTarget?.classList.add("question-palette__item--active"); //? chuyển btn sang trạng thái chọn
      });
    }
  }
}
//! end show question func

export const initPaletteHTML = (sectionTitle, sectionQuestions, count = 0) => {
  //! tạo palette chứa các câu hỏi
  //? xoá hiệu ứng loading
  const questionPaletteContent = document.querySelector('.question-palette__content')
  const questionPalette = questionPaletteContent.closest('.question-palette')
  questionPalette.classList.remove('placeholder-glow')
  questionPaletteContent.classList.remove('placeholder')
  //?end xoá hiệu ứng loading

  const questionPaletteTitle = document.createElement('h5')
  questionPaletteTitle.classList.add('question-palette__title')
  questionPaletteTitle.innerHTML = sectionTitle.replace("-multi", "");
  questionPaletteContent.appendChild(questionPaletteTitle)

  const questionPaletteList = document.createElement('div')
  questionPaletteList.classList.add('question-palette__list')
  questionPaletteContent.appendChild(questionPaletteList)

  if (sectionTitle.includes("multi")) {
    const sectionQuestionsFlat = [];
    sectionQuestions.forEach((setQuestions) => {
      sectionQuestionsFlat.push(...setQuestions.questions);
    });
    sectionQuestionsFlat.flat();
    sectionQuestionsFlat.forEach((question, index) => {
      const questionPaletteItem = document.createElement('div')
      questionPaletteItem.classList.add("question-palette__item", "btn-select-question", "question-palette__item--empty")
      questionPaletteItem.setAttribute('btn-data-question-id', question._id)
      questionPaletteItem.innerHTML = index + 1 + count;
      questionPaletteList.appendChild(questionPaletteItem)

      //! logic chọn câu hỏi
      questionPaletteItem.addEventListener("click", () => {
        const questionId = questionPaletteItem.getAttribute("btn-data-question-id"); //? lấy id câu hỏi cần chuyển đến
        showQuestion(questionId); //? chuyển đến câu hỏi
      });
    });
  } else {
    sectionQuestions.forEach((question, index) => {
      const questionPaletteItem = document.createElement('div')
      questionPaletteItem.classList.add("question-palette__item", "btn-select-question", "question-palette__item--empty")
      questionPaletteItem.setAttribute('btn-data-question-id', question._id)
      questionPaletteItem.innerHTML = index + 1 + count;
      questionPaletteList.appendChild(questionPaletteItem)

      //! logic chọn câu hỏi
      questionPaletteItem.addEventListener("click", () => {
        const questionId = questionPaletteItem.getAttribute("btn-data-question-id"); //? lấy id câu hỏi cần chuyển đến
        showQuestion(questionId); //? chuyển đến câu hỏi
      });
    });
  }
  //! end tạo palette chứa các câu hỏi
}

const renderSingleQuestion = (index, question) => {
  const questionContainer = document.createElement('div')
  questionContainer.classList.add('question-container')
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
  questionHint.setAttribute('data-bs-toggle', 'modal')
  questionHint.setAttribute('data-bs-target', '#hint-modal')
  questionHint.innerHTML = `<i class="fa-solid fa-lightbulb"></i> Hint`
  questionMain.appendChild(questionHint)
  //! end tạo button hint


  //! tạo div content
  const questionMainContent = document.createElement('div')
  questionMainContent.classList.add('question-main__content')
  questionMainContent.innerHTML = `
    <h6 class="question-main__title">
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
  questionMainOptions.classList.add('question-main__options')
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

  //* logic chọn đáp án
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
  questionMain.appendChild(questionMainOptions)
  questionContainer.appendChild(questionMain)
  //! end tạo div options

  return questionContainer
}

const renderMultiQuestions = (count = 0, questions) => {
  const questionContainer = document.createElement('div')
  questionContainer.classList.add('question-container')
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
    questions[0].properties.context.rich_text[0].plain_text = questions[0].properties.context.rich_text[0].plain_text.replaceAll("src='", "src='" + config.mediaUrl)
    const questionContainerContext = document.createElement('div')
    questionContainerContext.classList.add('question-container__context')
    questionContainerContext.innerHTML = `
      <div class="question-container__context-content">
        ${questions[0].properties.context.rich_text[0].plain_text}
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
    questionMain.classList.add('question-main')
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
    questionHint.setAttribute('data-bs-toggle', 'modal')
    questionHint.setAttribute('data-bs-target', '#hint-modal')
    questionHint.innerHTML = `<i class="fa-solid fa-lightbulb"></i> Hint`
    questionMain.appendChild(questionHint)
    //! end tạo button hint
  
    //! tạo div content
    const questionMainContent = document.createElement('div')
    questionMainContent.classList.add('question-main__content')
    questionMainContent.innerHTML = `
      <h6 class="question-main__title">
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
    questionMainOptions.classList.add('question-main__options')
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

    //* logic chọn đáp án
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
    
    questionMain.appendChild(questionMainOptions)
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

export const initQuestionHTML = (sectionTitle, sectionQuestions, count = 0) => {
  const questionsDiv = document.querySelector('.questions')
  const questionsNavigation = document.querySelector('.questions__navigation')

  //! render câu hỏi
  if (sectionTitle.includes("multi")) {
    sectionQuestions.forEach((setQuestions) => {
      questionsDiv.insertBefore(renderMultiQuestions(count, setQuestions.questions), questionsNavigation)
      count += setQuestions.questions.length;
    });
  } else {
    sectionQuestions.forEach((question, index) => {
      count += 1;
      questionsDiv.insertBefore(renderSingleQuestion(count, question), questionsNavigation)
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

      const optionsContainers = testForm.querySelectorAll(".question-main__options")

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

      //! hiển thị modal result
      const resultModal = document.querySelector('#result-modal')
      const questions = document.querySelectorAll(".question-main");
      const totalQuestions = questions.length;
      const correctQuestions = document.querySelectorAll(".question-main[data-question-status='correct']").length;
      const incorrectQuestions = document.querySelectorAll(".question-main[data-question-status='incorrect']").length;
      const score = Math.round((correctQuestions / totalQuestions));

      const scoreText = document.querySelector('.score-text');
      scoreText.textContent = `Your Score ${correctQuestions} out of ${questions.length}`

      const circularProgress = resultModal.querySelector('.circular-progress');
      const progressValue = resultModal.querySelector('.progress-value');
      let progressStartValue = 0;
      let progressEndValue = (correctQuestions / totalQuestions) * 100;

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
        duration: (new Date() - new Date(window.timeIn)) / 1000
      })
      //! end ghi lại kết quả test
    })
  }
}
//! end logic form