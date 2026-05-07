import { Component } from './Component.js';
import { ComponentFactory } from './ComponentFactory.js';
import * as config from '../config.js';

export class StatefulComponent extends Component {
  _componentConfig = null;
  _stateClasses = null;
  
  _controllerFn = null;

  _controllerEl = null;
  _stateToggleEl = null;

  constructor(targetSelectorOrElement, container = document.body) {
    super(targetSelectorOrElement, container);

    this._componentConfig = StatefulComponent.getConfig(this.constructor.name);
    this._stateClasses = StatefulComponent.getStateClasses(this.constructor.name);

    this._controllerFn = () => this.toggleState('active');

    this._initStateToggleEl();
    this._initControllerEl();
  }

  // Accessors.
  set controllerEl(value) {
    if (value instanceof Element) {
      this._controllerEl = value;
    }
  }

  get controllerEl() {
    return this._controllerEl;
  }

  set stateToggleEl(value) {
    if (value instanceof Element) {
      this._stateToggleEl = value;
    }
  }

  get stateToggleEl() {
    return this._stateToggleEl;
  }

  // Instance methods.
  _initStateToggleEl() {
    if (this.componentEl && this._stateClasses) {
      if (this.componentEl.classList.contains(this._stateClasses.default)) {
        this.stateToggleEl = this.componentEl;
      } else {
        this.stateToggleEl = ComponentFactory.getDomEl(`.${this._stateClasses.default}`, this.componentEl);
      }
    }
  }

  _initControllerEl() {
    const controllerSelector = this._componentConfig?.controllerSelector ?? null;

    this.controllerEl = ComponentFactory.getDomEl(controllerSelector, this.componentEl);
    if (this.controllerEl) {
      this.controllerEl.addEventListener('click', () => {
        this._controllerFn();
      });
    }
  }

  hasStateClass(state) {
    return this._stateClasses && this._stateClasses[state];
  }

  setState(state) {
    if (this.stateToggleEl && this.hasStateClass(state)) {
      this.stateToggleEl.classList.add(this._stateClasses[state]);
    }
  }

  unsetState(state) {
    if (this.stateToggleEl && this.hasStateClass(state)) {
      ComponentFactory.removeClass(this.stateToggleEl, this._stateClasses[state]);
    }
  }

  toggleState(state) {
    if (this.stateToggleEl && this.hasStateClass(state)) {
      this.stateToggleEl.classList.toggle(this._stateClasses[state]);
    }
  }

  isState(state) {
    return this.stateToggleEl && this.hasStateClass(state)
      ? this.stateToggleEl.classList.contains(this._stateClasses[state])
      : false;
  }

  // Static methods.
  static getConfig(componentName) {
    const componentConfig = config.STATEFUL_COMPONENTS_CONFIG[componentName];
    if (componentConfig) {
      return componentConfig;
    } else {
      throw new Error(`Ошибка при получении componentConfig для ${componentName}`);
    }
  }

  static getStateClasses(componentName) {
    const stateClasses = StatefulComponent.getConfig(componentName).stateClasses;
    if (stateClasses) {
      return stateClasses;
    } else {
      throw new Error(`Ошибка при получении stateClasses для ${componentName}`);
    }
  }
}