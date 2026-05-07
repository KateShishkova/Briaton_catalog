import { RelatedProductForm } from './RelatedProductForm.js';
import { ComponentFactory } from './ComponentFactory.js';
import { ProductData } from '../helpers/ProductData.js';
import { ProductList } from './ProductList.js';
import * as config from '../config.js';

export class ProductFilterForm extends RelatedProductForm {
  constructor(relatedProductList, targetSelectorOrElement, container = document.body) {
    super(relatedProductList, targetSelectorOrElement, container);

    this._initResetEvent();
    this._initFilterEls();
  }
  
  // Instance methods.
  initCheckboxCounters(products) {
    if (!this.componentEl || !(ProductData.isProductsArrayValid(products))) {
      return;
    }

    if (!config.CHECKBOX_COUNTER_CONFIG) {
      return;
    }

    const parentSelectors = Object.keys(config.CHECKBOX_COUNTER_CONFIG);
    const parentEls = ComponentFactory.getDomEls(parentSelectors.join(', '), this.componentEl);

    const counterSelectors = Object.values(config.CHECKBOX_COUNTER_CONFIG);

    parentEls.forEach(parent => {
      const checkboxEl = ComponentFactory.getDomEl('[type=checkbox]', parent);
      const counterEl = ComponentFactory.getDomEl(counterSelectors.join(', '), parent);

      if (!checkboxEl || !counterEl) {
        return;
      }

      const countBy = checkboxEl.name;
      const countValue = checkboxEl.value;

      let result = 0;

      products.forEach(product => {
        if (Array.isArray(product.dataObj[countBy])) {
          if (product.dataObj[countBy].includes(countValue)) {
            result++;
          }
        } else if (typeof product.dataObj[countBy] === 'string') {
          if (product.dataObj[countBy] === countValue) {
            result++;
          }
        } else {
          console.warn(`Отсутствуют правила определения количества продуктов для поля ${checkboxEl}`);
        }
      });

      counterEl.textContent = result;
    });
  }

  _initResetEvent() {
    if (!this.componentEl || !this._relatedProductList) {
      return;
    }

    this.componentEl.addEventListener('reset', async () => {
      const validProducts = await ProductList.getValidProducts();

      this._relatedProductList.update(validProducts);
      this.initCheckboxCounters(validProducts);
    })
  }

  _initFilterEls() {
    if (!this.componentEl || !this._relatedProductList) {
      return;
    }

    const filterEls = ComponentFactory.getDomEls('input, select', this.componentEl);

    if (filterEls && filterEls.length > 0) {
      filterEls.forEach(filter => {
        filter.addEventListener('input', async () => {
          this._filterProductList();
        })
      });
    }
  }

  _getFilteredProducts(filterFieldEl, products) {
    if (!this.componentEl || !(ProductData.isProductsArrayValid(products))) {
      return products;
    }

    const filterData = {
      filterBy: filterFieldEl?.name ?? null,
      filterType: filterFieldEl?.type ?? null,
      filterValue: filterFieldEl?.value ?? null,
    }

    const missingFilterProps = [];

    for (const key in filterData) {
      if (filterData[key] === null) {
        missingFilterProps.push(key);
      }
    }

    if (missingFilterProps.length > 0) {
      console.warn(`Отсутствуют следующие данные, необходимые для выполнения фильтрации: ${missingFilterProps.join(', ')}`);
      return products;
    }

    let filteredProducts = [];

    // Checkbox.
    if (filterData.filterType === 'checkbox') {
      const relatedFieldEls = ComponentFactory.getDomEls(`[name=${filterFieldEl.name}]`, this.componentEl);
      const checkedValues = relatedFieldEls.filter(field => field.checked).map(field => field.value);

      if (checkedValues.length === 0) {
        return products;
      }

      filteredProducts = products.filter(product => {
        if (Array.isArray(product.dataObj[filterData.filterBy])) {
          return product.dataObj[filterData.filterBy].some(value => checkedValues.includes(value));
        } else if (typeof product.dataObj[filterData.filterBy] === 'string') {
          return checkedValues.includes(product.dataObj[filterData.filterBy]);
        } else {
          return false;
        }
      });

    // Radio.
    } else if (filterData.filterType === 'radio') {
      const checkedField = ComponentFactory.getDomEl(`[name=${filterFieldEl.name}]:checked`, this.componentEl);
      const checkedValue = checkedField?.value ?? null;

      if (!checkedValue) {
        return products;
      }

      if (filterData.filterBy === 'status') {
        if (checkedValue === 'instock') {
          filteredProducts = products.filter(product => product.isProductAvailable());
        } else if (checkedValue === 'all-item') {
          return products;
        } else {
          console.warn(`Отсутствуют правила фильтрации для поля ${filterFieldEl}`);
          return products;
        }
      }

    // Exeptions.
    } else {
      console.warn(`Отсутствуют правила фильтрации для поля ${filterFieldEl}`);
      return products;
    }

    return filteredProducts;
  }

  async _filterProductList() {
    if (!this.componentEl || !this._relatedProductList) {
      return;
    }

    const validProducts = await ProductList.getValidProducts();

    const formFieldEls = ComponentFactory.getDomEls('input, select', this.componentEl);
    const formFilterEls = formFieldEls.filter((field, index, array) => {
      if (field.type === 'checkbox' || field.type === 'radio') {
        return array.findIndex(el => el.name === field.name && (el.type === 'checkbox' || el.type === 'radio')) === index;
      }
      return true;
    });

    const filteredProducts = formFilterEls.reduce((acc, filterEl) => {
      return this._getFilteredProducts(filterEl, acc);
    }, validProducts);

    this._relatedProductList.update(filteredProducts);
    this.initCheckboxCounters(validProducts);
  }
}