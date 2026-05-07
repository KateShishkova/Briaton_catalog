import { ComponentFactory } from './ComponentFactory.js';
import { ProductData } from '../helpers/ProductData.js';
import * as config from '../config.js';

export class Product {
  _dataObj = null;

  constructor(productObj) {
    this.dataObj = productObj;
  }

  // Accessors.
  set dataObj(productObj) {
    if (ProductData.isObjectValid(productObj)) {
      this._dataObj = productObj;
    }
  }

  get dataObj() {
    return this._dataObj;
  }

  // Instance methods.
  isProductAvailable() {
    if (!this.dataObj || typeof this.dataObj.availability !== 'object') {
      return false;
    }

    return Object.values(this.dataObj.availability).some(value => value > 0);
  }

  getCard() {
    if (!this.dataObj) {
      return null;
    }

    // Collect card data.
    const cardData = {
      id: this.dataObj?.id ?? null,
      name: this.dataObj?.name ?? null,
      image: this.dataObj?.image ?? null,
      newPrice: this.dataObj?.price?.new ?? null,
      oldPrice: this.dataObj?.price?.old ?? null,
      availability: null,
    }

    if (this.dataObj.availability && typeof this.dataObj.availability === 'object' && !(Array.isArray(this.dataObj.availability))) {
      cardData.availability = {};

      for (const key in this.dataObj.availability) {
        if (config.CITY_NAMES[key]) {
          cardData.availability[config.CITY_NAMES[key]] = this.dataObj.availability[key];
        } else {
          cardData.availability[key] = this.dataObj.availability[key];
          console.warn(`В конфигурации city_names отсутствует ${key}`);
        }
      }
    }

    const missingProps = [];

    for (const key in cardData) {
      if (cardData[key] === null) {
        missingProps.push(key);
      }
    }

    if (missingProps.length > 0) {
      throw new Error(`Отсутствуют следующие данные, необходимые для заполнения карточки товара: ${missingProps.join(', ')}`);
    }

    // Card.
    const card = ComponentFactory.getEl('div', ['product-card']);
    card.innerHTML = `
      <div class="product-card__visual">
        <img class="product-card__img" src="${cardData.image}" height="436" width="290" alt="Изображение товара">
        <div class="product-card__more">
          <a href="#" class="product-card__link btn btn--icon" data-id="${cardData.id}">
            <span class="btn__text">В корзину</span>
            <svg width="24" height="24" aria-hidden="true">
              <use xlink:href="${config.SVG_SPRITE_PATH}icon-basket"></use>
            </svg>
          </a>
          <a href="#" class="product-card__link btn btn--secondary">
            <span class="btn__text">Подробнее</span>
          </a>
        </div>
      </div>
      <div class="product-card__info">
        <h2 class="product-card__title">${cardData.name}</h2>
        <span class="product-card__old">
          <span class="product-card__old-number">${cardData.oldPrice.toLocaleString('ru-RU')}</span>
          <span class="product-card__old-add">₽</span>
        </span>
        <span class="product-card__price">
          <span class="product-card__price-number">${cardData.newPrice.toLocaleString('ru-RU')}</span>
          <span class="product-card__price-add">₽</span>
        </span>
        <div class="product-card__tooltip tooltip">
          <button class="tooltip__btn" aria-label="Показать подсказку">
            <svg class="tooltip__icon" width="5" height="10" aria-hidden="true">
              <use xlink:href="${config.SVG_SPRITE_PATH}icon-i"></use>
            </svg>
          </button>
          <div class="tooltip__content">
            <span class="tooltip__text">Наличие товара по городам:</span>
            <ul class="tooltip__list">
              ${Object.entries(cardData.availability).map(([city, count]) => 
                `<li class="tooltip__item">
                  <span class="tooltip__text">${city}: <span class="tooltip__count">${count.toLocaleString('ru-RU')}</span></span>
                </li>`
              ).join('')}
            </ul>
          </div>
        </div>
      </div>
    `;

    return card;
  }
}