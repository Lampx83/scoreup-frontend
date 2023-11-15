const questionsId = [1, 2, 3, 4]
const results = {
  correct: 0,
  incorrect: 0,
  point: 0,
  total: questionsId.length,
  percent: 0,
}

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
const timer__time = document.querySelector(".timer__time");
document.addEventListener("DOMContentLoaded", () => {
  initTimerCount(timer__time);
})
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
showQuestion(1); //? hiển thị câu hỏi đầu tiên
//! end show question func

//! select question
const btnsSellectQuestion = document.querySelectorAll(".btn-select-question"); //? select các btn ở palette
if (btnsSellectQuestion && btnsSellectQuestion.length > 0) {
  btnsSellectQuestion.forEach((btn) => {
    btn.addEventListener("click", () => { //? add event từng btn
      const questionId = btn.getAttribute("btn-data-question-id"); //? lấy id câu hỏi cần chuyển đến
      showQuestion(questionId); //? chuyển đến câu hỏi
    })
  })
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
questionsId.forEach((questionId) => {
  selectOption(questionId);
})
//! end select option

//! navigation question
const btnNav = document.querySelector('.questions__navigation')
if (btnNav) {
  const btnPrev = btnNav.querySelector('.prev')
  const btnNext = btnNav.querySelector('.next')
  btnPrev.addEventListener('click', () => {
    const currentQuestionId = document.querySelector('.question-container.show').getAttribute('data-question-id')
    const prevQuestionId = parseInt(currentQuestionId) - 1
    if (prevQuestionId > 0) {
      showQuestion(prevQuestionId)
    }
  })
  btnNext.addEventListener('click', () => {
    const currentQuestionId = document.querySelector('.question-container.show').getAttribute('data-question-id')
    const nextQuestionId = parseInt(currentQuestionId) + 1
    if (nextQuestionId <= questionsId.length) {
      showQuestion(nextQuestionId)
    }
  })
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