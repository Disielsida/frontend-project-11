import * as yup from 'yup';
import watcher from './view.js';

const state = {
  form: {
    status: '',
    data: {
      url: '',
    },
    error: '',
  },
  feeds: [],
};

const validate = (url, feeds) => {
  const schema = yup.string().url('Ссылка должна быть валидным URL')
    .required('Ничего нет')
    .notOneOf(feeds, 'RSS уже существует');

  return schema.validate(url)
    .then(() => {})
    .catch((error) => error.message);
};

export default () => {
  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('#url-input'),
    feedback: document.querySelector('.feedback'),
  };

  const watchedState = watcher(state, elements);

  elements.form.addEventListener('submit', ((e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('url').trim();
    const { feeds } = state;

    validate(url, feeds).then((error) => {
      if (error) {
        watchedState.form.error = error;
      } else {
        watchedState.feeds.push(url);
        watchedState.form.data.url = url;
        watchedState.form.error = '';
      }
    });
  }));

  return state;
};
