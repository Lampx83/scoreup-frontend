let questionsId = []
const results = {
  correct: 0,
  incorrect: 0,
  point: 0,
  total: 0,
  percent: 0,
}

//!query questions từ database và in ra html
import {getDatabase} from './databaseAPI.js'
const body = {
  "sorts": [
    {
        "property": "title",
        "direction": "ascending"
    }
  ]
}
const config = {
  params: {
    limit: 10
  }
}
getDatabase('5e4fc93093714be99b5d41edc31bbc1a', body)
  .then((response) => {
    const timer__time = document.querySelector(".timer__time");
    initTimerCount(timer__time);
    let newResponse = response.map((item) => {
      // const questionId = item.id;
      // questionsId.push(questionId)
      const newItem = {}
      newItem.id = item.id
      newItem.data = item.properties
      return newItem
    })
    newResponse = getRandomQuestions(newResponse, 10)
    newResponse.forEach((item) => {
      const questionId = item.id;
      questionsId.push(questionId)
    })
    results.total = questionsId.length
    return newResponse
  })
  .then((data) => {
    //! tạo btn chọn câu hỏi bên trái
    const questionPaletteList = document.querySelector('.question-palette__list')
    //? xoá hiệu ứng loading
    const questionPalette = questionPaletteList.closest('.question-palette')
    questionPalette.classList.remove('placeholder-glow')
    const questionPaletteContent = questionPalette.querySelector('.question-palette__content')
    questionPaletteContent.classList.remove('placeholder')
    //?end xoá hiệu ứng loading

    questionsId.forEach((id, index) => {
      const item = document.createElement('div')
      item.classList.add("question-palette__item", "btn-select-question", "question-palette__item--empty")
      item.setAttribute('btn-data-question-id', id)
      item.innerHTML = index + 1

      questionPaletteList.appendChild(item)
    })
    //! end tạo btn chọn câu hỏi bên trái
    data.forEach((item, index) => {

      const questionsDiv = document.querySelector('.questions')

      //? xoá hiệu ứng loading
      const questions = questionsDiv.closest('.questions')
      questions.classList.remove('placeholder')
      const right = questions.closest('.right')
      right.classList.remove('placeholder-glow')
      //? end xoá hiệu ứng loading

      const questionsNavigation = document.querySelector('.questions__navigation')

      const questionContainer = document.createElement('div')
      questionContainer.classList.add('question-container')
      questionContainer.setAttribute('data-question-id', item.id)
      questionContainer.setAttribute('data-question-index', index)

      const questionMain = document.createElement('div')
      questionMain.classList.add('question-main')

      //! tạo div audio
      const questionMainAudio = document.createElement('div')
      questionMainAudio.classList.add('question-main__audio')
      questionMainAudio.innerHTML = `
      <audio controls>
        <source src="${item.data.audio.files[0]?.file.url}" type="audio/mpeg">
      </audio>
      `
      questionMain.appendChild(questionMainAudio)
      //!end tạo div audio

      //! tạo div content
      const questionMainContent = document.createElement('div')
      questionMainContent.classList.add('question-main__content')
      questionMainContent.innerHTML = `
        <h6 class="question-main__title">
          Question ${index + 1}: ${item.data.question.rich_text[0].plain_text}
        </h6>
        <div class="question-main__img">
          <img src="${item.data.img.files[0]?.file.url}" alt="">
        </div>
      `
      questionMain.appendChild(questionMainContent)
      //! end tạo div content

      //! tạo div options
      const questionMainOptions = document.createElement('div')
      questionMainOptions.classList.add('question-main__options')
      questionMainOptions.setAttribute('data-correct-option', item.data.correct.rich_text[0].plain_text)
      questionMainOptions.innerHTML = `
        <div class="question-main__option" data-option-id="A">
          <label for="A">
            <input type="radio" name="${item.id}" id="A" value="A">
            ${item.data.A.rich_text[0].plain_text}
          </label>
        </div>
        <div class="question-main__option" data-option-id="B">
          <label for="B">
            <input type="radio" name="${item.id}" id="B" value="B">
            ${item.data.B.rich_text[0].plain_text}
          </label>
        </div>
        <div class="question-main__option" data-option-id="C">
          <label for="C">
            <input type="radio" name="${item.id}" id="C" value="C">
            ${item.data.C.rich_text[0].plain_text}
          </label>
        </div>
        <div class="question-main__option" data-option-id="D">
          <label for="D">
            <input type="radio" name="${item.id}" id="D" value="D">
            ${item.data.D.rich_text[0].plain_text}
          </label>
        </div>
      `
      questionMain.appendChild(questionMainOptions)
      //! end tạo div options
      questionContainer.appendChild(questionMain)
      questionsDiv.insertBefore(questionContainer, questionsNavigation)
    })
    //! khởi tạo các function logic của trang web
    showQuestion(questionsId[0])
    selectQuestion()
    questionsId.forEach((questionId) => {
      selectOption(questionId);
    })
    navigationQuestion()

    const btnFinish = document.querySelector('.btn-finish')
    if (btnFinish) {
      btnFinish.addEventListener('click', showResult)
    }
    //! khởi tạo các function logic của trang web
  })

