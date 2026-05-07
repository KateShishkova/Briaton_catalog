import { Component } from './Component.js';
import { StatefulComponent } from './StatefulComponent.js';
import { Product } from './Product.js';
import { ComponentFactory } from './ComponentFactory.js';
import * as config from '../config.js';

export class Basket extends StatefulComponent {
  _productListEl = null;
  _productItemClass = null;

  _visibleSelectorsWhenFilled = null;
  _visibleSelectorsWhenEmpty = null;

  _itemCount = 0;
  _counterEl = null;

  _addedProducts = [];

  constructor(targetSelectorOrElement, container = document.body) {
    super(targetSelectorOrElement, container);

    this._setProductList();
    this._setProductItemClass();
    this._setVisibleSelectors();
    this._checkEmpty();
    this._setClearListeners();
  }

  // Accessors.
  set itemCount(value) {
    if (typeof value === 'number' && value >= 0) {
      this._itemCount = value;

      if (this._counterEl) {
        this._counterEl.textContent = this.itemCount;
      }
    }
  }

  get itemCount() {
    return this._itemCount;
  }

  // Instance methods.
  openBasket() {
    this.setState('active');
  }

  closeBasket() {
    this.unsetState('active');
  }

  toggleBasket() {
    this.toggleState('active');
  }

  initBasketCounter(counterEl) {
    if (!this.componentEl || !(counterEl instanceof Element)) {
      return;
    }

    this._counterEl = counterEl;
    this._counterEl.textContent = this.itemCount ?? 0;
  }

  addProduct(product) {
    if (!this.componentEl || !(Array.isArray(this._addedProducts)) || !(product instanceof Product)) {
      return;
    }

    this._addedProducts.push(product);

    const productItem = this._getProductItem(product);
    this._productListEl.append(productItem);

    const removeEl = ComponentFactory.getDomEl('button[data-id], a[data-id]', productItem);
    if (removeEl && removeEl.dataset.id) {
      removeEl.addEventListener('click', () => this._removeProduct(removeEl.dataset.id));
    }

    this.itemCount = this._addedProducts.length;
    this._checkEmpty();
  }

  _removeProduct(id) {
    if (!this.componentEl || !(Array.isArray(this._addedProducts)) || !this._productListEl) {
      return;
    }

    this._addedProducts = this._addedProducts.filter(product => product.dataObj.id !== Number(id));

    const basketItemEls = Array.from(this._productListEl.children);

    basketItemEls.forEach(item => {
      if ((item.dataset.id && item.dataset.id === String(id)) || ComponentFactory.getDomEl(`[data-id="${id}"]`, item)) {
        item.remove();
      }
    });

    this.itemCount = this._addedProducts.length;
    this._checkEmpty();
  }

  _setProductList() {
    if (!this.componentEl || !this._componentConfig) {
      return;
    }

    const productListClass = this._componentConfig?.productListClass ?? null;

    if (productListClass) {
      this._productListEl = ComponentFactory.getDomEl(`.${productListClass}`, this.componentEl);
    }
  }

  _setProductItemClass() {
    if (!this.componentEl || !this._componentConfig) {
      return;
    }

    this._productItemClass = this._componentConfig?.productItemClass ?? null;
  }

  _getProductItem(product) {
    if (!this.componentEl || !this._productListEl || !(product instanceof Product)) {
      return;
    }

    // Collect card data.
    const cardData = {
      id: product.dataObj?.id ?? null,
      name: product.dataObj?.name ?? null,
      image: product.dataObj?.image ?? null,
      price: product.dataObj?.price?.new ?? null,
    }

    const missingProps = [];

    for (const key in cardData) {
      if (cardData[key] === null) {
        missingProps.push(key);
      }
    }

    if (missingProps.length > 0) {
      throw new Error(`Отсутствуют следующие данные, необходимые для добавления продукта в корзину: ${missingProps.join(', ')}`)
    }

    // Card.
    const card = ComponentFactory.getEl('li', [this._productItemClass]);
    card.innerHTML = `
      <div class="basket__img">
        <img src="${cardData.image}" alt="Фотография товара" height="60" width="60">
      </div>
      <span class="basket__name">${cardData.name}</span>
      <span class="basket__price">${cardData.price.toLocaleString('ru-RU')} руб</span>
      <button class="basket__close" type="button" data-id="${cardData.id}">
        <svg class="main-menu__icon" width="24" height="24" aria-hidden="true">
          <use xlink:href="${config.SVG_SPRITE_PATH}icon-close"></use>
        </svg>
      </button>
    `;

    return card;
  }

  _setVisibleSelectors() {
    if (this.componentEl && this._componentConfig) {
      this._visibleSelectorsWhenFilled = this._componentConfig?.visibleSelectorsWhenFilled ?? null;
      this._visibleSelectorsWhenEmpty = this._componentConfig?.visibleSelectorsWhenEmpty ?? null;
    }
  }

  _toggleSelectorsVisibility(selectors, isVisible) {
    if (Array.isArray(selectors)) {
      selectors.forEach(selector => {
        const targetEls = ComponentFactory.getDomEls(selector, this.componentEl);
        targetEls.forEach(el => {
          isVisible ? ComponentFactory.removeClass(el, 'visually-hidden') : el.classList.add('visually-hidden');
        });
      });
    }
  }

  _checkEmpty() {
    if (
      !this.componentEl
      || !(Array.isArray(this._addedProducts))
      || (!this._visibleSelectorsWhenFilled || !(Array.isArray(this._visibleSelectorsWhenFilled)))
      || (!this._visibleSelectorsWhenEmpty || !(Array.isArray(this._visibleSelectorsWhenEmpty)))
    ) {
      return;
    }

    const hasProducts = this._addedProducts.length > 0;

    this._toggleSelectorsVisibility(this._visibleSelectorsWhenFilled, hasProducts);
    this._toggleSelectorsVisibility(this._visibleSelectorsWhenEmpty, !hasProducts);
  }

  _clearBasket() {
    if (!this.componentEl || !this._productListEl || !this._addedProducts) {
      return;
    }

    this._productListEl.innerHTML = '';
    this._addedProducts = [];
    this.itemCount = 0;

    this._checkEmpty();
  }

  _setClearListeners() {
    if (!this.componentEl) {
      return;
    }

    const clearEls = ComponentFactory.getDomEls('button.basket__link--registration, a.basket__link--registration', this.componentEl);

    if (clearEls) {
      clearEls.forEach(el => el.addEventListener('click', () => {
        this._clearBasket();
        this.closeBasket();
      }));
    }
  }
}