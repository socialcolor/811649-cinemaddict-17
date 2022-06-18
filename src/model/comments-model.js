import Observable from '../framework/observable.js';

export default class CommentModel extends Observable {
  #filmApiServices = null;
  #comments = [];

  constructor(filmApiServices) {
    super();
    this.#filmApiServices = filmApiServices;
  }

  getСomments = (id) => this.#filmApiServices.getComments(id);

  addComment = (updateType, update) => {
    this.#comments.push(update);

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
