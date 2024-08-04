import axios from 'axios';

export default (url) => axios
  .get(`https://allorigins.hexlet.app/get?disableCache=true&url=${url}`)
  .then((response) => {
    if (response.status >= 200 && response.status < 400) return response.data.contents;
    throw new Error('errors.unknown');
  })
  .catch((error) => {
    error.message = 'errors.network';
    throw error;
  });
