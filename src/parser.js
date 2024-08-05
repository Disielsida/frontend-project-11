export default (data) => {
  const parser = new DOMParser();
  const document = parser.parseFromString(data, 'application/xml');
  const parserError = document.querySelector('parsererror');

  if (document.contains(parserError)) {
    const error = new Error('errors.withoutRss');
    throw error;
  }

  const title = document.querySelector('title').textContent;
  const description = document.querySelector('description').textContent;
  const feed = { title, description };

  const items = document.querySelectorAll('item');

  const posts = Array.from(items).map((item) => {
    const postTitle = item.querySelector('title').textContent;
    const postDescription = item.querySelector('description').textContent;
    const link = item.querySelector('link').textContent;
    return { postTitle, postDescription, link };
  });

  return { feed, posts };
};
