import {get, patch, post} from "~/utils/request.js";
import axios from "axios";
import config from "~/config.js";
import cookies from "~/utils/cookies.js";
import {isEmpty} from "lodash";

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
  exercise_id,
  score,
  time_cost,
  user_ans,
  correct_ans,
  isRecommended = false,
  answered = true,
  bookmarked = 0,
  mastered = 0,
  indexRcm = 0
}) => {
  const userInfo = cookies.get("user", { path: "/" });

  return await post('/questions/log-questions', {
    user_id: userInfo._id,
    exercise_id,
    score,
    time_cost,
    user_ans,
    correct_ans,
    isRecommended,
    answered,
    bookmarked,
    mastered,
    index: indexRcm
  });
}

export const updateLogQuestion = async ({
  exercise_id,
  bookmarked = undefined,
  mastered = undefined,
}) => {
  const userInfo = cookies.get("user", { path: "/" });

  return await patch(`/questions/log-questions`, {
    user_id: userInfo._id,
    exercise_id,
    bookmarked,
    mastered
  });
}

export const getRecommendQuestions = async () => {

  const URL = "https://scoreup-rcm.whoisduyviet.id.vn/recommend";
  const user = cookies.get("user", { path: "/" });
  const body = {
    user_id: user._id
  };

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

export const getRank = async () => {
  return await get('/app/rank');
}

export const saveRatingRecommend  = async ({
  clusters = [],
  rating = 0
}) => {
  const user = cookies.get("user", { path: "/" });

  return await post('https://scoreup-rcm.whoisduyviet.id.vn/upsert', {
    user_id: user._id,
    data: {
      rating,
      clusters
    }
  });
}