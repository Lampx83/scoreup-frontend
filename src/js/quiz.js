import createTopNav from "./topNav.js";
import { getCookie } from "./helpers/cookieFunctions.js";
import { getDatabase, getPage } from "./databaseAPI.js";
import createFooter from "./footer.js";
// createTopNav("home");
// createFooter();

let questions = [
  {
    num: 1,
    question: "What does HTML stand for?",
    answer: "C. Hyper Text Markup Language",
    options: [
      "A. Hyper Type Multi Language",
      "B. Hyper Text Multiple Language",
      "C. Hyper Text Markup Language",
      "D. Home Text Multi Language",
    ],
  },
  {
    num: 2,
    question: "What does CSS stand for",
    answer: "A. Cascading Style Sheet",
    options: [
      "A. Cascading Style Sheet",
      "B. Cute Style Sheet",
      "C. Computer Style Sheet",
      "D. Codehal Style Sheet",
    ],
  },
  {
    num: 3,
    question: "What does PHP stand for",
    answer: "A. Hypertext Preprocessor",
    options: [
      "A. Hypertext Preprocessor",
      "B. Hometext Programming",
      "C. Hypertext Preprogramming",
      "D. Programming Hypertext Preprocessor",
    ],
  },
  {
    num: 4,
    question: "What does SQL stand for",
    answer: "D. Structure Query Language",
    options: [
      "A. Strength Query Language",
      "B. Strength Query Language",
      "C. Science Question Language",
      "D. Structure Query Language",
    ],
  },
  {
    num: 5,
    question: "What does XML stand for",
    answer: "D. Extensible Markup Language",
    options: [
      "A. Excellent Multiple Language",
      "B. Explore Multiple Language",
      "C. Extra Markup Language",
      "D. Extensible Markup Language",
    ],
  },
];

let questionCount = 0;
let questionNum = 1;
let userScore = 0;

const quizBox = document.querySelector(".quiz-box");
const optionList = quizBox.querySelector(".option-list");
const resultBox = document.querySelector(".quiz-result");
const tryAgainBtn = document.querySelector('.tryAgain-btn')
const nextBtn = quizBox.querySelector(".next-btn");
const goHomeBtn = resultBox.querySelector(".goHome-btn");

nextBtn.onclick = () => {
  if (questionCount < questions.length - 1) {
    questionCount++;
    showQuestions(questionCount);
    questionNum++;
    questionCounter(questionNum); 
    nextBtn.classList.remove('active');
  } else {
    showQuizResults();
  }
};

goHomeBtn.onclick = () => {
  window.location.href = "quiz-option.html";
}

tryAgainBtn.onclick = () => {
  setTimeout(function() {
    quizBox.classList.remove('d-none');
  }, 1000);
  // quizBox.classList.remove('d-none');
  nextBtn.classList.remove('active');
  resultBox.classList.remove('active');

  questionCount = 0;
  questionNum = 1;
  userScore = 0;

  showQuestions(questionCount);
  questionCounter(questionNum);
  headerScore();
}

showQuestions(0);
questionCounter(1);
headerScore()

function showQuestions(index) {
  const questionText = quizBox.querySelector(".question-text");
  questionText.textContent = `${questions[index].num}. ${questions[index].question}`;

  let optionTag = `
    <div class="option-list__option"><span>${questions[index].options[0]}</span></div>
    <div class="option-list__option"><span>${questions[index].options[1]}</span></div>
    <div class="option-list__option"><span>${questions[index].options[2]}</span></div>
    <div class="option-list__option"><span>${questions[index].options[3]}</span></div>
  `;
  
  optionList.innerHTML = optionTag;

  const option = quizBox.querySelectorAll('.option-list__option');
  for(let i = 0; i < option.length; i++) {
    option[i].onclick = () => {
      let correctAnswer = questions[questionCount].answer;
      let userAnswer = option[i];
      let userAnswerText = option[i].textContent;
      let allOptions = optionList.children.length;

      if (correctAnswer === userAnswerText) {
        userAnswer.classList.add('correct');
        userScore += 1;
        headerScore();
      }
      else {
        userAnswer.classList.add('incorrect');

        for (let i = 0; i < allOptions; i++) {
          if (optionList.children[i].textContent === correctAnswer) {
            optionList.children[i].setAttribute('class', 'option-list__option correct');
          }
        }
      }

      for (let i = 0; i < allOptions; i++) {
        optionList.children[i].classList.add('disabled');
      }

      nextBtn.classList.add('active')
    }
  }
}

function questionCounter(index) {
  const questionTotal = quizBox.querySelector('.question-total');
  questionTotal.textContent = `${index} of ${questions.length} Questions`;
}

function headerScore() {
  const headerScoreText = quizBox.querySelector('.header-score');
  headerScoreText.textContent = `Score: ${userScore} / ${questions.length}`;
}

function showQuizResults () {
  quizBox.classList.add("d-none");
  resultBox.classList.add('active'); 

  const scoreText = document.querySelector('.score-text');
  scoreText.textContent = `Your Score ${userScore} out of ${questions.length}`

  const circularProgress = resultBox.querySelector('.circular-progress');
  const progressValue = resultBox.querySelector('.progress-value');
  let progressStartValue = 0;
  let progressEndValue = (userScore / questions.length) * 100;
  let speed = 20;

  let progress = setInterval(() => {
    if (progressStartValue < 100 && progressEndValue < 100) {
      progressStartValue++;
      progressValue.textContent = `${progressStartValue} %`
      circularProgress.style.background = `conic-gradient(#a5d7e8 ${progressStartValue * 3.6}deg, rgba(255, 255, 255, .1) 0deg)`;
      if (progressStartValue == progressEndValue) {
        clearInterval(progress);
      }
    } else {
      progressStartValue = progressEndValue = 100;
      clearInterval(progress);
    }
  }, speed);
}