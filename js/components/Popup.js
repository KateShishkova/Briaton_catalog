import { ComponentFactory } from './ComponentFactory.js';

export class Popup {
  _popupEl = null;
  _popupWrapperEl = null;

  constructor(popupClasslist = ['popup']) {
    this._createPopup(popupClasslist);
  }

  // Instance methods.
  _createPopup(popupClasslist) {
    const popupEl = ComponentFactory.getEl('dialog', popupClasslist);
    popupEl.addEventListener('cancel', (e) => {
      e.stopPropagation();
      this._removePopup();
    });
    popupEl.addEventListener('click', ({ currentTarget, target }) => {
      this._popupEl = currentTarget;
      const isClickedOnBackDrop = target === this._popupEl;
      if (isClickedOnBackDrop) {
        this._removePopup();
      }
    });

    const popupWrapperEl = ComponentFactory.getEl('div', ['popup__wrapper']);
    popupEl.append(popupWrapperEl);

    const closeBtnEl = ComponentFactory.getButtonEl('', 'button', ['popup__close']);
    const closeIconEl = ComponentFactory.getSvgEl('icon-close', '24', '24', ['popup__icon']);
    closeBtnEl.append(closeIconEl);
    closeBtnEl.addEventListener('click', () => {
      this._removePopup();
    });
    popupEl.append(closeBtnEl);

    this._popupEl = popupEl;
    this._popupWrapperEl = popupWrapperEl;
  }

  _removePopup() {
    if (!this._popupEl) {
      return;
    }

    this._popupEl.remove();
    ComponentFactory.removeClass(document.body, 'scroll-lock');
  }

  addContent(...content) {
    if (!this._popupWrapperEl) {
      return;
    }

    this._popupWrapperEl.innerHTML = '';
    this._popupWrapperEl.append(...content);
  }

  showPopup() {
    if (!this._popupEl) {
      return;
    }

    if (!(document.body.contains(this._popupEl))) {
      document.body.append(this._popupEl);
    }
    
    this._popupEl.showModal();
    document.body.classList.add('scroll-lock');
  }
}