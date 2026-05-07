import { Component } from './Component.js';
import * as config from '../config.js';
import { ComponentFactory } from './ComponentFactory.js';
import { ProductList } from './ProductList.js';

export class Pagination extends Component {
  _listClass = null;
  _listItemClass = null;
  _listLinkClass = null;

  _relatedProductList = null;

  constructor(relatedProductList, targetSelectorOrElement, container = document.body) {
    super(targetSelectorOrElement, container);

    this._setListClass();
    this._setListItemClass();
    this._setListLinkClass();

    if (relatedProductList instanceof ProductList) {
      this._relatedProductList = relatedProductList;
    }

    this._render(0);
  }

  // Instance methods.
  _setListClass() {
    if (!this.componentEl) {
      return;
    }

    const listClass = Array.from(this.componentEl.classList).find(className => config.PAGINATION_LIST_CLASSES[className]);

    this._listClass = listClass ?? null;
  }

  _setListItemClass() {
    if (!this.componentEl || !this._listClass) {
      return;
    }

    this._listItemClass = config?.PAGINATION_LIST_CLASSES?.[this._listClass]?.listItemClass ?? null;
  }

  _setListLinkClass() {
    if (!this.componentEl || !this._listClass) {
      return;
    }

    this._listLinkClass = config?.PAGINATION_LIST_CLASSES?.[this._listClass]?.listLinkClass ?? null;
  }

  _render(totalItems) {
    if (!this.componentEl || typeof totalItems !== 'number') {
      return;
    }

    const listEl = this.componentEl;
    listEl.innerHTML = '';

    if (totalItems <= 1) {
      return;
    }

    if (totalItems > 1) {
      for (let i = 1; i <= totalItems; i++) {
        const liEl = ComponentFactory.getEl('li', [this._listItemClass]);

        const btnEl = ComponentFactory.getButtonEl(i, 'button', [this._listLinkClass]);
        if (this._relatedProductList) {
          btnEl.addEventListener('click', () => {
            this._relatedProductList.update(this._relatedProductList.currentProducts, i);
          });
        }

        liEl.append(btnEl);
        listEl.append(liEl);
      }
    }
  }

  getPaginatedItems(items, itemsPerPage, targetPage) {
    if (
      (!(Array.isArray(items)) || items.length === 0)
      || (typeof itemsPerPage !== 'number' || itemsPerPage <= 0)
      || (typeof targetPage !== 'number' || targetPage <= 0)
    ) {
      this._render(0);
      return [];
    }

    const totalPages = Math.ceil(items.length / itemsPerPage);
    const page = targetPage > totalPages ? totalPages : targetPage;

    const start = itemsPerPage * (page - 1);
    const end = start + itemsPerPage;

    this._render(totalPages);
    return items.slice(start, end);
  }
}