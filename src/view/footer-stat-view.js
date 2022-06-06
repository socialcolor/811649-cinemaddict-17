import AbstractView from '../framework/view/abstract-view';

const createFooterStatTemplate = (count) => (
  `<section class="footer__statistics">
    <p>${count} movies inside</p>
  </section>`);

export default class FooterStatView extends AbstractView {
  #count = null;

  constructor(count) {
    super();
    this.#count = count;
  }

  get template() {
    return createFooterStatTemplate(this.#count);
  }
}
