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