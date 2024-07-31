import onChange from 'on-change';

export default (state, elements, i18nextInstance) => {
  const { input, form, feedback } = elements;

  return onChange(state, (path, value) => {
    if (state.form.error !== '') {
      input.classList.add('is-invalid');
      feedback.textContent = i18nextInstance.t(value);
      console.log(i18nextInstance.t(value), value, i18nextInstance.t('errors.notValid'));
    } else {
      input.classList.remove('is-invalid');
      feedback.textContent = '';
      form.reset();
      input.focus();
    }
  });
};
