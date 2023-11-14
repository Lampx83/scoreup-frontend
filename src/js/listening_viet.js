//! timer
const initTimerCountdown = (min) => {
  let time = min * 60;
  let timer = setInterval(() => {
    if (time <= 59) document.querySelector(".timer__time").classList.add("timer__time--red");
    let minutes = Math.floor(time / 60);
    let seconds = time % 60 > 9 ? time % 60 : `0${time % 60}`;
    if (time > 0) {
      time--;
      document.querySelector(".timer__time").innerHTML = `${minutes}:${seconds}`;
    } else {
      clearInterval(timer);
      document.querySelector(".timer__time").innerHTML = "00:00";
    }
  }, 1000);
}
//! end timer

//! select question
const questions = document.querySelector(".questions");
const btnsSellectQuestion = document.querySelectorAll(".btn-select-question");
if (btnsSellectQuestion && btnsSellectQuestion.length > 0) {
  btnsSellectQuestion.forEach((btn) => {
    btn.addEventListener("click", () => {
      const questionId = btn.getAttribute("btn-data");
      const questionShowingId = questions.querySelector(".question-container.show")
        .getAttribute("data-question-id");
      btn.classList.add("question-palette__item--active");
      if (questionId !== questionShowingId) {
        questions.querySelector(".question-container.show").classList.remove("show");
        questions.querySelector(`.question-container[data-question-id="${questionId}"]`).classList.add("show");
        document.querySelector(`.btn-select-question[btn-data="${questionShowingId}"]`).classList.remove("question-palette__item--active");
        document.querySelector(`.btn-select-question[btn-data="${questionShowingId}"]`).classList.add("question-palette__item--empty");
      }
    })
  })
}
//! end select question