import { StatefulComponent } from './StatefulComponent.js';
import { Accordion } from './Accordion.js';

export class AccordionItem extends StatefulComponent {
  _parentComponent = null;

  constructor(targetElement, parentComponent) {
    super(targetElement);

    if (!(parentComponent instanceof Accordion)) {
      throw new Error(`Экземпляр класса AccordionItem может быть создан только внутри экземпляра класса Accordion`);
    }

    this._parentComponent = parentComponent;

    this._controllerFn = () => this._toggleItem();
  }

  // Instance methods.
  _toggleItem() {
    if (!this._parentComponent || !Array.isArray(this._parentComponent.accordionItems)) {
      return;
    }

    if (this.isState('active')) {
      this.unsetState('active');
    } else {
      this._parentComponent.accordionItems.forEach(item => {
        item.unsetState('active');
      });
      this.setState('active');
    }
  }
}