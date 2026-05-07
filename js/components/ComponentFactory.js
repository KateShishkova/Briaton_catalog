import * as config from '../config.js';

export class ComponentFactory {
  static getDomEl(targetSelectorOrElement, container = document.body) {
    if (targetSelectorOrElement instanceof Element) {
      return targetSelectorOrElement;
    }

    if (!(container instanceof Element)) {
      console.warn('container не является Element, используется document.body');
      container = document.body;
    }

    return container.querySelector(targetSelectorOrElement);
  }

  static getDomEls(targetSelector, container = document.body) {
    if (!(container instanceof Element)) {
      console.warn('container не является Element, используется document.body');
      container = document.body;
    }

    return Array.from(container.querySelectorAll(targetSelector));
  }

  static getSvgEl(iconId, width, height, elClassList = []) {
    const svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    const useEl = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    useEl.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `${config.SVG_SPRITE_PATH}${iconId}`);

    svgEl.append(useEl);

    svgEl.setAttribute('width', width);
    svgEl.setAttribute('height', height);
    svgEl.setAttribute('aria-hidden', true);

    if (Array.isArray(elClassList) && elClassList.length > 0) {
      const elClasses = elClassList.filter(elClass => typeof elClass === 'string');

      if (elClasses.length > 0) {
        elClasses.forEach(elClass => svgEl.classList.add(elClass));
      }
    }

    return svgEl;
  }

  static getEl(tag, elClassList = []) {
    const el = document.createElement(tag);

    if (Array.isArray(elClassList) && elClassList.length > 0) {
      const elClasses = elClassList.filter(elClass => typeof elClass === 'string');

      if (elClasses.length > 0) {
        elClasses.forEach(elClass => el.classList.add(elClass));
      }
    }

    return el;
  }

  static getTextEl(tag, textContent, elClassList = []) {
    const textEl = ComponentFactory.getEl(tag, elClassList);
    textEl.textContent = textContent;

    return textEl;
  }

  static getButtonEl(textContent, type, elClassList = []) {
    const buttonEl = ComponentFactory.getTextEl('button', textContent, elClassList);
    buttonEl.type = type;

    return buttonEl;
  }

  static removeClass(domEl, className) {
    if (!(domEl instanceof Element)) return;

    if (domEl.classList.contains(className)) {
      domEl.classList.remove(className);
    }
  }
}