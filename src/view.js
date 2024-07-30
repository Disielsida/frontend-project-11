import onChange from 'on-change';

export default (state, elements) => {
  const { input, form, feedback } = elements;

  return onChange(state, (path, value) => {
    if (path === 'form.error') {
      if (state.form.error !== '') {
        input.classList.add('is-invalid');
        feedback.textContent = value;
      } else {
        input.classList.remove('is-invalid');
        feedback.textContent = '';
        form.reset();
        input.focus();
      }
    }
  });
};
