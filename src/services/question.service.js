import {get, post} from "~/utils/request.js";
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
  answered = true
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
    answered
  });
}

export const getRecommendQuestions = async (state) => {

  const URL = "https://scoreup-rcm.whoisduyviet.id.vn/recommend_action";
  const user = cookies.get("user", { path: "/" });
  const body = {
    user_id: user._id,
    cur_chapter: config.CURRENT_CHAPTER
  }
  if (state && !isEmpty(state)) {
    const {
      difficulty,
      score,
      bookmarked,
      knowledge_concept
    } = state;
    body.state = [difficulty, score, bookmarked, knowledge_concept];
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

export const getRank = async () => {
  return await get('/app/rank');
}

export const trainModel = async (body) => {
  const URL = "https://scoreup-rcm.whoisduyviet.id.vn/train";
  try {
    const res = await axios.post(URL, body);
    await post("/app/error", {
      message: `
        Train model trành công: ${JSON.stringify(res.data)}  
        `,
    })
  } catch (error) {
    await post("/app/error", {
      message: `
        Train model lỗi: ${error.message}  
        `,
    })
  }
}