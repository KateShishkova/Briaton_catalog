import { StatefulComponent } from "./StatefulComponent.js";

export class BurgerMenu extends StatefulComponent {

  // Instance methods.
  openMenu() {
    this.setState('active');
  }

  closeMenu() {
    this.unsetState('active');
  }

  toggleMenu() {
    this.toggleState('active');
  }

}