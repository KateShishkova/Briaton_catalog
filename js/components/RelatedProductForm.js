import { Component } from './Component.js';
import { ProductList } from './ProductList.js';

export class RelatedProductForm extends Component {
  _relatedProductList = null;

  constructor(relatedProductList, targetSelectorOrElement, container = document.body) {
    super(targetSelectorOrElement, container);

    if (this.componentEl && this.componentEl.tagName.toLowerCase() === 'form') {
      this.componentEl.reset();
    }

    if (relatedProductList instanceof ProductList) {
      this._relatedProductList = relatedProductList;
    }
  }
}