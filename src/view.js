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

export default (state, elements, i18nextInstance) => onChange(state, (path, value) => {
  switch (path) {
    case 'form.status':
      validateRender(state, elements, value, i18nextInstance);
      break;
    case 'loadingProcess.status':
      loadingRender(state, elements, value, i18nextInstance);
      break;
    default:
      break;
  }
});
