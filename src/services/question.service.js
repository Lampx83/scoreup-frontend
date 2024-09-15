import {get, post} from "~/utils/request.js";
import axios from "axios";

export const getQuestions = async ({
  limit = 5,
  multiQuestions = false,
  tag = "",
  notionDatabaseId = "",
}) => {
  return await post('/questions', {
    notionDatabaseId,
    tag,
    limit,
    multiQuestions
  });
}

export const postComment = async ({
  questionId,
  parentId = null,
  content = "",
}) => {
  const res = await post('/comments', {
    itemId: questionId,
    parentId,
    content
  });
  return res;
}

export const getComments = async ({
  questionId,
  parentId = null,
  limit = 5,
  offset = 0,
  sort = "desc",
}) => {
  let queryString = parentId ? `?itemId=${questionId}&parentId=${parentId}` : `?itemId=${questionId}`;

  if (limit > 0 && offset >= 0) {
    queryString += `&limit=${limit}&offset=${offset}&sort=${sort}`;
  }

  const res = await get(`/comments${queryString}`);
  return res;
}

export const postLogQuestion = async ({
  user_id,
  exercise_id,
  score,
  time_cost,
  user_ans,
  correct_ans,
}) => {
  return await post('/questions/log-questions', {
    user_id,
    exercise_id,
    score,
    time_cost,
    user_ans,
    correct_ans,
  });
}

export const getRecommendQuestions = async ({
  difficulty = 0,
  knowledge_concept = "",
  score = 0,
  bookmarked = 0,
  session_id = "",
}) => {

  const URL = "https://scoreup-rcm.whoisduyviet.id.vn/get_new_exercise";
  const body = {
    current_state: [difficulty, knowledge_concept, score, bookmarked],
    session_id: session_id,
  }

  const res = await axios.post(URL, body);

  return res.data;
}

export const submitResult = async ({
  user,
  certificateId,
  questions,
  total,
  correct
}) => {
  return await post('/questions/result', {
    user,
    certificateId,
    questions,
    total,
    correct
  });
}

export const getResult = async ({
  certificateId
}) => {
  return await get(`/questions/result?certificateId=${certificateId}`);
}

export const getResultById = async ({
  id
}) => {
  return await get(`/questions/result/${id}`);
}