const questionsId = [1, 2, 3, 4]
//! timer
const initTimerCountdown = (min, timer__time) => {
  let time = min * 60;
  let timer = setInterval(() => {
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
  let timer = setInterval(() => {
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
    btnShowing.classList.add("question-palette__item--empty");

    const btnTarget = document.querySelector(`.btn-select-question[btn-data-question-id="${questionId}"]`);
    btnTarget.classList.add("question-palette__item--active"); //? chuyển btn sang trạng thái chọn
    btnTarget.classList.remove("question-palette__item--empty");
  } else if (!questionShowingId) {
    const questionTarget = document.querySelector(`.question-container[data-question-id="${questionId}"]`);
    if (questionTarget) {
      questionTarget.classList.add("show"); //? hiển thị câu hỏi chuyển đến
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

//! show key
const showKey = (questionId) => {
  const question = document.querySelector(`.question-container[data-question-id="${questionId}"]`);
  const correctOptionId = question.querySelector(".question-main__options").getAttribute('data-correct-option')
  const correctOption = question.querySelector(`.question-main__option[data-option-id="${correctOptionId}"]`);
  const options = question.querySelectorAll(".question-main__option");
  options.forEach((option) => {
    option.addEventListener("click", (e) => {
      e.preventDefault();
      const status = question.getAttribute('data-question-status')
      if (status == "answered") {
        return;
      }
      question.setAttribute('data-question-status', 'answered')
      if (option.getAttribute('data-option-id') == correctOption.getAttribute('data-option-id')) {
        option.classList.add("question-main__option--correct");
      } else {
        option.classList.add("question-main__option--incorrect");
        correctOption.classList.add("question-main__option--correct");
      }
      options.forEach((option) => {
        option.classList.add("question-main__option--disabled");
      })
    })
  })
}
questionsId.forEach((questionId) => {
  showKey(questionId);
})
//! end show key

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