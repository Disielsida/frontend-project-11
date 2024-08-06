import onChange from 'on-change';

const validateRender = (state, elements, value, i18nextInstance) => {
  const { feedback, input, button } = elements;
  const { form } = state;
  if (value === 'failed') {
    feedback.classList.add('text-danger');
    feedback.textContent = i18nextInstance.t(form.error);
    input.classList.add('is-invalid');
    input.removeAttribute('disabled');
    button.classList.remove('disabled');
  } else if (value === 'loading') {
    feedback.textContent = '';
    feedback.classList.remove('text-danger');
    input.classList.remove('is-invalid');
    input.setAttribute('disabled', '');
    button.classList.add('disabled');
  }
};

const loadingRender = (state, elements, value, i18nextInstance) => {
  const {
    form, feedback, input, button,
  } = elements;
  const { loadingProcess } = state;

  if (value === 'failed') {
    feedback.textContent = i18nextInstance.t(loadingProcess.error);
    feedback.classList.add('text-danger');
    input.classList.add('is-invalid');
    input.removeAttribute('disabled');
    button.classList.remove('disabled');
  } else if (value === 'success') {
    feedback.classList.remove('text-danger');
    feedback.classList.add('text-success');
    feedback.textContent = i18nextInstance.t('success');
    input.removeAttribute('disabled');
    button.classList.remove('disabled');
    form.reset();
    input.focus();
  }
};

const makeCardContainer = (title) => {
  const borderEl = document.createElement('div');
  borderEl.classList.add('card', 'border-0');

  const bodyEl = document.createElement('div');
  bodyEl.classList.add('card-body');
  const hEl = document.createElement('h2');
  hEl.classList.add('card-title', 'h4');
  hEl.textContent = title;

  bodyEl.append(hEl);

  const ulEl = document.createElement('ul');
  ulEl.classList.add('list-group', 'border-0', 'rounded-0');

  borderEl.append(bodyEl, ulEl);
  return borderEl;
};

const feedsRender = (state, elements, i18nextInstance) => {
  const { feedsContainer } = elements;
  const { feeds } = state;

  if (feedsContainer.childNodes.length === 0) {
    const cardContainer = makeCardContainer(i18nextInstance.t('feeds'));
    feedsContainer.append(cardContainer);
  }

  const list = feedsContainer.querySelector('ul');

  list.innerHTML = '';

  feeds.forEach((feed) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'border-0', 'border-end-0');
    li.setAttribute('data-id', `${feed.id}`);

    const titleEl = document.createElement('h3');
    titleEl.classList.add('h6', 'm-0');
    titleEl.textContent = feed.title;

    const descriptionEl = document.createElement('p');
    descriptionEl.classList.add('m-0', 'small', 'text-black-50');
    descriptionEl.textContent = feed.description;

    li.append(titleEl, descriptionEl);

    list.append(li);
  });
};

const postsRender = (state, elements, i18nextInstance) => {
  const { postsContainer } = elements;
  const { posts } = state;

  if (postsContainer.childNodes.length === 0) {
    const cardContainer = makeCardContainer(i18nextInstance.t('posts'));
    postsContainer.append(cardContainer);
  }

  const list = postsContainer.querySelector('ul');

  list.innerHTML = '';

  posts.forEach((post) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

    const link = document.createElement('a');
    link.setAttribute('href', `${post.link}`);
    link.classList.add('fw-bold');
    link.setAttribute('data-id', `${post.id}`);
    link.setAttribute('data-feed-id', `${post.feedId}`);
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
    link.textContent = post.postTitle;

    const button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    button.setAttribute('data-id', `${post.id}`);
    button.setAttribute('data-bs-toggle', 'modal');
    button.setAttribute('data-bs-target', '#modal');
    button.textContent = 'Просмотр';

    li.append(link, button);

    list.append(li);
  });
};

export default (state, elements, i18nextInstance) => onChange(state, (path, value) => {
  switch (path) {
    case 'form.status':
      validateRender(state, elements, value, i18nextInstance);
      break;
    case 'loadingProcess.status':
      loadingRender(state, elements, value, i18nextInstance);
      break;
    case 'feeds':
      feedsRender(state, elements, i18nextInstance);
      break;
    case 'posts':
      postsRender(state, elements, i18nextInstance);
      break;
    default:
      break;
  }
});
