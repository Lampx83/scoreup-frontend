import { privateRequest } from "../databaseAPI.js";
import * as cookieFuntions from "./cookieFunctions.js";

export const initLogQuestion = ({
  questionId
}) => {
  const logQuestion = {
    questionId,
    userEmail: JSON.parse(cookieFuntions.getCookie("user")).email,
    timeIn: new Date(),
    timeOut: null,
    duration: null,
    answer: null,
    status: "unanswered"
  }

  window.localStorage.setItem("logQuestion", JSON.stringify(logQuestion));
}

export const commitLogQuestion = ({
  answer = null,
  status = "unanswered"
}) => {
  const logQuestion = JSON.parse(window.localStorage.getItem("logQuestion"));
  logQuestion.answer = answer;
  logQuestion.status = status;
  logQuestion.timeOut = new Date();
  logQuestion.timeIn = new Date(logQuestion.timeIn);

  logQuestion.duration = (logQuestion.timeOut - logQuestion.timeIn) / 1000;
  
  logQuestion.timeIn = logQuestion.timeIn;
  logQuestion.timeOut = logQuestion.timeOut;

  if (answer && logQuestion.duration > 2) {
    privateRequest({
      endpoint: "logQuestion",
      body: logQuestion,
      method: "POST"
    })
    console.log("logged")
  }
}