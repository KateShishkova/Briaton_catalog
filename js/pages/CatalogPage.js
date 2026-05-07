import { ComponentFactory } from '../components/ComponentFactory.js';
import { StatefulComponent } from '../components/StatefulComponent.js';
import { BurgerMenu } from '../components/BurgerMenu.js';
import { LocationMenu } from '../components/LocationMenu.js';
import { ProductList } from '../components/ProductList.js';
import { ProductFilterForm } from '../components/ProductFilterForm.js';
import { ProductSortForm } from '../components/ProductSortForm.js';
import { Basket } from '../components/Basket.js';
import { Accordion } from '../components/Accordion.js';
import { Slider } from '../components/Slider.js';
import { Form } from '../components/Form.js';
import * as config from '../config.js';

export class CatalogPage {
  _headerEl = null;
  _catalogSectionEl = null;
  _dayProductsSectionEl = null;
  _faqSectionEl = null;
  _questionsSectionEl = null;

  _basketInstance = null;

  constructor() {
    this._headerEl = ComponentFactory.getDomEl('header');

    this._catalogSectionEl = ComponentFactory.getDomEl('.catalog');
    this._dayProductsSectionEl = ComponentFactory.getDomEl('.day-products');
    this._faqSectionEl = ComponentFactory.getDomEl('.faq');
    this._questionsSectionEl = ComponentFactory.getDomEl('.questions');
  }

  // Instance methods.
  async init() {
    this._initHeader();

    await this._initCatalogSection();
    await this._initDayProductsSection();
    this._initFaqSection();
    this._initQuestionsSection();
  }

  _initHeader() {
    if (!this._headerEl) {
      return;
    }

    // BurgerMenu.
    try {
      const burgerMenuConfig = StatefulComponent.getConfig('BurgerMenu');

      const burgerMenu = new BurgerMenu(burgerMenuConfig.componentSelector, this._headerEl);

      const burgerMenuExternalController = ComponentFactory.getDomEl('.header__catalog-btn', this._headerEl);
      if (burgerMenuExternalController) {
        burgerMenuExternalController.addEventListener('click', () => {
          burgerMenu.toggleMenu();
        })
      }
    } catch (error) {
      console.error(error);
    }

    // LocationMenu.
    try {
      const locationMenuConfig = StatefulComponent.getConfig('LocationMenu');
      const locationMenu = new LocationMenu(locationMenuConfig.componentSelector, this._headerEl);
    } catch (error) {
      console.error(error);
    }

    // Basket.
    try {
      const basketConfig = StatefulComponent.getConfig('Basket');

      const basket = new Basket(basketConfig.componentSelector, this._headerEl);
      this._basketInstance = basket;

      const basketExternalController = ComponentFactory.getDomEl('.header__user-btn--basket', this._headerEl);
      if (basketExternalController) {
        basketExternalController.addEventListener('click', () => {
          basket.toggleBasket();
        })
      }

      const basketCounterEl = ComponentFactory.getDomEl('.header__user-count', basketExternalController);
      if (basketCounterEl) {
        basket.initBasketCounter(basketCounterEl);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async _initCatalogSection() {
    if (!this._catalogSectionEl) {
      return;
    }

    // CatalogList.
    try {
      const validProducts = await ProductList.getValidProducts();

      const catalogList = new ProductList('.catalog__list', this._catalogSectionEl);
      catalogList.relatedBasket = this._basketInstance;

      // FilterForm.
      try {
        const filterForm = new ProductFilterForm(catalogList, '.catalog-form', this._catalogSectionEl);
        filterForm.initCheckboxCounters(validProducts);
      } catch (error) {
        console.error(error);
      }

      // SortForm.
      try {
        const sortForm = new ProductSortForm(catalogList, '.catalog__sort', this._catalogSectionEl);
      } catch (error) {
        console.error(error);
      }

      catalogList.update(validProducts);

    } catch (error) {
      console.error(error);
    }
  }

  async _initDayProductsSection() {
    if (!this._dayProductsSectionEl) {
      return;
    }

    // SliderList.
    try {
      const validProducts = await ProductList.getValidProducts();

      const dayProducts = validProducts.filter(product => {
        return product.dataObj.goodsOfDay;
      });

      const dayProductsList = new ProductList('.day-products__list', this._dayProductsSectionEl);
      dayProductsList.relatedBasket = this._basketInstance;

      dayProductsList.update(dayProducts);

    } catch (error) {
      console.error(error);
    }

    // Slider.
    try {
      const sliderSelector = config?.SLIDER_CONFIG?.componentSelector ?? null;

      if (!sliderSelector) {
        throw new Error('Ошибка при получении componentSelector из config для компонента Slider');
      }

      const swiperParams = {
        slidesPerView: 4,
        spaceBetween: 40,
      }

      const nextEl = ComponentFactory.getDomEl('.day-products__navigation-btn--next', this._dayProductsSectionEl);
      const prevEl = ComponentFactory.getDomEl('.day-products__navigation-btn--prev', this._dayProductsSectionEl);

      if (nextEl && prevEl) {
        swiperParams.navigation = { nextEl, prevEl };
      }
      
      const slider = new Slider(swiperParams, sliderSelector, this._dayProductsSectionEl);

    } catch (error) {
      console.error(error);
    }
  }

  _initFaqSection() {
    if (!this._faqSectionEl) {
      return;
    }

    // Accordion.
    try {
      const accordion = new Accordion('.accordion', this._faqSectionEl);
    } catch (error) {
      console.error(error);
    }
  }

  _initQuestionsSection() {
    if (!this._questionsSectionEl) {
      return;
    }

    // Form.
    try {
      const feedbackForm = new Form('.questions__form', this._questionsSectionEl);
    } catch (error) {
      console.error(error);
    }
  }
}