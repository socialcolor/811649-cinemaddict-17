import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import {formatDate, formatTime} from '../utils/utils';
import {setScrollPosition, getScrollPosition} from '../utils/film';
import { EMOTIONS } from '../const';

const createFilmDetailsTemplate = (film, filmComments) => {
  const {filmInfo, comments, userDetails, emoji, comment} = film;
  const watchlist = userDetails.watchlist ? 'film-details__control-button--active' : '';
  const alreadyWatched = userDetails.alreadyWatched  ? 'film-details__control-button--active' : '';
  const favorite = userDetails.favorite ? 'film-details__control-button--active' : '';

  const commentText = comment ? comment : '';

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

  const createAddEmojiTemplate = (url) => `<img src="./images/emoji/${url}.png" width="55" height="55" alt="emoji-smile"></img>`;

  const createEmojiTemplate = (currentEmoji) => EMOTIONS.map((emotion) => `<input class="film-details__emoji-item visually-hidden"
   name="comment-emoji" type="radio" id="emoji-${emotion}" value="${emotion}"} ${currentEmoji === emotion ? 'checked': ''}>
     <label class="film-details__emoji-label" for="emoji-${emotion}">
       <img src="./images/emoji/${emotion}.png" width="30" height="30" alt="${emotion}">
     </label>`).join('');

  const comentsTemplate = () => {
    let commentsList = '';
    for(const commentId of comments) {
      commentsList += createCommentTemplate(filmComments.find((it) => it.id === commentId));
    }
    return commentsList;
  };

  const createGenresList = filmInfo.genre.map((genre) => `<span class="film-details__genre">${genre}</span>`).join('');

  const addEmojiTemplate = emoji ? createAddEmojiTemplate(emoji) : '';

  const emojiTemplate = createEmojiTemplate(emoji);

  const genreTitleTemplate = filmInfo.genre.length > 1 ? 'Genres' : 'Genre';

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
                <td class="film-details__term">${genreTitleTemplate}</td>
                <td class="film-details__cell">
                  <span class="film-details__genre">${createGenresList}</span></td>
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
            <div class="film-details__add-emoji-label">${addEmojiTemplate}</div>

            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${commentText}</textarea>
            </label>

            <div class="film-details__emoji-list">${emojiTemplate}</div>
          </div>
        </section>
      </div>
    </form>
  </section>`;
};

export default class FilmDetailsView extends AbstractStatefulView {
  #comments = null;
  #localComment = null;

  constructor (film, comments, localComment) {
    super();
    this.#localComment = localComment;

    this.#comments = comments;

    this._state = FilmDetailsView.parseFilmToState(film);

    this.#setInnerHandler();
    if(localComment) {
      this.#restoreLocalComment();
    }
  }

  get template() {
    return createFilmDetailsTemplate(this._state, this.#comments);
  }

  _restoreHandlers = () => {
    this.#setInnerHandler();
    this.setCloseButtonHandler(this._callback.onCloseButtonClick);
    this.setWatchlistHandler(this._callback.onWatchlistClick);
    this.setWatchedHandler(this._callback.onWatchlistClick);
    this.setFavoriteHandler(this._callback.onFavoriteClick);
  };

  reset = (film) => {
    this.updateElement(
      FilmDetailsView.parseFilmToState(film),
    );
  };

  setCloseButtonHandler (callback) {
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

  #restoreLocalComment = () => {
    this.updateElement({
      emoji: this.#localComment.emoji,
      comment: this.#localComment.comment,
    });

  };

  #setInnerHandler = () => {
    this.element.querySelector('.film-details__comment-input').addEventListener('input', this.#onCommentChange);
    this.element.querySelector('.film-details__emoji-list').addEventListener('click', this.#emojiHandler);
  };

  #emojiHandler = (evt) => {
    if(evt.target.tagName === 'INPUT') {
      const emoji = evt.target.value;
      const scrollPosition = getScrollPosition(this.element);
      this.updateElement({
        emoji: emoji,
      });

      setScrollPosition(this.element, scrollPosition);
    }
  };

  #onCloseButtonClick = (evt) => {
    evt.preventDefault();
    this._callback.onCloseButtonClick();
  };

  #onWatchlistClick = (evt) => {
    evt.preventDefault();
    this._callback.onWatchlistClick(FilmDetailsView.parseStateToFilm(this._state));
  };

  #onWatchedClick = (evt) => {
    evt.preventDefault();
    this._callback.onWatchedClick(FilmDetailsView.parseStateToFilm(this._state));
  };

  #onFavoriteClick = (evt) => {
    evt.preventDefault();
    this._callback.onFavoriteClick(FilmDetailsView.parseStateToFilm(this._state));
  };

  #onCommentChange = (evt) => {
    evt.preventDefault();

    this._setState({
      comment: evt.target.value,
    });
  };

  static parseFilmToState = (film) => ({...film,
    emoji: null,
    comment: null,
  });

  static parseStateToFilm = (state) => {
    const film = {...state};

    return film;
  };
}
