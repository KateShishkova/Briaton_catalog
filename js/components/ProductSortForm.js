import { RelatedProductForm } from './RelatedProductForm.js';
import { ProductData } from '../helpers/ProductData.js';
import { ComponentFactory } from './ComponentFactory.js';

export class ProductSortForm extends RelatedProductForm {
  _currentSortEl = null;

  constructor(relatedProductList, targetSelectorOrElement, container = document.body) {
    super(relatedProductList, targetSelectorOrElement, container);

    this._initCurrentSortEl();
    this._initSortEls();

    this._provideSelfToRelatedProductList();
  }

  // Accessors.
  set currentSortEl(value) {
    if (value instanceof Element) {
      this._currentSortEl = value;
    }
  }

  get currentSortEl() {
    return this._currentSortEl;
  }

  // Instance methods.
  _provideSelfToRelatedProductList() {
    if (!this.componentEl || !this._relatedProductList) {
      return;
    }

    this._relatedProductList.relatedProductSortForm = this;
  }

  _initCurrentSortEl() {
    if (!this.componentEl) {
      return;
    }

    this.currentSortEl = ComponentFactory.getDomEl('select', this.componentEl);
  }

  _initSortEls() {
    if (!this.componentEl || !this._relatedProductList) {
      return;
    }

    const sortEls = ComponentFactory.getDomEls('select', this.componentEl);

    if (sortEls && sortEls.length > 0) {
      sortEls.forEach(el => {
        el.addEventListener('input', () => {
          this.currentSortEl = el;
          this._relatedProductList.update(this._relatedProductList.currentProducts);
        })
      })
    }
  }

  _getValueByPath(obj, path) {
    if (typeof obj === 'object' && !(Array.isArray(obj)) && typeof path === 'string') {
      return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    }
  }

  getSortedProducts(products, sortEl) {
    if (!this.componentEl || !(ProductData.isProductsArrayValid(products))) {
      return products;
    }

    const sortInfo = sortEl.value;
    let sortBy;
    let isAscending;

    switch (sortInfo) {
      case 'price-min':
        sortBy = 'dataObj.price.new';
        isAscending = true;
        break;

      case 'price-max':
        sortBy = 'dataObj.price.new';
        isAscending = false;
        break;

      case 'rating-max':
        sortBy = 'dataObj.rating';
        isAscending = false;
        break;

      default:
        console.warn(`Отсутствуют правила сортировки для значения ${sortInfo}`, sortEl);
        return products;
    }

    return [...products].sort((a, b) => {
      const aValue = this._getValueByPath(a, sortBy);
      const bValue = this._getValueByPath(b, sortBy);

      if (aValue === bValue) return 0;
      if (isAscending) {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }
}