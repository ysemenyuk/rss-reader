export default (contents) => {
  const domparser = new DOMParser();
  const doc = domparser.parseFromString(contents, 'application/xml');
  // console.log(doc);
  const parseError = doc.querySelector('parsererror');

  if (parseError) {
    throw new Error('parsingErr');
  }

  const channel = doc.querySelector('channel');
  const items = channel.querySelectorAll('item');

  const feed = {
    title: channel.querySelector('title').textContent,
    description: channel.querySelector('description').textContent,
  };

  const posts = [];

  items.forEach((item) => {
    const post = {
      title: item.querySelector('title').textContent,
      description: item.querySelector('description').textContent,
      link: item.querySelector('link').textContent,
    };
    posts.unshift(post);
  });

  return { feed, posts };
};
