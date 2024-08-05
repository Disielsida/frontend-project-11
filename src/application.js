import * as yup from 'yup';
import i18next from 'i18next';
import { nanoid } from 'nanoid';
import watcher from './view.js';
import resources from './locales/index.js';
import parser from './parser.js';
import proxyAPI from './proxyAPI.js';

const state = {
  form: {
    status: '',
    error: '',
  },
  loadingProcess: {
    status: '',
    error: '',
  },
  feeds: [],
  posts: [],
};

const validate = (url, feeds) => {
  const feedsUrls = feeds.map((feed) => feed.url);
  const schema = yup.string().url('errors.notValid')
    .required('errors.emptyField')
    .notOneOf(feedsUrls, 'errors.hasAlready');

  return schema.validate(url)
    .then(() => {})
    .catch((error) => error.message);
};

const loading = (url, watchedState) => {
  proxyAPI(url)
    .then((data) => {
      const { feed, posts } = parser(data);
      const feedId = nanoid();
      const postsWithId = posts.map((post) => ({ id: nanoid(), feedId, ...post }));
      watchedState.feeds.unshift({ id: feedId, url, ...feed });
      watchedState.posts.unshift(...postsWithId);
      watchedState.loadingProcess.status = 'success';
    })
    .catch((error) => {
      watchedState.loadingProcess.error = error.message;
      watchedState.loadingProcess.status = 'failed';
    });
};

export default () => {
  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('#url-input'),
    feedback: document.querySelector('.feedback'),
    button: document.querySelector('[aria-label="add"]'),
    feedsContainer: document.querySelector('.feeds'),
    postsContainer: document.querySelector('.posts'),
  };

  const i18nextInstance = i18next.createInstance();

  i18nextInstance
    .init({
      debug: false,
      lng: 'ru',
      resources,
    })
    .then(() => {
      const watchedState = watcher(state, elements, i18nextInstance);
      elements.form.addEventListener('submit', ((e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const url = formData.get('url').trim();
        const { feeds } = state;

        validate(url, feeds).then((error) => {
          if (error) {
            watchedState.form.error = error;
            watchedState.form.status = 'failed';
          } else {
            watchedState.form.error = '';
            watchedState.form.status = 'loading';
            watchedState.loadingProcess.status = '';
            loading(url, watchedState);
          }
        });
      }));
    });
};
