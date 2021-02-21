import 'bootstrap/js/dist/modal.js';
import i18n from 'i18next';
import { setLocale } from 'yup';

import resources from './locales/index.js';
import view from './view.js';
import { inputHandler, submitHandler, exampleHandler } from './handlers.js';

const app = () => {
  const defaultLanguage = 'en';

  const state = {
    form: {
      input: null,
      status: 'idle', // loading, loaded, failed
      error: null,
    },
    feeds: [],
    posts: [],
    modal: {
      postId: '',
    },
    ui: {
      feed: {
        hidePosts: false,
      },
      postsFilter: {
        showFavorite: false,
        showUnread: false,
      },
    },
  };

  const elements = {
    title: document.querySelector('h1'),
    description: document.querySelector('.lead'),
    form: document.querySelector('form'),
    input: document.querySelector('[name="url"]'),
    submit: document.querySelector('[type="submit"]'),
    feedback: document.querySelector('.feedback'),
    example: document.querySelector('#example'),
    feedsContainer: document.querySelector('.feeds'),
    postsContainer: document.querySelector('.posts'),
    modal: document.querySelector('#modal'),
    modalTitle: document.querySelector('.modal-title'),
    modalBody: document.querySelector('.modal-body'),
    modalFullArticle: document.querySelector('.full-article'),
  };

  setLocale({
    string: {
      url: 'validUrl',
    },
    mixed: {
      required: 'required',
      notOneOf: 'existing',
    },
  });

  const i18nOptions = {
    lng: defaultLanguage,
    debug: false,
    resources,
  };

  i18n.init(i18nOptions)
    .then(() => {
      const watched = view(state, elements);

      const { form, input, example } = elements;

      form.addEventListener('submit', (e) => submitHandler(e, watched));
      input.addEventListener('input', (e) => inputHandler(e, watched));
      example.addEventListener('click', (e) => exampleHandler(e, watched));
    });
};

export default app;
