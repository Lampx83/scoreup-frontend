import axios from 'axios';
import config from './config.js';
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

export const getQuestions = (body = {}, config = {}) => {
  return axios.post(`${apiUrl}/questions`,body, config)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.error('Error:', error);
      throw error;
    });
}