import AbstractView from '../framework/view/abstract-view';
import {RATES} from '../const';

const createRateTemplate = (rate) => {
  let userRate = '';
  if(rate > 0 && rate <= 10) {
    userRate = RATES.NOVICE;
  } else if (rate > 10 && rate <= 20) {
    userRate = RATES.FAN;
  } else if (rate > 20) {
    userRate = RATES.MOVIE_BUFF;
  }

  return `<section class="header__profile profile">
    <p class="profile__rating">${userRate}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};

export default class RateView extends AbstractView {
  #rate = null;

  constructor (rate) {
    super();

    this.#rate = rate;
  }

  get template() {
    return createRateTemplate(this.#rate);
  }
}
