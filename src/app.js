import 'bootstrap/js/dist/modal.js';
import i18n from 'i18next';
import { setLocale } from 'yup';

import resources from './locales/index.js';
import view from './view.js';
import { submitHandler, exampleHandler } from './handlers.js';

const app = () => {
  const defaultLanguage = 'en';

  const state = {
    example: null,
    form: {
      valid: false,
      error: null,
    },
    loadingProcess: {
      status: 'idle', // loading, loaded, failed
      error: null,
    },
    feeds: [],
    posts: [],
    modal: {
      postId: '',
    },
    ui: {
      filter: {
        showFavorite: false,
        showUnread: false,
      },
    },
  };

  const elements = {
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

      const { form, example } = elements;

      form.addEventListener('submit', (e) => submitHandler(e, watched));
      example.addEventListener('click', (e) => exampleHandler(e, watched));
    });
};

export default app;
