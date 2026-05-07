import { Component } from './Component.js';
import { ComponentFactory } from './ComponentFactory.js';
import * as config from '../config.js';

export class Tooltip extends Component {
  _tooltipConfig = null;

  _tooltipBtnEl = null;
  _tooltipContentEl = null;

  constructor(targetSelectorOrElement, container = document.body) {
    super(targetSelectorOrElement, container);

    this._setTooltipConfig();
    this._initTooltipComponents();
    this._initTippy();
  }

  // Instance methods.
  _setTooltipConfig() {
    if (!this.componentEl) {
      return;
    }

    const tooltipConfig = config?.TOOLTIP_CONFIG ?? null;

    if (tooltipConfig) {
      this._tooltipConfig = tooltipConfig;
    } else {
      throw new Error(`Ошибка при получении config для Tooltip`);
    }
  }

  _initTooltipComponents() {
    if (!this.componentEl || !this._tooltipConfig) {
      return;
    }

    const tooltipBtnSelector = this._tooltipConfig?.btnSelector ?? null;
    const tooltipContentSelector = this._tooltipConfig?.contentSelector ?? null;

    if (!tooltipBtnSelector || !tooltipContentSelector) {
      throw new Error(`Ошибка при получении селекторов для компонентов Tooltip из tooltipConfig`);
    }

    this._tooltipBtnEl = ComponentFactory.getDomEl(tooltipBtnSelector, this.componentEl);
    this._tooltipContentEl = ComponentFactory.getDomEl(tooltipContentSelector, this.componentEl);
  }

  _initTippy() {
    if (!this.componentEl || !this._tooltipBtnEl || !this._tooltipContentEl) {
      return;
    }

    if (typeof tippy !== 'function') {
      throw new Error('tippy.js не подключен');
    }

    tippy(this._tooltipBtnEl, {
      content: this._tooltipContentEl.innerHTML,
      allowHTML: true,
      appendTo: document.body,
    });
  }
}