import {createElement} from '../render';
import {formatDate} from '../utils';

const createCommentsTmplate = (comments) => {
  const {author, comment, date, emotion} = comments;

  return  `
  <li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
    </span>
    <div>
      <p class="film-details__comment-text">${comment}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${author}</span>
        <span class="film-details__comment-day">${formatDate(date, 0, 100, 'YYYY/MM/DD HH:mm')}</span>
        <button class="film-details__comment-delete">Delete</button>
      </p>
    </div>
  </li>`;
};

export default class FilmCommentsView {
  constructor (comment) {
    this.comment = comment;
  }

  getTemplate() {
    return createCommentsTmplate(this.comment);
  }

  getElement() {
    if(!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
