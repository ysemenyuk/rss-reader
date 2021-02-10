/* eslint-disable object-curly-newline */
export const createFeedElement = (feed) => {
  const { added, updated, title, description, id, autoUpdate } = feed;
  const checked = autoUpdate ? 'checked' : '';
  const feedEl = document.createElement('li');
  feedEl.classList.add('list-group-item');
  feedEl.innerHTML = `<h4>${title}</h4>
                        <p>${description}</p>
                        <div class="d-md-block">
                          <p class="was-added my-0 me-3 d-inline">Was added: ${added}</p>
                          <p class="last-update my-0 me-3 d-inline">Last update: ${updated}</p>
                          <div class="form-check form-check-inline">
                            <label class="form-check-label" for="inlineCheckbox${id}">Auto update feed</label>
                            <input class="form-check-input" type="checkbox" ${checked} id="#${id}">
                          </div>
                          <button class="btn-sm btn-primary me-1" type="button" name="update">Update feed</button>
                          <button class="btn-sm btn-primary me-1" type="button" name="delete">Delete feed</button>
                        </div>
                        <p class="feed-feedback my-1"></p>`;

  return feedEl;
};

export const createPostElement = (post) => {
  const { title, id, link, readed } = post;
  const className = readed ? 'fw-normal font-weight-normal' : 'fw-bold font-weight-bold';

  const postEl = document.createElement('li');
  postEl.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start');

  postEl.innerHTML = `<a class=${className} data-post-id=${id} href=${link} target="_blank">${title}</a>
                      <button class="btn btn-primary btn-sm" data-post-id=${id} type="button" data-bs-toggle="modal" data-bs-target="#modal">Preview</button>`;

  return postEl;
};