//!end query questions từ database và in ra html

//! timer
let timer;
const initTimerCountdown = (min, timer__time) => {
  let time = min * 60;
  timer = setInterval(() => {
    if (time <= 59) timer__time.classList.add("timer__time--red");
    let minutes = Math.floor(time / 60) > 9 ? Math.floor(time / 60) : `0${Math.floor(time / 60)}`;
    let seconds = time % 60 > 9 ? time % 60 : `0${time % 60}`;
    if (time > 0) {
      time--;
      timer__time.innerHTML = `${minutes}:${seconds}`;
    } else {
      clearInterval(timer);
      timer__time.innerHTML = "00:00";
    }
  }, 1000);
}
const initTimerCount = (timer__time) => {
  let time = 0;
  timer = setInterval(() => {
    let minutes = Math.floor(time / 60) > 9 ? Math.floor(time / 60) : `0${Math.floor(time / 60)}`;
    let seconds = time % 60 > 9 ? time % 60 : `0${time % 60}`;
    time++;
    timer__time.innerHTML = `${minutes}:${seconds}`;
  }, 1000)
}
//! end timer

/**
 * !CÁC LOGIC
 * *1. add event cho các ô chọn câu hỏi bằng select question và hàm show question
 * *2. add event cho các ô chọn đáp án bằng select option 
 * *3. navigation question bằng btn prev và next (lùi, tiến câu hỏi)
 * *4. show result: khi chạy hàm này sẽ trigger modal result
 */

//! show question func
const showQuestion = (questionId) => {
  const questionShowing = document.querySelector(".question-container.show"); //? lấy câu hỏi đang hiển thị
  const questionShowingId = questionShowing?.getAttribute("data-question-id"); //? lấy id câu hỏi đang hiển thị
  if (questionShowingId && questionId !== questionShowingId) { //? nếu id câu hỏi chuyển đến khác id câu hỏi đang hiển thị
    questionShowing.classList.remove("show"); //? ẩn câu hỏi đang hiển thị

    const questionTarget = document.querySelector(`.question-container[data-question-id="${questionId}"]`);
    if (questionTarget) {
      questionTarget.classList.add("show"); //? hiển thị câu hỏi chuyển đến
    }

    const btnShowing = document.querySelector(`.btn-select-question[btn-data-question-id="${questionShowingId}"]`);
    btnShowing.classList.remove("question-palette__item--active"); //? chuyển btn sang trạng thái không chọn

    const btnTarget = document.querySelector(`.btn-select-question[btn-data-question-id="${questionId}"]`);
    btnTarget.classList.add("question-palette__item--active"); //? chuyển btn sang trạng thái chọn
  } else if (!questionShowingId) {
    const questionTarget = document.querySelector(`.question-container[data-question-id="${questionId}"]`);
    if (questionTarget) {
      questionTarget.classList.add("show"); //? hiển thị câu hỏi chuyển đến
      const btnTarget = document.querySelector(`.btn-select-question[btn-data-question-id="${questionId}"]`);
      btnTarget.classList.add("question-palette__item--active"); //? chuyển btn sang trạng thái chọn
    }
  }
}
//! end show question func

//! select question
const selectQuestion = () => {
  const btnsSellectQuestion = document.querySelectorAll(".btn-select-question"); //? select các btn ở palette
  if (btnsSellectQuestion && btnsSellectQuestion.length > 0) {
    btnsSellectQuestion.forEach((btn) => {
      btn.addEventListener("click", () => { //? add event từng btn
        const questionId = btn.getAttribute("btn-data-question-id"); //? lấy id câu hỏi cần chuyển đến
        showQuestion(questionId); //? chuyển đến câu hỏi
      })
    })
  }
}
//! end select question

