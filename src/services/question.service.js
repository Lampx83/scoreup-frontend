import {get, getPage, post} from "~/utils/request.js";


export const getCertificate = async ({ id }) => {
  return getPage(id);
}

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