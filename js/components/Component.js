import { ComponentFactory } from './ComponentFactory.js';

export class Component {
  _componentEl = null;

  constructor(targetSelectorOrElement, container = document.body) {
    if (new.target === Component) {
      throw new Error('Ошибка при создании экземпляра абстрактного класса Component');
    }

    this.componentEl = ComponentFactory.getDomEl(targetSelectorOrElement, container);
    this._validateComponentEl(targetSelectorOrElement, container);
  }

  // Accessors.
  set componentEl(value) {
    if (value instanceof Element) {
      this._componentEl = value;
    }
  }

  get componentEl() {
    return this._componentEl;
  }

  // Instance methods.
  _validateComponentEl(targetSelectorOrElement, container) {
    if (!this.componentEl) {
      let containerInfo = '';

      if (container instanceof Element) {
        containerInfo = container.tagName.toLowerCase();
        if (container.id) containerInfo += `#${container.id}`;
        if (container.className) containerInfo += `.${container.className.split(' ').join('.')}`;
      } else {
        containerInfo = 'body';
      }

      throw new Error(`Элемент с селектором '${targetSelectorOrElement}' не найден в ${containerInfo}`);
    }
  }
}