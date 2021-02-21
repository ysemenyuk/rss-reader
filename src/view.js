/* eslint-disable object-curly-newline */
import onChange from 'on-change';
import i18n from 'i18next';
import { postHandler, feedHandler, postsFilterHandler } from './handlers.js';
import { createFeedElement, createPostElement, createPostsFilter } from './createElements.js';

const renderFormInput = (state, elements) => {
  const { input } = elements;
  input.value = state.form.input;
};

const renderForm = (state, elements) => {
  const { form: { status, error } } = state;
  const { input, submit, feedback, title, description } = elements;

  switch (status) {
    case 'idle':
      title.textContent = i18n.t('title');
      description.textContent = i18n.t('description');
      input.classList.remove('is-invalid');
      feedback.textContent = '';
      break;
    case 'loading':
      feedback.textContent = i18n.t(`feedback.${status}`);
      feedback.classList.remove('text-danger');
      feedback.classList.add('text-success');
      input.classList.remove('is-invalid');
      input.setAttribute('readonly', 'true');
      submit.setAttribute('disabled', 'true');
      break;
    case 'loaded':
    case 'deleted':
      feedback.textContent = i18n.t(`feedback.${status}`);
      feedback.classList.remove('text-danger');
      feedback.classList.add('text-success');
      input.classList.remove('is-invalid');
      input.removeAttribute('readonly');
      submit.removeAttribute('disabled');
      break;
    case 'failed':
      feedback.textContent = i18n.t(`feedback.errors.${error}`);
      feedback.classList.add('text-danger');
      input.classList.add('is-invalid');
      input.removeAttribute('readonly');
      submit.removeAttribute('disabled');
      break;
    default:
      throw new Error(`unknown status: ${status}`);
  }
};

const renderFeeds = (state, elements) => {
  const { feedsContainer } = elements;

  if (state.feeds.length) {
    const feedsList = document.createElement('ul');
    feedsList.classList.add('list-group', 'mb-5');

    state.feeds.forEach((feed) => {
      const feedEl = createFeedElement(feed);
      feedEl.addEventListener('click', (e) => feedHandler(e, state, feed));
      feedsList.prepend(feedEl);
    });

    feedsContainer.innerHTML = '';
    const title = document.createElement('h2');
    title.textContent = i18n.t('feeds.title');

    feedsContainer.append(title);
    feedsContainer.append(feedsList);
  } else {
    feedsContainer.innerHTML = '';
  }
};

const renderPosts = (state, elements) => {
  const { postsContainer } = elements;

  if (state.posts.length !== 0) {
    const postsList = document.createElement('ul');
    postsList.classList.add('list-group', 'mb-5');
    // console.log(state.posts);

    const { showUnread, showFavorite } = state.ui.postsFilter;

    const postsFiltered = [];

    if (showUnread === true && showFavorite === true) {
      state.posts.forEach((post) => {
        if (post.readed === false && post.favorite === true) {
          postsFiltered.push(post);
        }
      });
    } else if (showUnread === true) {
      state.posts.forEach((post) => {
        if (post.readed === false) {
          postsFiltered.push(post);
        }
      });
    } else if (showFavorite === true) {
      state.posts.forEach((post) => {
        if (post.favorite === true) {
          postsFiltered.push(post);
        }
      });
    } else {
      postsFiltered.push(...state.posts);
    }

    postsFiltered.forEach((post) => {
      const postEl = createPostElement(post);
      postEl.addEventListener('click', (e) => postHandler(e, state, post));
      postsList.prepend(postEl);
    });

    postsContainer.innerHTML = '';

    const title = document.createElement('h2');
    title.textContent = i18n.t('posts.title');

    const filter = createPostsFilter(state);
    filter.addEventListener('click', (e) => postsFilterHandler(e, state));

    postsContainer.append(title);
    postsContainer.append(filter);
    postsContainer.append(postsList);
  } else {
    postsContainer.innerHTML = '';
  }
};

const renderModal = (state, elements) => {
  const { modalTitle, modalBody, modalFullArticle } = elements;

  const post = state.posts.find((i) => i.id === state.modal.postId);

  modalTitle.textContent = post.title;
  modalBody.textContent = post.description;
  modalFullArticle.href = post.link;
};

const view = (state, elements) => {
  const watchedState = onChange(state, (path) => {
    console.log('path:', path);
    switch (path) {
      case 'form.status':
      case 'form.error':
        renderForm(watchedState, elements);
        break;
      case 'form.input':
        renderFormInput(watchedState, elements);
        break;
      case 'feeds':
        renderFeeds(watchedState, elements);
        break;
      case 'posts':
      case 'ui.postsFilter.showUnread':
      case 'ui.postsFilter.showFavorite':
        renderPosts(watchedState, elements);
        break;
      case 'modal':
        renderModal(watchedState, elements);
        break;
      default:
        // console.log('unknown path:', path);
    }
  });

  return watchedState;
};

export default view;
