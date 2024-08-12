import * as yup from 'yup';
import i18next from 'i18next';
import { nanoid } from 'nanoid';
import watcher from './view.js';
import resources from './locales/index.js';
import parser from './parser.js';
import proxyAPI from './proxyAPI.js';

const state = {
  form: {
    status: 'without data',
    error: null,
  },
  loadingProcess: {
    status: 'without data',
    error: null,
  },
  feeds: [],
  posts: [],
  modal: {
    readPostsId: new Set(),
    viewedId: null,
  },
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

const uploadContent = (url, watchedState) => {
  const isDuplicate = watchedState.feeds.some((feed) => feed.url === url);
  if (isDuplicate) {
    watchedState.form.error = 'errors.hasAlready';
    watchedState.form.status = 'failed';
    return;
  }

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
      console.log(error);
      watchedState.loadingProcess.status = 'failed';
    });
};

const checkNewContent = (watchedState) => {
  const { feeds, posts } = watchedState;
  const interval = 5000;

  const promises = feeds.map((feed) => proxyAPI(feed.url)
    .then((data) => {
      const { posts: newPosts } = parser(data);
      const postLinks = posts.map((post) => post.link);

      const feedId = feed.id;

      const newUniquePosts = newPosts.filter((post) => !postLinks.includes(post.link));

      if (newUniquePosts.length > 0) {
        const newPostsWithId = newUniquePosts.map((post) => ({ id: nanoid(), feedId, ...post }));
        watchedState.posts.unshift(...newPostsWithId);
      }
    })
    .catch((error) => console.error(error)));

  Promise.all(promises).then(() => {
    setTimeout(() => checkNewContent(watchedState), interval);
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
    modalWindow: document.querySelector('.modal'),
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
            uploadContent(url, watchedState);
          }
        });
      }));

      elements.postsContainer.addEventListener('click', (event) => {
        const { id } = event.target.dataset;
        if (id) {
          watchedState.modal.readPostsId.add(id);
          watchedState.modal.viewedId = id;
        }
      });

      checkNewContent(watchedState);
    });
};
