/* eslint-disable object-curly-newline */
/* eslint-disable no-param-reassign */
import axios from 'axios';
import * as yup from 'yup';

import uniqueId from 'lodash/uniqueId';
import noop from 'lodash/noop';
import differenceBy from 'lodash/differenceBy';

import parseRss from './parseRss.js';

const validateInput = (value, existingValues) => {
  const schema = yup.string().required().url().notOneOf(existingValues);
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

  state.form.status = 'deleted';
  state.form.error = null;
};

const updateFeed = (feed, state) => {
  const proxyUrl = addProxyToUrl(feed.url);
  return axios.get(proxyUrl)
    .then((response) => {
      const { posts } = parseRss(response.data.contents);
      const diffPosts = differenceBy(posts, state.posts, 'title');

      state.feeds.forEach((item) => {
        if (item.id === feed.id) {
          item.updated = new Date().toLocaleString();
        }
      });

      if (diffPosts.length !== 0) {
        const newPosts = diffPosts.map((post) => ({ ...post, id: uniqueId(), feedId: feed.id }));
        state.posts = [...state.posts, ...newPosts];
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
  state.form.input = e.target.textContent;
};

export const inputHandler = (e, state) => {
  state.form.input = e.target.value;
};

export const submitHandler = (e, state) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const url = formData.get('url');

  const existingUrls = state.feeds.map((feed) => feed.url);
  const errorInput = validateInput(url, existingUrls);

  if (errorInput) {
    state.form.status = 'failed';
    state.form.error = errorInput;
    return;
  }

  state.form.status = 'loading';
  state.form.error = null;

  axios.get(addProxyToUrl(url))
    .then((resp) => {
      const feedData = parseRss(resp.data.contents);
      const feedId = uniqueId();
      const added = new Date().toLocaleString();

      const feed = { ...feedData.feed, url, id: feedId, added, updated: '-' };
      const posts = feedData.posts
        .map((post) => ({ ...post, feedId, id: uniqueId(), readed: false, favorite: false }));

      state.feeds = [...state.feeds, feed];
      state.posts = [...state.posts, ...posts];

      state.form.status = 'loaded';
      state.form.error = null;
      state.form.input = '';
      // const updateTimeout = 5000;
      // setTimeout(() => autoUpdateFeed(feed, state, updateTimeout), updateTimeout);
    })
    .catch((err) => {
      console.log(err.message);

      state.form.status = 'failed';
      if (err.isAxiosError) {
        state.form.error = 'network';
      } else if (err.isParsingError) {
        state.form.error = 'parsing';
      } else {
        state.form.error = 'unknown';
      }
    });
};

export const feedHandler = (e, state, feed) => {
  if (e.target.name === 'update') {
    updateFeed(feed, state);
  } else if (e.target.name === 'delete') {
    deleteFeed(feed, state);
  } else if (e.target.name === 'autoUpdate') {
    state.feeds.forEach((item) => {
      if (item.id === feed.id) {
        item.autoUpdate = !item.autoUpdate;
      }
    });
  } else if (e.target.name === 'showPosts') {
    state.feeds.forEach((item) => {
      if (item.id === feed.id) {
        item.showPosts = !item.showPosts;
      }
    });
  }
};

export const postHandler = (e, state, post) => {
  const { type, bsTarget } = e.target.dataset;
  // console.dir(e.target);
  // console.dir(e.target.dataset);
  if (type === 'toggleReaded') {
    state.posts.forEach((item) => {
      if (item.id === post.id) {
        item.readed = !item.readed;
      }
    });
  } else if (type === 'toggleFavorite') {
    state.posts.forEach((item) => {
      if (item.id === post.id) {
        item.favorite = !item.favorite;
      }
    });
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

export const postsFilterHandler = (e, state) => {
  if (e.target.name === 'showUnread') {
    state.ui.postsFilter.showUnread = !state.ui.postsFilter.showUnread;
  } else if (e.target.name === 'showFavorite') {
    state.ui.postsFilter.showFavorite = !state.ui.postsFilter.showFavorite;
  }
};
