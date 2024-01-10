import createTopNav from "./topNav.js";
import { getCookie } from "./helpers/cookieFunctions.js";
import { getDatabase, getPage } from "./databaseAPI.js";
import createFooter from "./footer.js";
createTopNav("home");
createFooter();

//! Number of quizzes Option 
const quizNum = document.querySelector('.quiz-prep__form input[type="number"]');
quizNum.addEventListener('input', () => {
  let val = parseInt(quizNum.value);
  if (isNaN(val) || val < 1) val = 1;
  else if (val > 99) val = 99;
  quizNum.value = val;
})
//! End number of quizzes Option 

const quiz = document.querySelector('#quiz');
console.log(quiz);