import config from '../config';

export const get = async (path) => {
  const response = await fetch(`${config.API_URL}${path}`);
  return response.json();
}

export const post = async (path, data = {}) => {
  const response = await fetch(`${config.API_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  return response.json();
}