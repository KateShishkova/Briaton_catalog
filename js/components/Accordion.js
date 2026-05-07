import { ComponentFactory } from './ComponentFactory.js';
import { Component } from './Component.js';
import { StatefulComponent } from './StatefulComponent.js';
import { AccordionItem } from './AccordionItem.js';

export class Accordion extends Component {
  _accordionItems = [];

  constructor(targetSelectorOrElement, container = document.body) {
    super(targetSelectorOrElement, container);
    
    this._initAccordionItems();
  }

  // Accessors.
  set accordionItems(value) {
    if (!(Array.isArray(value)) || !(value.every(item => item instanceof AccordionItem))) {
      return;
    }

    this._accordionItems = value;
  }
  
  get accordionItems() {
    return this._accordionItems;
  }

  // Instance methods.
  _initAccordionItems() {
    if (!this.componentEl) {
      return;
    }

    const accordionItemConfig = StatefulComponent.getConfig('AccordionItem');

    const accordionItemEls = ComponentFactory.getDomEls(accordionItemConfig.componentSelector, this.componentEl);

    this.accordionItems = accordionItemEls.map(el => {
      return new AccordionItem(el, this);
    });
  }
}