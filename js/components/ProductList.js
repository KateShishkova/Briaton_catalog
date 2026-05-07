import { ComponentFactory } from './ComponentFactory.js';
import { Component } from './Component.js';
import { Product } from './Product.js';
import { ProductData } from '../helpers/ProductData.js';
import * as config from '../config.js';
import { MockApi } from '../api/MockApi.js';
import { ProductSortForm } from './ProductSortForm.js';
import { Basket } from './Basket.js';
import { Pagination } from './Pagination.js';
import { Tooltip } from './Tooltip.js';

export class ProductList extends Component {
  _currentProducts = null;
  _listClass = null;
  _listItemClass = null;

  _relatedPagination = null;
  _productsPerPage = 6;

  _relatedProductSortForm = null;
  _relatedBasket = null;

  constructor(targetSelectorOrElement, container = document.body) {
    super(targetSelectorOrElement, container);

    this._setListClass();
    this._setListItemClass();
    this._initPagination();
  }

  // Accessors.
  set currentProducts(value) {
    if (ProductData.isProductsArrayValid(value)) {
      this._currentProducts = value;
    }
  }

  get currentProducts() {
    return this._currentProducts;
  }

  set relatedProductSortForm(value) {
    if (value instanceof ProductSortForm) {
      this._relatedProductSortForm = value;
    }
  }

  get relatedProductSortForm() {
    return this._relatedProductSortForm;
  }

  set relatedBasket(value) {
    if (value instanceof Basket) {
      this._relatedBasket = value;
    }
  }

  get relatedBasket() {
    return this._relatedBasket;
  }

  // Instance methods.
  _setListClass() {
    if (!this.componentEl) {
      return;
    }

    const listClass = Array.from(this.componentEl.classList).find(className => config.PRODUCT_LIST_CONFIG[className]);

    this._listClass = listClass ?? null;
  }

  _setListItemClass() {
    if (!this.componentEl || !this._listClass) {
      return;
    }

    this._listItemClass = config.PRODUCT_LIST_CONFIG?.[this._listClass]?.listItemClass ?? null;
  }

  _initPagination() {
    if (!this.componentEl || !this._listClass) {
      return;
    }

    const paginationClass = config?.PRODUCT_LIST_CONFIG?.[this._listClass]?.paginationListClass ?? null;

    if (!paginationClass) {
      return;
    }

    const paginationEl = ComponentFactory.getDomEl(`.${paginationClass}`, this.componentEl.parentElement);

    if (paginationEl) {
      this._relatedPagination = new Pagination(this, paginationEl);
    }
  }

  getProduct(id) {
    return this.currentProducts?.find(product => product.dataObj.id === id) ?? null;
  }

  setBasketListeners() {
    if (!this.componentEl || !this.relatedBasket || !this._listClass) {
      return;
    }

    const addBasketSelector = config?.PRODUCT_LIST_CONFIG?.[this._listClass]?.addBasketSelector ?? null;

    if (!addBasketSelector) {
      return;
    }

    const addBasketEls = ComponentFactory.getDomEls(addBasketSelector, this.componentEl);

    addBasketEls.forEach(el => {
      el.addEventListener('click', () => {
        const product = this.getProduct(Number(el.dataset.id));
        if (product) {
          this.relatedBasket.addProduct(product);
        }
      })
    });
  }

  setTooltip() {
    if (!this.componentEl) {
      return;
    }

    try {
      const tooltipSelector = config?.TOOLTIP_CONFIG?.componentSelector ?? null;

      if (!tooltipSelector) {
        throw new Error('Ошибка при получении componentSelector из config для компонента Tooltip');
      }

      const tooltipEls = ComponentFactory.getDomEls(tooltipSelector, this.componentEl);
      tooltipEls.forEach(el => {
        new Tooltip(el);
      });

    } catch (error) {
      console.error(error);
    }
  }

  render(products, currentPage = 1) {
    if (!this.componentEl) {
      return;
    }

    const listEl = this.componentEl;
    listEl.innerHTML = '';

    this.currentProducts = products;

    if (this.relatedProductSortForm && this.relatedProductSortForm.currentSortEl) {
      this.currentProducts = this.relatedProductSortForm.getSortedProducts(this.currentProducts, this.relatedProductSortForm.currentSortEl);
    }

    if (this.currentProducts) {
      if (this._relatedPagination) {
        const paginatedProducts = this._relatedPagination.getPaginatedItems(this.currentProducts, this._productsPerPage, currentPage);

        paginatedProducts.forEach(product => {
          const listItemEl = ComponentFactory.getEl('li', [this._listItemClass]);
          listItemEl.append(product.getCard());
          listEl.append(listItemEl);
        });
      } else {
        this.currentProducts.forEach(product => {
          const listItemEl = ComponentFactory.getEl('li', [this._listItemClass]);
          listItemEl.append(product.getCard());
          listEl.append(listItemEl);
        });
      }
    }
  }

  update(products, currentPage = 1) {
    this.render(products, currentPage);
    this.setBasketListeners();
    this.setTooltip();
  }

  // Static methods.
  static async getValidProducts() {
    const products = await MockApi.getProducts();
    const validProducts = [];

    products.forEach(obj => {
      try {
        validProducts.push(new Product(obj));
      } catch(error) {
        console.error(`Ошибка при создании экземпляра класса Product. ${error.message}`);
      }
    });

    return validProducts;
  }
}