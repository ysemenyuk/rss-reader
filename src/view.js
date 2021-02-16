import onChange from 'on-change';
import i18n from 'i18next';
import { postHandler, feedHandler, postsFilterHandler } from './handlers.js';
import { createFeedElement, createPostElement, createPostsFilter } from './createElements.js';

const renderExample = (state, elements) => {
  const { input } = elements;
  input.value = state.example;
};

const renderLoadingProcess = (state, elements) => {
  const { loadingProcess: { status, error } } = state;
  const { input, submit, feedback } = elements;

  switch (status) {
    case 'loading':
      feedback.textContent = i18n.t(`feedback.${status}`);
      feedback.classList.add('text-success');
      input.classList.remove('is-invalid');
      input.setAttribute('readonly', 'true');
      submit.setAttribute('disabled', 'true');
      break;
    case 'loaded':
    case 'deleted':
      feedback.textContent = i18n.t(`feedback.${status}`);
      feedback.classList.add('text-success');
      input.value = '';
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
      break;
  }
};

const renderForm = (state, elements) => {
  const { form: { valid, error } } = state;
  const { input, feedback } = elements;

  switch (valid) {
    case true:
      feedback.textContent = '';
      feedback.classList.remove('text-success');
      feedback.classList.remove('text-danger');
      input.classList.remove('is-invalid');
      break;
    case false:
      feedback.textContent = i18n.t(`feedback.errors.${error}`);
      feedback.classList.remove('text-success');
      feedback.classList.add('text-danger');
      input.classList.add('is-invalid');
      break;
    default:
      break;
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

  if (state.posts.length) {
    const postsList = document.createElement('ul');
    postsList.classList.add('list-group', 'mb-5');
    console.log(state.posts);

    state.posts.forEach((post) => {
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
      case 'form':
        renderForm(watchedState, elements);
        break;
      case 'loadingProcess':
        renderLoadingProcess(watchedState, elements);
        break;
      case 'feeds':
        renderFeeds(watchedState, elements);
        break;
      case 'posts':
        renderPosts(watchedState, elements);
        break;
      case 'modal':
        renderModal(watchedState, elements);
        break;
      case 'example':
        renderExample(watchedState, elements);
        break;
      default:
        // console.log('unknown path:', path);
    }
  });

  return watchedState;
};

export default view;
