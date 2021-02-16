/* eslint-disable object-curly-newline */
/* eslint-disable no-param-reassign */
import axios from 'axios';
import * as yup from 'yup';

import uniqueId from 'lodash/uniqueId';
import noop from 'lodash/noop';
import differenceBy from 'lodash/differenceBy';

import parseRss from './parseRss.js';

const validateInput = (value, state) => {
  const existingUrls = state.feeds.map((feed) => feed.url);
  const schema = yup.string().required().url().notOneOf(existingUrls);
  try {
    schema.validateSync(value);
    return null;
  } catch (err) {
    return err.message;
  }
};

const addProxyToUrl = (url) => {
  const urlWithProxy = new URL('/get', 'https://hexlet-allorigins.herokuapp.com');
  urlWithProxy.searchParams.set('url', url);
  urlWithProxy.searchParams.set('disableCache', 'true');
  return urlWithProxy.toString();
};

const deleteFeed = (feed, state) => {
  const posts = state.posts.filter((item) => item.feedId !== feed.id);
  const feeds = state.feeds.filter((item) => item.id !== feed.id);

  state.feeds = [...feeds];
  state.posts = [...posts];
  state.loadingProcess = { status: 'deleted', error: null };
};

const updateFeed = (feed, state) => {
  const proxyUrl = addProxyToUrl(feed.url);
  return axios.get(proxyUrl)
    .then((response) => {
      const { posts } = parseRss(response.data.contents);
      const diffPosts = differenceBy(posts, state.posts, 'title');
      if (diffPosts.length) {
        const newPosts = diffPosts.map((post) => ({ ...post, id: uniqueId(), feedId: feed.id }));
        state.posts = [...state.posts, ...newPosts];
        state.feeds.forEach((item) => {
          if (item.id === feed.id) {
            item.updated = new Date().toLocaleString();
          }
        });
      }
    })
    .catch(noop);
};

// const autoUpdateFeed = (feed, state, updateTimeout) => {
//   updateFeed(feed, state)
//     .catch(noop)
//     .finally(() => {
//       setTimeout(() => autoUpdateFeed(feed, state, updateTimeout), updateTimeout);
//     });
// };

export const exampleHandler = (e, state) => {
  e.preventDefault();
  state.example = '';
  state.example = e.target.textContent;
};

export const submitHandler = (e, state) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const url = formData.get('url');

  const errorInput = validateInput(url, state);
  if (errorInput) {
    state.form = { valid: false, error: errorInput };
    return;
  }
  state.form = { valid: true, error: null };
  state.loadingProcess = { status: 'loading', error: null };

  axios.get(addProxyToUrl(url))
    .then((resp) => {
      const feedData = parseRss(resp.data.contents);
      const feedId = uniqueId();

      const feed = { ...feedData.feed, url, id: feedId };
      const posts = feedData.posts
        .map((post) => ({ ...post, feedId, id: uniqueId(), readed: false, faforite: false }));

      state.feeds = [...state.feeds, feed];
      state.posts = [...state.posts, ...posts];
      state.loadingProcess = { status: 'loaded', error: null };

      // const updateTimeout = 5000;
      // setTimeout(() => autoUpdateFeed(feed, state, updateTimeout), updateTimeout);
    })
    .catch((err) => {
      if (err.isAxiosError) {
        state.loadingProcess = { status: 'failed', error: 'network' };
      } else if (err.isParsingError) {
        state.loadingProcess = { status: 'failed', error: 'parsing' };
      } else {
        state.loadingProcess = { status: 'failed', error: 'unknown' };
      }
    });
};

const toggleFeedProp = (feed, state, checked, propName) => {
  if (checked) {
    state.feeds.forEach((item) => {
      if (item.id === feed.id) {
        item[propName] = true;
      }
    });
  } else {
    state.feeds.forEach((item) => {
      if (item.id === feed.id) {
        item[propName] = false;
      }
    });
  }
};

export const feedHandler = (e, state, feed) => {
  // console.log(e.target);
  // console.dir(e.target);
  if (e.target.name === 'update') {
    updateFeed(feed, state);
  } else if (e.target.name === 'delete') {
    deleteFeed(feed, state);
  } else if (e.target.name === 'autoUpdate') {
    toggleFeedProp(feed, state, e.target.checked, 'autoUpdate');
  } else if (e.target.name === 'showPosts') {
    toggleFeedProp(feed, state, e.target.checked, 'showPosts');
  }
};

const togglePostProp = (post, state, propName) => {
  state.posts.forEach((item) => {
    if (item.id === post.id) {
      if (post[propName]) {
        item[propName] = false;
      } else {
        item[propName] = true;
      }
    }
  });
};

export const postHandler = (e, state, post) => {
  const { type, bsTarget } = e.target.dataset;
  console.dir(e.target);
  console.dir(e.target.dataset);
  if (type === 'toggleReaded') {
    togglePostProp(post, state, 'readed');
  } else if (type === 'toggleFavorite') {
    togglePostProp(post, state, 'favorite');
  } else if (type === 'readed') {
    state.posts.forEach((item) => {
      if (item.id === post.id) {
        item.readed = true;
      }
    });
  }

  if (bsTarget === '#modal') {
    state.modal = { postId: post.id };
  }
};

const toggleFilterProp = (state, checked, propName) => {
  if (checked) {
    state.ui.filter[propName] = true;
  } else {
    state.ui.filter[propName] = false;
  }
  console.log('toggleFilterProp', state.ui);
};

export const postsFilterHandler = (e, state) => {
  if (e.target.name === 'showUnread') {
    toggleFilterProp(state, e.target.checked, 'showUnread');
  } else if (e.target.name === 'showFavorite') {
    toggleFilterProp(state, e.target.checked, 'showFavorite');
  }
};
