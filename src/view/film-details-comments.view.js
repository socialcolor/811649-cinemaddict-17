import AbstractView from '../framework/view/abstract-view';
import {formatDate} from '../utils/utils';

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

export default class FilmDetailsCommentsView extends AbstractView {
  #comment = null;

  constructor (comment) {
    super();
    this.comment = comment;
  }

  get template() {
    return createCommentsTmplate(this.comment);
  }
}
