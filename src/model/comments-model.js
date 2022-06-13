import Observable from '../framework/observable.js';
import {generateComments} from '../mock/film';

export default class CommentModel extends Observable {
  #comments = generateComments();

  get comments() {
    return this.#comments;
  }

  addComment = (updateType, update) => {
    this.#comments = [
      update,
      ...this.#comments,
    ];

    this._notify(updateType, update);
  };

  deleteComment = (updateType, update) => {
    const index = this.#comments.findIndex((comment) => Number(comment.id) === Number(update));

    if (index === -1) {
      throw new Error('Can\'t delete unexisting task');
    }

    this.#comments.splice(index, 1);

    this._notify(updateType);
  };
}
