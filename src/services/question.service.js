import {get, getPage, post} from "~/utils/request.js";

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