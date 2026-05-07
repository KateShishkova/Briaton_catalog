import { ComponentFactory } from './ComponentFactory.js';
import { StatefulComponent } from './StatefulComponent.js';

export class LocationMenu extends StatefulComponent {
  _locationEl = null;
  _optionEls = null;

  constructor(targetSelectorOrElement, container = document.body) {
    super(targetSelectorOrElement, container);

    this._initLocationComponents();
  }

  // Accessors.
  set locationEl(value) {
    if (value instanceof Element) {
      this._locationEl = value;
    }
  }

  get locationEl() {
    return this._locationEl;
  }

  set optionEls(arr) {
    if (Array.isArray(arr) && arr.every(item => item instanceof Element)) {
      this._optionEls = arr;
    }
  }

  get optionEls() {
    return this._optionEls;
  }

  // Instance methods.
  _initLocationComponents() {
    if (!this.componentEl || !this._componentConfig) {
      return;
    }

    const locationSelector = this._componentConfig?.locationSelector ?? null;
    const optionsSelector = this._componentConfig?.optionsSelector ?? null;

    if (!locationSelector || !optionsSelector) {
      throw new Error(`Ошибка при получении locationSelectors из componentConfig для ${this.constructor.name}`);
    }

    this.locationEl = ComponentFactory.getDomEl(locationSelector, this.componentEl);
    this.optionEls = ComponentFactory.getDomEls(optionsSelector, this.componentEl);

    if (this.locationEl && this.optionEls && this.optionEls.length > 0) {
      this.optionEls.forEach(option => {
        option.addEventListener('click', () => {
          this.locationEl.textContent = option.textContent;
          this.unsetState('active');
        });
      });
    }
  }
}