//! select option
const selectOption = (questionId) => {
  const question = document.querySelector(`.question-container[data-question-id="${questionId}"]`);
  const correctOptionId = question.querySelector(".question-main__options").getAttribute('data-correct-option')
  const correctOption = question.querySelector(`.question-main__option[data-option-id="${correctOptionId}"]`);
  const options = question.querySelectorAll(".question-main__option");
  options.forEach((option) => {
    option.addEventListener("click", (e) => {
      e.preventDefault();
      //! get status xem đã trả lời chưa
      const status = question.getAttribute('data-question-status')
      if (status == "answered") {
        return;
      }
      question.setAttribute('data-question-status', 'answered')
      if (option.getAttribute('data-option-id') == correctOption.getAttribute('data-option-id')) {
        results.correct++;

        option.classList.add("question-main__option--correct");
        const btnShowing = document.querySelector(`.btn-select-question[btn-data-question-id="${questionId}"]`);
        btnShowing.classList.add("question-palette__item--correct"); //? chuyển btn sang trạng thái đúng
        btnShowing.classList.remove("question-palette__item--empty");
      } else {

        option.classList.add("question-main__option--incorrect");
        correctOption.classList.add("question-main__option--correct");
        const btnShowing = document.querySelector(`.btn-select-question[btn-data-question-id="${questionId}"]`);
        btnShowing.classList.add("question-palette__item--incorrect"); //? chuyển btn sang trạng thái sai
        btnShowing.classList.remove("question-palette__item--empty");
      }
      options.forEach((option) => {
        option.classList.add("question-main__option--disabled");
      })
    })
  })
}
//! end select option

//! navigation question
const navigationQuestion = () => {
  const btnNav = document.querySelector('.questions__navigation')
  if (btnNav) {
    const btnPrev = btnNav.querySelector('.prev')
    const btnNext = btnNav.querySelector('.next')
    btnPrev.addEventListener('click', () => {
      const currentQuestionIndex = document.querySelector('.question-container.show').getAttribute('data-question-index')
      const prevQuestionIndex = parseInt(currentQuestionIndex) - 1
      if (prevQuestionIndex >= 0) {
        showQuestion(questionsId[prevQuestionIndex])
      }
    })
    btnNext.addEventListener('click', () => {
      const currentQuestionIndex = document.querySelector('.question-container.show').getAttribute('data-question-index')
      const nextQuestionIndex = parseInt(currentQuestionIndex) + 1
      if (nextQuestionIndex < questionsId.length) {
        showQuestion(questionsId[nextQuestionIndex])
      }
    })
  }
}
//! end navigation question

//! result
const showResult = () => {
  results.incorrect = results.total - results.correct;
  results.percent = (results.correct / results.total) * 100;
  const contentReview = document.querySelector('.content-review')
  contentReview.innerHTML = `
  <p><strong>Correct: </strong> ${results.correct}</p>
  <p><strong>Incorrect: </strong> ${results.incorrect}</p>
  <p><strong>Total: </strong> ${results.total}</p>
  <p><strong>Percent: </strong> ${results.percent}%</p>
  `;

  const btnsSellectQuestion = document.querySelector('.question-palette__list').querySelectorAll(".btn-select-question"); //? select các btn ở palette
  btnsSellectQuestion.forEach((btn) => {
    if (btn.classList.contains('question-palette__item--empty')) {
      btn.classList.add('question-palette__item--incorrect')
      const emptyQuestionId = btn.getAttribute("btn-data-question-id"); //? lấy id câu hỏi trống
      const emptyQuestion = document.querySelector(`.question-container[data-question-id="${emptyQuestionId}"]`);
      const correctOptionId = emptyQuestion.querySelector(".question-main__options").getAttribute('data-correct-option')
      const correctOption = emptyQuestion.querySelector(`.question-main__option[data-option-id="${correctOptionId}"]`);
      correctOption.classList.add("question-main__option--correct")
      emptyQuestion.setAttribute('data-question-status', 'answered')
    }
  })

  clearInterval(timer);
  
  const btnFinish = document.querySelector('.btn-finish')
  if (btnFinish) {
    btnFinish.click();
  }
}
//! end result

//? hàm để pick ngẫu nhiên câu hỏi
function getRandomQuestions(questions, count) {
  // Clone mảng để tránh làm thay đổi mảng gốc
  const shuffledQuestions = [...questions];

  // Trộn mảng để có thứ tự ngẫu nhiên
  for (let i = shuffledQuestions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledQuestions[i], shuffledQuestions[j]] = [shuffledQuestions[j], shuffledQuestions[i]];
  }

  // Lấy và trả về 'count' câu hỏi đầu tiên từ mảng
  return shuffledQuestions.slice(0, count > questions.length ? questions.length : count);
}
//? end hàm để pick ngẫu nhiên câu hỏi