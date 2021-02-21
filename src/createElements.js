/* eslint-disable object-curly-newline */
export const createFeedElement = (feed) => {
  const { added, updated, title, description, id, autoUpdate, showPosts } = feed;
  const autoUpdateChecked = autoUpdate ? 'checked' : '';
  const showPostsChecked = showPosts ? 'checked' : '';
  const feedEl = document.createElement('li');
  feedEl.classList.add('list-group-item');
  feedEl.setAttribute('id', id);
  feedEl.innerHTML = `<h4>${title}</h4>
                        <p>${description}</p>
                        <div class="d-md-block my-1">
                          <p class="was-added my-0 me-3 d-inline">Added: ${added}</p>
                          <p class="last-update my-0 me-3 d-inline">Last update: ${updated}</p>
                          <button class="btn-sm btn-primary me-1" type="button" name="update">Update feed</button>
                          <button class="btn-sm btn-primary me-1" type="button" name="delete">Delete feed</button>
                        </div>
                        <div class="d-md-block my-1">
                          <div class="form-check form-check-inline">
                            <label class="form-check-label">Auto update feed</label>
                            <input class="form-check-input" type="checkbox" name="autoUpdate" ${autoUpdateChecked}>
                          </div>
                          <div class="form-check form-check-inline">
                            <label class="form-check-label">Show posts in posts list</label>
                            <input class="form-check-input" type="checkbox" name="showPosts" ${showPostsChecked}>
                          </div>
  
                        </div>
                        <p class="feed-feedback my-1"></p>`;

  return feedEl;
};

export const createPostsFilter = (state) => {
  const uiFilter = state.ui.postsFilter;
  const { showFavorite, showUnread } = uiFilter;
  const unread = showUnread ? 'checked' : '';
  const favorite = showFavorite ? 'checked' : '';

  const filter = document.createElement('div');
  filter.classList.add('border', 'rounded-1', 'py-2', 'px-3', 'mb-3');
  filter.innerHTML = `<div class="form-check form-check-inline">
                        <label class="form-check-label">Show only favorit posts</label>
                        <i class="bi bi-star-fill"></i>
                        <input class="form-check-input" type="checkbox" name="showFavorite" ${favorite}>
                      </div>
                      <div class="form-check form-check-inline">
                        <label class="form-check-label">Show only unread posts</label>
                        <i class="bi bi-bookmark-check-fill"></i>
                        <input class="form-check-input" type="checkbox" name="showUnread" ${unread}>
                      </div>`;
  return filter;
};

export const createPostElement = (post) => {
  const { title, feedId, id, link, readed, favorite } = post;

  const linkClass = readed ? 'fw-normal font-weight-normal' : 'fw-bold font-weight-bold';
  const iconFavoriteClass = favorite ? 'bi bi-star-fill' : 'bi bi-star';
  const iconReadedClass = readed ? 'bi bi-bookmark-check-fill' : 'bi bi-bookmark';

  const postEl = document.createElement('li');
  postEl.classList.add('list-group-item');
  postEl.setAttribute('feedId', feedId);
  postEl.setAttribute('id', id);

  postEl.innerHTML = `<div class="row">
                        <div class="col-9 d-flex align-items-center">
                          <div class="form-check form-check-inline">
                            <input class="form-check-input" type="checkbox" id="#">
                            <a class="${linkClass}" data-type="readed" href="${link}" target="_blank">
                              ${title}
                            </a>
                          </div>
                        </div>
                        <div class="col-3 d-flex justify-content-evenly">
                          <button class="btn btn-outline-primary btn-sm" data-type="toggleFavorite">
                            <i class="${iconFavoriteClass}" data-type="toggleFavorite"></i>
                          </button>
                          <button class="btn btn-outline-primary btn-sm" data-type="toggleReaded">
                            <i class="${iconReadedClass}" data-type="toggleReaded"></i>
                          </button>
                          <button class="btn btn-primary btn-sm" data-type="readed" type="button" data-bs-toggle="modal" data-bs-target="#modal">
                            Preview
                          </button>
                        </div>
                      </div>`;

  return postEl;
};
