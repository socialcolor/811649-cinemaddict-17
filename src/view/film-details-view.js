import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import {formatDate, formatTime} from '../utils/utils';
import {setScrollPosition} from '../utils/film';

const createFilmDetailsTemplate = (film, filmComments) => {
  const {filmInfo, comments, userDetails, emoji, comment} = film;

  const watchlist = userDetails.watchlist ? 'film-details__control-button--active' : '';
  const alreadyWatched = userDetails.alreadyWatched  ? 'film-details__control-button--active' : '';
  const favorite = userDetails.favorite ? 'film-details__control-button--active' : '';

  const commentText = comment ? comment : '';

  const createEmojiTemplate = (url) => `<img src="./images/emoji/${url}.png" width="55" height="55" alt="emoji-smile"></img>`;
  const emojiTemplate = emoji ? createEmojiTemplate(emoji) : '';

  const createCommentTemplate = (data) => (`<li class="film-details__comment">
     <span class="film-details__comment-emoji">
       <img src="./images/emoji/${data.emotion}.png" width="55" height="55" alt="emoji-${data.emotion}">
     </span>
     <div>
       <p class="film-details__comment-text">${data.comment}</p>
       <p class="film-details__comment-info">
         <span class="film-details__comment-author">${data.author}</span>
         <span class="film-details__comment-day">${formatDate(data.date, 'YYYY/MM/DD HH:mm')}</span>
         <button class="film-details__comment-delete">Delete</button>
       </p>
     </div>
   </li>`);

  const comentsTemplate = () => {
    let commentsList = '';
    for(let i = 0; i < comments.length; i++) {
      const commentsId = comments[i];
      commentsList += createCommentTemplate(filmComments[commentsId]);
    }
    return commentsList;
  };

  return  `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="./images/posters/${filmInfo.poster}" alt="">

            <p class="film-details__age">${filmInfo.ageRating}+</p>
          </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${filmInfo.title}</h3>
                <p class="film-details__title-original">Original: ${filmInfo.alternativeTitle}</p>
              </div>

              <div class="film-details__rating">
                <p class="film-details__total-rating">${filmInfo.rate}</p>
              </div>
            </div>

            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${filmInfo.director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${filmInfo.writers}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${filmInfo.actors}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${formatDate(filmInfo.release.date, 'DD MMMM YYYY')}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${formatTime(filmInfo.runtime)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${filmInfo.release.releaseCountry}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Genres</td>
                <td class="film-details__cell">
                  <span class="film-details__genre">${filmInfo.genre}</span></td>
              </tr>
            </table>

            <p class="film-details__film-description">
            ${filmInfo.description}
            </p>
          </div>
        </div>

        <section class="film-details__controls">
          <button type="button" class="film-details__control-button film-details__control-button--watchlist ${watchlist}" data-name="watchlist" id="watchlist" name="watchlist">Add to watchlist</button>
          <button type="button" class="film-details__control-button film-details__control-button--watched ${alreadyWatched}" data-name="alreadyWatched" id="watched" name="watched">Already watched</button>
          <button type="button" class="film-details__control-button film-details__control-button--favorite ${favorite}" data-name="favorite" id="favorite" name="favorite">Add to favorites</button>
        </section>
      </div>

      <div class="film-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

          <ul class="film-details__comments-list">
          ${comentsTemplate()}
          </ul>

          <div class="film-details__new-comment">
            <div class="film-details__add-emoji-label">${emojiTemplate}</div>

            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${commentText}</textarea>
            </label>

            <div class="film-details__emoji-list">
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile" ${emoji === 'smile' ? 'checked' : ''}>
              <label class="film-details__emoji-label" for="emoji-smile">
                <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping" ${emoji === 'sleeping' ? 'checked' : ''}>
              <label class="film-details__emoji-label" for="emoji-sleeping">
                <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke" ${emoji === 'puke' ? 'checked' : ''}>
              <label class="film-details__emoji-label" for="emoji-puke">
                <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry" ${emoji === 'angry' ? 'checked' : ''}>
              <label class="film-details__emoji-label" for="emoji-angry">
                <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
              </label>
            </div>
          </div>
        </section>
      </div>
    </form>
  </section>`;
};

export default class FilmDetailsView extends AbstractStatefulView {
  #comments = null;
  #scrollPosition = null;

  constructor (film, comments) {
    super();
    this.#comments = comments;

    this._state = FilmDetailsView.parseFilmToState(film);

    this.#setInnerHandler();
  }

  get template() {
    return createFilmDetailsTemplate(this._state, this.#comments);
  }

  #onCloseButtonClick = (evt) => {
    evt.preventDefault();
    this._callback.onCloseButtonClick();
  };

  #onWatchlistClick = (evt) => {
    evt.preventDefault();
    const scrollPostion = this.#getScrollPosituin();
    this._callback.onWatchlistClick(scrollPostion);
  };

  #onWatchedClick = (evt) => {
    evt.preventDefault();
    this._callback.onWatchedClick();
  };

  #onFavoriteClick = (evt) => {
    evt.preventDefault();
    this._callback.onFavoriteClick();
  };

  #commentHandler = (evt) => {
    evt.preventDefault();

    this._setState({
      comment: evt.target.value,
    });
  };

  #emojiHandler = (evt) => {
    if(evt.target.tagName === 'INPUT') {
      const emoji = evt.target.value;
      const scroll = this.#getScrollPosituin();
      this.updateElement({
        emoji: emoji,
      });

      setScrollPosition(this.element, scroll);
    }
  };

  #getScrollPosituin = () => (this.#scrollPosition = this.element.scrollTop);

  _restoreHandlers = () => {
    this.#setInnerHandler();
    this.seCloseButtonHandler(this._callback.onCloseButtonClick);
    this.setWatchlistHandler(this._callback.onWatchlistClick);
    this.setWatchedHandler(this._callback.onWatchlistClick);
    this.setFavoriteHandler(this._callback.onFavoriteClick);
  };

  #setInnerHandler = () => {
    this.element.querySelector('.film-details__comment-input').addEventListener('input', this.#commentHandler);
    this.element.querySelector('.film-details__emoji-list').addEventListener('click', this.#emojiHandler);
  };

  seCloseButtonHandler (callback) {
    this._callback.onCloseButtonClick = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#onCloseButtonClick);
  }

  setWatchlistHandler(callback) {
    this._callback.onWatchlistClick = callback;
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#onWatchlistClick);
  }

  setWatchedHandler(callback) {
    this._callback.onWatchedClick = callback;
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#onWatchedClick);
  }

  setFavoriteHandler(callback) {
    this._callback.onFavoriteClick = callback;
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#onFavoriteClick);
  }

  static parseFilmToState = (films) => ({...films,
    emoji: null,
    comment: null,
  });
}
