import { Component } from './Component.js';
import { ComponentFactory } from './ComponentFactory.js';
import * as config from '../config.js';

export class Slider extends Component {
  _swiper = null;

  _sliderConfig = null;

  _productListEl = null;
  _productItemEls = null;

  constructor(swiperParams, targetSelectorOrElement, container = document.body) {
    super(targetSelectorOrElement, container);

    this._setSliderConfig();
    this._initSliderList();
    this._initSwiper(swiperParams);
  }

  // Instance methods.
  _setSliderConfig() {
    if (!this.componentEl) {
      return;
    }

    const sliderConfig = config?.SLIDER_CONFIG ?? null;
    
    if (sliderConfig) {
      this._sliderConfig = sliderConfig;
    } else {
      throw new Error(`Ошибка при получении config для Slider`);
    }
  }

  _initSliderList() {
    if (!this.componentEl || !this._sliderConfig) {
      return;
    }

    const productListClass = this._sliderConfig?.productListClass ?? null;
    const productItemClass = this._sliderConfig?.productItemClass ?? null;

    if (!productListClass || !productItemClass) {
      throw new Error(`Ошибка при получении productListClass и productItemClass из sliderConfig`);
    }

    this._productListEl = ComponentFactory.getDomEl(`.${productListClass}`, this.componentEl);
    this._productItemEls = Array.from(this._productListEl.children);

    if (this._productListEl && this._productItemEls && this._productItemEls.length > 0) {
      this._productItemEls.forEach(itemEl => {
        itemEl.classList.add(productItemClass);
      });
    }
  }

  _initSwiper(swiperParams) {
    if (!this.componentEl || typeof swiperParams !== 'object' || Array.isArray(swiperParams)) {
      return;
    }

    if (typeof Swiper !== 'function') {
      throw new Error('swiper.js не подключен');
    }

    this._swiper = new Swiper(this.componentEl, swiperParams);
  }
}