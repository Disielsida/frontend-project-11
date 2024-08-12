import axios from 'axios';

const getProxiedUrl = (url) => {
  const baseUrl = 'https://allorigins.hexlet.app/get';
  const searchParams = new URLSearchParams({
    disableCache: 'true',
    url,
  });

  return `${baseUrl}?${searchParams.toString()}`;
};

export default (url) => axios
  .get(getProxiedUrl(url))
  .then((response) => {
    if (response.status >= 200 && response.status < 400) return response.data.contents;
    throw new Error('errors.unknown');
  })
  .catch((error) => {
    error.message = 'errors.network';
    throw error;
  });
