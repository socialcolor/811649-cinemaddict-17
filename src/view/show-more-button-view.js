import AbstractView from '../framework/view/abstract-view';

const createShowMoreButtonTemplate = () => '<button class="films-list__show-more">Show more</button>';

export default class ShowMoreButtonView extends AbstractView {
  get template() {
    return createShowMoreButtonTemplate();
  }

  setShowMoreButtonHandler(callback) {
    this._callback.onShowMoreButtonClick = callback;
    this.element.addEventListener('click', this.#onShowMoreButtonClick);
  }

  #onShowMoreButtonClick = (evt) => {
    evt.preventDefault();
    this._callback.onShowMoreButtonClick();
  };
}
