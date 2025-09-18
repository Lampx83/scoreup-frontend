import { get, patch, post } from "~/utils/request.js";
import axios from "axios";
import config from "~/config.js";
import cookies from "~/utils/cookies.js";
import { isEmpty } from "lodash";

export const getQuestions = async ({
  limit = 5,
  multiQuestions = false,
  tag = "",
  notionDatabaseId = "",
}) => {
  return await post("/questions", {
    notionDatabaseId,
    tag,
    limit,
    multiQuestions,
  });
};

export const postComment = async ({
  questionId,
  parentId = null,
  content = "",
}) => {
  const res = await post("/comments", {
    itemId: questionId,
    parentId,
    content,
  });
  return res;
};

export const getComments = async ({
  questionId,
  parentId = null,
  limit = 5,
  offset = 0,
  sort = "desc",
}) => {
  let queryString = parentId
    ? `?itemId=${questionId}&parentId=${parentId}`
    : `?itemId=${questionId}`;

  if (limit > 0 && offset >= 0) {
    queryString += `&limit=${limit}&offset=${offset}&sort=${sort}`;
  }

  const res = await get(`/comments${queryString}`);
  return res;
};

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
  indexRcm = 0,
}) => {
  const userInfo = cookies.get("user", { path: "/" });

  return await post("/questions/log-questions", {
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
    index: indexRcm,
  });
};

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
    mastered,
  });
};

export const getRecommendQuestions = async () => {
  const URL = "https://scoreup-rcm.whoisduyviet.id.vn/api/v1/rcm/box";
  const user = cookies.get("user", { path: "/" });
  const body = {
    user_id: user._id,
    course_name: "CSLT",
  };

  const res = await axios.post(URL, body);

  return res.data;
};

export const submitResult = async ({
  user,
  certificateId,
  questions,
  total,
  correct,
  start = null,
  end = null,
}) => {
  return await post("/questions/result", {
    user,
    certificateId,
    questions,
    total,
    correct,
    start,
    end,
  });
};

export const getResult = async ({ certificateId }) => {
  return await get(`/questions/result?certificateId=${certificateId}`);
};

export const getResultById = async ({ id }) => {
  return await get(`/questions/result/${id}`);
};

export const getRank = async () => {
  return await get("/app/rank");
};

export const saveRatingRecommend = async ({ clusters = [], rating = 0 }) => {
  const user = cookies.get("user", { path: "/" });

  return await post(
    "https://scoreup-rcm.whoisduyviet.id.vn/api/v1/ratings/upsert",
    {
      user_id: user._id,
      data: {
        rating,
        clusters,
      },
    }
  );
};

export const updateBox = async ({ setData = [] }) => {
  const user = cookies.get("user", { path: "/" });
  const body = {
    data: setData.map((item) => ({
      user_id: user._id,
      category: item.type,
      question_id: item.id,
    })),
  };

  const URL = "https://scoreup-rcm.whoisduyviet.id.vn/api/v1/rcm/box";

  return await axios.put(URL, body);
};

export const sendPerformance = async ({ total, click, completed }) => {
  const user = cookies.get("user", { path: "/" });
  const body = {
    user_id: user._id,
    course_name: "CSLT",
    date: new Date().toISOString().split("T")[0],
    total,
    click,
    completed,
  };

  const URL = "https://scoreup-rcm.whoisduyviet.id.vn/api/v1/performance/save";

  return await axios.post(URL, body);
};

export const updateQuestion = async () => {
  const URL =
    "https://scoreup.whoisduyviet.id.vn/api/v1/api/questions/update/21c4b65d1cba80b39692e04775567f38";
  return await patch(
    URL,
    {},
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization:
          "Bearer 57bd454e404a230b4ccb9c8cf52b286b8f3b477ffa09ea292b0587dcb9ac4ca5c52560f40775f69afb5fdf67e2f11acadb7b32671e3248260374ec98c754e46f",
      },
    }
  );
};
