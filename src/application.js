import * as yup from 'yup';
import i18next from 'i18next';
import watcher from './view.js';
import resources from './locales/index.js';

const state = {
  form: {
    status: '',
    data: {
      url: '',
    },
    error: 0,
  },
  feeds: [],
};

const validate = (url, feeds) => {
  const schema = yup.string().url('errors.notValid')
    .required('errors.emptyField')
    .notOneOf(feeds, 'errors.hasAlready');

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
  const i18nextInstance = i18next.createInstance();

  i18nextInstance
    .init({
      debug: true,
      lng: 'ru',
      resources,
    })
    .then(() => {
      const watchedState = watcher(state, elements, i18nextInstance);
      console.log(22);
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
    });
};
