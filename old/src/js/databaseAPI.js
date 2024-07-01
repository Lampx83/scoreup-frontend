import axios from 'axios';
import config from './config.js';
import * as cookieFuntions from "./helpers/cookieFunctions.js";
const apiUrl = config.apiUrl;

export const getDatabase = (database,body = {}, config = {}) => {
  return axios.post(`${apiUrl}/databases/${database}/query`,body, config)
    .then(response => {
      return response.data.results;
    })
    .catch(error => {
      console.error('Error:', error);
      throw error;
    });
};

export const getQuestions = ({
  notionDatabaseId,
  tag,
  limit,
  multiQuestions = false,
  config = {}
}) => {
  return axios.post(`${apiUrl}/questions`,
  {
    notionDatabaseId,
    tag,
    limit: parseInt(limit),
    multiQuestions
  },
  {
    headers: {
      'Authorization': `Bearer ${cookieFuntions.getCookie("token")}`
    },
    ...config
  })
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.error('Error:', error);
      throw error;
    });
};

export const getPage = (pageId, body = {}, config = {}) => {
  return axios.get(`${apiUrl}/pages/${pageId}`,body, config)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.error('Error:', error);
      throw error;
    });
};

export const privateRequest = ({endpoint, body = {}, config = {}, method = "GET"}) => {
  return axios({
    method,
    url: `${apiUrl}/${endpoint}`,
    headers: {
      'Authorization': `Bearer ${cookieFuntions.getCookie("token")}`,
      ...config.headers
    },
    data: body,
  })
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.error('Error:', error);
      throw error;
    });
}